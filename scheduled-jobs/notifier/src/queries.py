"""
SQL queries for the scheduled notification Lambda job.
"""

# -------------------------------------------------------------------
# Events: Fetch all events scheduled for tomorrow (across all clubs)
# -------------------------------------------------------------------
GET_TOMORROWS_EVENTS = """
    SELECT
        e.event_id,
        e.title,
        e.description,
        e.location,
        e.start_time,
        e.end_time,
        e.event_date,
        et.club_id,
        c.club_name,
        e.event_type_id
    FROM events e
    JOIN event_types et ON e.event_type_id = et.event_type_id
    JOIN club c ON et.club_id = c.club_id
    WHERE e.event_date = CURRENT_DATE + 1
      AND e.status = 'Scheduled'
      AND c.is_active = 1
    ORDER BY e.start_time
"""

# -------------------------------------------------------------------
# Members: All active members for a given club
# -------------------------------------------------------------------
GET_ACTIVE_MEMBER_IDS_FOR_CLUB = """
    SELECT m.member_id
    FROM membership ms
    JOIN member m ON ms.member_id = m.member_id
    WHERE ms.club_id = %s
      AND ms.is_active = 1
"""

# -------------------------------------------------------------------
# Birthdays: Members whose birthday is tomorrow, with their clubs
# -------------------------------------------------------------------
GET_TOMORROWS_BIRTHDAY_MEMBERS = """
    SELECT
        m.member_id,
        m.first_name,
        m.last_name,
        ARRAY_AGG(DISTINCT ms.club_id) AS club_ids
    FROM member m
    JOIN membership ms ON m.member_id = ms.member_id
    JOIN club c ON ms.club_id = c.club_id
    WHERE m.date_of_birth IS NOT NULL
      AND to_char(m.date_of_birth, 'MM-DD') = to_char(CURRENT_DATE + 1, 'MM-DD')
      AND ms.is_active = 1
      AND c.is_active = 1
    GROUP BY m.member_id, m.first_name, m.last_name
"""

# -------------------------------------------------------------------
# Members: All active members across a set of clubs (for birthday notification)
# -------------------------------------------------------------------
GET_ACTIVE_MEMBER_IDS_FOR_CLUBS = """
    SELECT DISTINCT m.member_id
    FROM membership ms
    JOIN member m ON ms.member_id = m.member_id
    WHERE ms.club_id = ANY(%s)
      AND ms.is_active = 1
"""

# -------------------------------------------------------------------
# Push tokens: Fetch all push tokens for the given member IDs
# -------------------------------------------------------------------
GET_PUSH_TOKENS_FOR_MEMBERS = """
    SELECT member_id, push_token
    FROM member_push_token
    WHERE member_id = ANY(%s)
"""

# -------------------------------------------------------------------
# Notifications: Bulk insert into the notification table
# -------------------------------------------------------------------
SAVE_NOTIFICATIONS = """
    INSERT INTO notification (member_id, title, message, target_type, target_id)
    SELECT unnest(%s::int[]), %s, %s, %s, %s
"""
