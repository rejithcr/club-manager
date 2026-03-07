import logging
from exponent_server_sdk import (
    DeviceNotRegisteredError,
    PushClient,
    PushMessage,
    PushServerError,
    PushTicketError,
)
from requests.exceptions import ConnectionError, HTTPError
from src import db

logger = logging.getLogger(__name__)

def send_notification(conn, member_ids, title, message, target_type, target_id, club_id=None):
    """
    Persists in-app notifications and sends immediate push notifications.
    If club_id is provided, the club name is prepended to the title.
    """
    if not member_ids:
        return
    
    if club_id:
        club_row = db.fetch_one(conn, "SELECT club_name FROM club WHERE club_id = %s", (club_id,))
        if club_row:
            if title:
                title = f"{club_row['club_name']} - {title}"
            else:
                title = club_row['club_name']
    
    unique_member_ids = list(set(member_ids))
    
    # 1. Insert in-app notifications
    query = """
        INSERT INTO notification (member_id, title, message, target_type, target_id)
        SELECT unnest(%s::int[]), %s, %s, %s, %s
    """
    db.execute(conn, query, (unique_member_ids, title, message, target_type, str(target_id)))
    
    # 2. Retrieve push tokens
    token_query = """
        SELECT push_token
        FROM member_push_token
        WHERE member_id = ANY(%s)
    """
    token_rows = db.fetch(conn, token_query, (unique_member_ids,))
    push_tokens = [row['push_token'] for row in token_rows if row.get('push_token')]
    
    if push_tokens:
        _send_push_notifications(
            push_tokens,
            title,
            message,
            data={"targetType": target_type, "targetId": str(target_id)}
        )

def _send_push_notifications(tokens: list, title: str, body: str, data: dict = None):
    """
    Deliver Expo push notifications to a list of push tokens.
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
                # This will raise if the push was not successful
                response.validate_response()
            except DeviceNotRegisteredError:
                # Mark token as inactive or log it
                logger.warning(f"Device not registered: {response.push_message.to}")
            except PushTicketError as e:
                logger.error(f"Push ticket error: {e.errors}")
    except PushServerError as exc:
        logger.error(f"Expo server error: {exc}")
    except (HTTPError, ConnectionError) as exc:
        logger.error(f"Network error sending push: {exc}")
    except Exception as exc:
        logger.error(f"Unexpected error sending push: {exc}")
