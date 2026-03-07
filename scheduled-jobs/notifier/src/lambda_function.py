"""
Lambda handler for the daily event & birthday notification job.

Trigger: AWS EventBridge Scheduler (daily — e.g. at 18:30 UTC = midnight IST)

What it does:
  1. Fetches all events scheduled for TOMORROW and notifies every active
     member of the corresponding club.
  2. Fetches all members whose birthday is TOMORROW and notifies all of
     their fellow club members (plus sends the birthday member a personal
     greeting).

Environment variables required:
  DB_NAME, DB_HOST, DB_USER, DB_PASSWORD, DB_PORT (optional, default 5432)
"""
import json
import logging

from src import db
from src import queries
from src import notification_service

# Use structured logging for CloudWatch
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s – %(message)s",
    force=True
)
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Main handler
# ---------------------------------------------------------------------------

def handler(event, context):
    """AWS Lambda entry point."""
    logger.info("Daily notification job started")

    summary = {
        "events_processed": 0,
        "event_notifications_sent": 0,
        "birthdays_processed": 0,
        "birthday_notifications_sent": 0,
        "old_read_notifications_deleted": 0,
        "expired_notifications_deleted": 0,
        "errors": []
    }

    conn = None
    try:
        conn = db.get_connection()
        _process_events(conn, summary)
        _process_birthdays(conn, summary)
        _cleanup_read_notifications(conn, summary)
        conn.commit()
        logger.info(f"Job completed successfully. Summary: {summary}")

    except Exception as exc:
        logger.error(f"Fatal error in Lambda handler: {exc}", exc_info=True)
        if conn:
            conn.rollback()
        summary["errors"].append(str(exc))
        return {
            "statusCode": 500,
            "body": json.dumps({"status": "error", "summary": summary})
        }
    finally:
        if conn:
            conn.close()
            logger.debug("DB connection closed")

    return {
        "statusCode": 200,
        "body": json.dumps({"status": "success", "summary": summary})
    }


# ---------------------------------------------------------------------------
# Events
# ---------------------------------------------------------------------------

def _process_events(conn, summary: dict):
    """Notify all active club members about each event scheduled for tomorrow."""
    events = db.fetch(conn, queries.GET_TOMORROWS_EVENTS)
    logger.info(f"Found {len(events)} event(s) scheduled for tomorrow")

    for evt in events:
        try:
            event_id   = evt['event_id']
            title_text = evt['title']
            club_id    = evt['club_id']
            club_name  = evt['club_name']
            location   = evt.get('location') or 'TBD'
            start_time = evt.get('start_time')

            # Build human-friendly time string
            time_str = start_time.strftime('%I:%M %p') if start_time else ''
            notification_title = club_name
            notification_body  = (
                f"📅 {title_text} is scheduled for tomorrow"
                + (f" at {time_str}" if time_str else "")
                + (f", {location}" if location != 'TBD' else "")
                + "."
            )

            # Fetch all active members for this club
            member_rows = db.fetch(conn, queries.GET_ACTIVE_MEMBER_IDS_FOR_CLUB, (club_id,))
            member_ids  = [row['member_id'] for row in member_rows]

            if not member_ids:
                logger.info(f"No active members found for club {club_id}, skipping event {event_id}")
                continue

            notification_service.save_and_push(
                conn,
                member_ids,
                notification_title,
                notification_body,
                target_type="EVENT",
                target_id=str(event_id)
            )

            summary["events_processed"] += 1
            summary["event_notifications_sent"] += len(member_ids)
            logger.info(f"Event '{title_text}' (id={event_id}): notified {len(member_ids)} member(s)")

        except Exception as exc:
            err_msg = f"Error processing event {evt.get('event_id')}: {exc}"
            logger.error(err_msg, exc_info=True)
            summary["errors"].append(err_msg)


# ---------------------------------------------------------------------------
# Birthdays
# ---------------------------------------------------------------------------

def _process_birthdays(conn, summary: dict):
    """
    For each member whose birthday is tomorrow:
      - Notify all their fellow club members
      - Notify the birthday member personally
    """
    birthday_members = db.fetch(conn, queries.GET_TOMORROWS_BIRTHDAY_MEMBERS)
    logger.info(f"Found {len(birthday_members)} member(s) with birthday tomorrow")

    for bday_member in birthday_members:
        try:
            member_id  = bday_member['member_id']
            first_name = bday_member['first_name']
            last_name  = bday_member['last_name']
            club_ids   = bday_member['club_ids']   # list from ARRAY_AGG

            # 1. Notify fellow members (everyone in the same club(s))
            fellow_rows = db.fetch(conn, queries.GET_ACTIVE_MEMBER_IDS_FOR_CLUBS, (club_ids,))
            fellow_ids  = [row['member_id'] for row in fellow_rows if row['member_id'] != member_id]

            if fellow_ids:
                notification_service.save_and_push(
                    conn,
                    fellow_ids,
                    title=f"🎂 {first_name} {last_name}'s birthday is tomorrow",
                    message=f"Wish a happy birthday!",
                    target_type="BIRTHDAY",
                    target_id=str(member_id)
                )
                summary["birthday_notifications_sent"] += len(fellow_ids)

            # 2. Send a personal greeting to the birthday member
            notification_service.save_and_push(
                conn,
                [member_id],
                title="🎉 Your Birthday is Tomorrow!",
                message=f"Wishing you a wonderful day tomorrow, {first_name}!",
                target_type="BIRTHDAY",
                target_id=str(member_id)
            )
            summary["birthday_notifications_sent"] += 1
            summary["birthdays_processed"] += 1

            logger.info(
                f"Birthday for {first_name} {last_name} (id={member_id}): "
                f"notified {len(fellow_ids)} fellow member(s) + personal greeting"
            )

        except Exception as exc:
            err_msg = f"Error processing birthday for member {bday_member.get('member_id')}: {exc}"
            logger.error(err_msg, exc_info=True)
            summary["errors"].append(err_msg)


# ---------------------------------------------------------------------------
# Cleanup: Delete read notifications
# ---------------------------------------------------------------------------

def _cleanup_read_notifications(conn, summary: dict):
    """
    Two-pass notification cleanup:
      1. Delete read notifications older than 3 days.
      2. Delete ALL notifications older than 30 days (regardless of read status).
    Both counts are recorded in the summary for CloudWatch visibility.
    """
    try:
        old_read = db.execute_returning_count(conn, queries.DELETE_OLD_READ_NOTIFICATIONS)
        summary["old_read_notifications_deleted"] = old_read
        logger.info(f"Deleted {old_read} read notification(s) older than 3 days")
    except Exception as exc:
        err_msg = f"Error deleting old read notifications: {exc}"
        logger.error(err_msg, exc_info=True)
        summary["errors"].append(err_msg)

    try:
        expired = db.execute_returning_count(conn, queries.DELETE_EXPIRED_NOTIFICATIONS)
        summary["expired_notifications_deleted"] = expired
        logger.info(f"Deleted {expired} notification(s) older than 30 days")
    except Exception as exc:
        err_msg = f"Error deleting expired notifications: {exc}"
        logger.error(err_msg, exc_info=True)
        summary["errors"].append(err_msg)
