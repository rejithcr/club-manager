ADD_EVENT = """
    INSERT INTO events 
    (title, description, event_date, start_time, end_time, location, event_type_id, created_by, status)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'Scheduled')
    RETURNING event_id
"""

GET_EVENT_BY_ID = """
    SELECT et.name, e.title, e.description, to_char(start_time, 'HH12:MI am') start_time, to_char(end_time, 'HH12:MI am') end_time, e.location, 
        e.event_type_id, e.created_by, e.status, to_char(event_date, 'YYYY-mm-dd') event_date 
    FROM events e
        join event_types et on et.event_type_id = e.event_type_id
    WHERE event_id = %s    
"""

GET_EVENTS = """
    SELECT e.event_id, et.name, e.title, e.description, to_char(start_time, 'HH12:MI am') start_time, to_char(end_time, 'HH12:MI am') end_time, e.location, 
        e.event_type_id, e.created_by, e.status, to_char(event_date, 'YYYY-mm-dd') event_date 
    FROM events e
        join event_types et on et.event_type_id = e.event_type_id
        join club c on c.club_id = et.club_id
    WHERE c.club_id = %s
    and (%s = 'ALL' OR e.event_type_id = %s)
    order by event_date desc
    limit %s offset %s
"""


GET_EVENTS_BY_MEMBER = """
    SELECT c.club_id, e.event_id, et.name, e.title, e.description, to_char(start_time, 'HH12:MI am') start_time, to_char(end_time, 'HH12:MI am') end_time, e.location, 
        e.event_type_id, e.created_by, e.status, to_char(event_date, 'YYYY-mm-dd') event_date , c.club_name
    FROM events e
        join event_types et on et.event_type_id = e.event_type_id
        join club c on c.club_id = et.club_id
    WHERE c.club_id = ANY(%s) and e.status = 'Scheduled'
    order by event_date desc
    limit %s offset %s
"""


GET_EVENTS_BY_STATUS = """
    SELECT e.event_id, et.name, e.title, e.description, to_char(start_time, 'HH12:MI am') start_time, to_char(end_time, 'HH12:MI am') end_time, e.location, 
        e.event_type_id, e.created_by, e.status, to_char(event_date, 'YYYY-mm-dd') event_date 
    FROM events e
        join event_types et on et.event_type_id = e.event_type_id
        join club c on c.club_id = et.club_id
    WHERE e.status = %s and c.club_id = %s
    order by event_date desc
    limit %s offset %s
"""

GET_EVENT_TYPES = """
    select * 
    from event_types
    where club_id = %s
"""

DELETE_EVENT = """
    DELETE FROM rsvps WHERE event_id = %s;
    DELETE FROM attendance WHERE event_id = %s;
    DELETE FROM events WHERE event_id = %s;
"""

INSERT_EVENT_TYPES = """
    INSERT INTO event_types (club_id, name) VALUES  (%s, %s);
"""
