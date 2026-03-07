"""
Notification service for the scheduled Lambda job.
Handles:
  - Saving notifications to the DB (notification table)
  - Sending Expo push notifications via exponent_server_sdk
"""
import logging
from exponent_server_sdk import (
    DeviceNotRegisteredError,
    PushClient,
    PushMessage,
    PushServerError,
    PushTicketError,
)
from requests.exceptions import ConnectionError, HTTPError

from . import db
from . import queries

logger = logging.getLogger(__name__)


def save_and_push(conn, member_ids: list, title: str, message: str,
                  target_type: str, target_id: str,
                  club_id: int = None, club_name: str = None):
    """
    Save in-app notifications to the DB for the given member IDs,
    then fetch their push tokens and deliver Expo push notifications.

    Args:
        conn:        Active psycopg2 connection (caller owns the transaction)
        member_ids:  List of integer member IDs to notify
        title:       Notification title
        message:     Notification body
        target_type: E.g. 'EVENT' or 'BIRTHDAY'
        target_id:   String ID of the target entity (event_id / member_id)
        club_id:     Optional club ID to include in push payload for ClubContext seeding
        club_name:   Optional club name to include in push payload for ClubContext seeding
    """
    if not member_ids:
        logger.info(f"No members to notify for {target_type} {target_id}")
        return

    logger.info(f"Saving DB notifications → {len(member_ids)} members | "
                f"type={target_type} id={target_id}")

    # 1. Persist in-app notifications
    db.execute(conn, queries.SAVE_NOTIFICATIONS,
               (member_ids, title, message, target_type, str(target_id)))

    # 2. Retrieve push tokens
    token_rows = db.fetch(conn, queries.GET_PUSH_TOKENS_FOR_MEMBERS, (member_ids,))
    push_tokens = [row['push_token'] for row in token_rows]

    if push_tokens:
        logger.info(f"Sending push notifications → {len(push_tokens)} token(s)")
        push_data = {"targetType": target_type, "targetId": str(target_id)}
        if club_id:
            push_data["clubId"] = str(club_id)
        if club_name:
            push_data["clubName"] = club_name
        _send_push_notifications(
            push_tokens,
            title,
            message,
            data=push_data
        )
    else:
        logger.info("No push tokens found; skipping push delivery")


def _send_push_notifications(tokens: list, title: str, body: str, data: dict = None):
    """
    Deliver Expo push notifications to a list of push tokens.
    Errors are logged but do not raise, so the Lambda continues processing.
    """
    client = PushClient()
    messages = [
        PushMessage(to=token, title=title, body=body, data=data or {}, channel_id="default")
        for token in tokens
    ]
    try:
        responses = client.publish_multiple(messages)
        for response in responses:
            try:
                response.validate_response()
            except DeviceNotRegisteredError:
                logger.warning(f"Device not registered: {response.push_message.to}")
            except PushTicketError as e:
                logger.error(f"Push ticket error: {e.errors}")
    except PushServerError as exc:
        logger.error(f"Expo server error: {exc}")
    except (HTTPError, ConnectionError) as exc:
        logger.error(f"Network error sending push: {exc}")
    except Exception as exc:
        logger.error(f"Unexpected error sending push: {exc}")
