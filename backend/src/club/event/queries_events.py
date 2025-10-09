ADD_EVENT = """
    INSERT INTO events 
    (title, description, event_date, start_time, end_time, location, event_type_id, created_by, status, is_transaction_enabled, is_attendance_enabled)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'Scheduled', %s, %s)
    RETURNING event_id
"""

GET_EVENT_BY_ID = """
    SELECT et.name, e.title, e.description, to_char(start_time, 'HH12:MI am') start_time, to_char(end_time, 'HH12:MI am') end_time, e.location, 
        e.event_type_id, e.created_by, e.status, to_char(event_date, 'YYYY-mm-dd') event_date, is_transaction_enabled, is_attendance_enabled        
    FROM events e
        join event_types et on et.event_type_id = e.event_type_id
    WHERE event_id = %s    
"""

GET_EVENTS = """
    SELECT e.event_id, et.name, e.title, e.description, to_char(start_time, 'HH12:MI am') start_time, to_char(end_time, 'HH12:MI am') end_time, e.location, 
        e.event_type_id, e.created_by, e.status, to_char(event_date, 'YYYY-mm-dd') event_date, is_transaction_enabled, is_attendance_enabled 
    FROM events e
        join event_types et on et.event_type_id = e.event_type_id
        join club c on c.club_id = et.club_id
    WHERE c.club_id = %s
    and (%s = -1 OR e.event_type_id = %s)
    order by event_date desc
    limit %s offset %s
"""


GET_EVENTS_BY_MEMBER = """
    SELECT c.club_id, e.event_id, et.name, e.title, e.description, to_char(start_time, 'HH12:MI am') start_time, to_char(end_time, 'HH12:MI am') end_time, e.location, 
        e.event_type_id, e.created_by, e.status, to_char(event_date, 'YYYY-mm-dd') event_date , c.club_name, is_transaction_enabled, is_attendance_enabled 
    FROM events e
        join event_types et on et.event_type_id = e.event_type_id
        join club c on c.club_id = et.club_id
        join membership ms on ms.club_id = c.club_id and ms.is_active = 1
        join member m on m.member_id = ms.member_id
    WHERE (c.club_id = %s OR %s = -1) and c.is_active = 1
    	and m.member_id = %s
        and e.status = 'Scheduled'
    order by event_date desc
    limit %s offset %s
"""


GET_EVENTS_BY_STATUS = """
    SELECT e.event_id, et.name, e.title, e.description, to_char(start_time, 'HH12:MI am') start_time, to_char(end_time, 'HH12:MI am') end_time, e.location, 
        e.event_type_id, e.created_by, e.status, to_char(event_date, 'YYYY-mm-dd') event_date, is_transaction_enabled, is_attendance_enabled 
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

UPDATE_EVENT_TYPES = """
    UPDATE event_types 
    SET name = %s 
    WHERE club_id = %s AND event_type_id = %s;
"""

DELETE_EVENT_TYPES = """
    DELETE FROM event_types 
    WHERE club_id = %s AND event_type_id = %s;
"""

GET_EVENT_TRANSACTIONS = """
     select t.event_transaction_id, t.event_transaction_amount::REAL, t.event_transaction_type, t.event_transaction_category_type_id,
        t.event_transaction_comment, t.created_by, to_char(t.event_transaction_date, 'YYYY-mm-dd') event_transaction_date,
        t.updated_by, ect.event_category_name
    from event_transaction t
        join event_transaction_category_types ect on t.event_transaction_category_type_id = ect.event_category_type_id
    where t.event_id = %s
        and (%s = 'ALL' OR t.event_transaction_type = %s)
        and (%s = '-1' OR t.event_transaction_category_type_id = %s)
    order by t.event_transaction_date desc, t.event_transaction_id desc
    limit %s offset %s
"""


GET_EVENT_TRANSACTIONS_CATEGORIES = """
    select event_category_type_id, event_category_name from event_transaction_category_types where club_id = %s
"""

GET_EVENT_TRANSACTIONS_CATEGORIES_SEQ_NEXT_VAL="select nextval('event_transaction_category_type_id_seq')"

ADD_EVENT_TRANSACTIONS_CATEGORY_WITH_ID = """
    INSERT INTO event_transaction_category_types (event_category_type_id, club_id, event_category_name, created_by) VALUES  (%s, %s, %s, %s);
"""

ADD_EVENT_TRANSACTION = """
    insert into event_transaction(event_transaction_id, event_id, event_transaction_amount, event_transaction_type, 
        event_transaction_category_type_id, event_transaction_comment, event_transaction_date, created_by, updated_by)
    values(nextval('event_transaction_id_seq'), %s, %s, %s, %s, %s, %s, %s, %s)
"""

UPDATE_EVENT_TRANSACTION = """
    update event_transaction 
    set event_transaction_amount = %s, event_transaction_type = %s, event_transaction_comment = %s, 
    event_transaction_category_type_id = %s, event_transaction_date = %s, updated_by = %s, updated_ts = now()
    where event_transaction_id = %s
"""

DELETE_EVENT_TRANSACTION = """
    delete from event_transaction
    where event_transaction_id = %s
"""

GET_EVENT_FUND_BALANCE = """
    SELECT 
        COALESCE(SUM(
            CASE 
                WHEN event_transaction_type = 'CREDIT' THEN event_transaction_amount
                WHEN event_transaction_type = 'DEBIT'  THEN -event_transaction_amount
                ELSE 0
            END
        ), 0) AS fund_balance
    FROM event_transaction
    where event_id = %s
"""

UPDATE_EVENT_TRANSACTIONS_CATEGORY = """
    UPDATE event_transaction_category_types
    SET event_category_name = %s
    WHERE event_category_type_id = %s;
"""

DELETE_EVENT_TRANSACTIONS_CATEGORY = """
    DELETE FROM event_transaction_category_types WHERE event_category_type_id = %s;
"""