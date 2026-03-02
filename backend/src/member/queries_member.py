GET_MEMBER = """
   select member_id, first_name, last_name, email, phone, photo, is_registered, updated_by, to_char(date_of_birth, 'YYYY-mm-dd') date_of_birth
   from member
   where member_id = %s
"""

GET_MEMBER_BY_EMAIL = """
   select member_id, first_name, last_name, email, phone, photo, is_registered, is_super_user, to_char(date_of_birth, 'YYYY-mm-dd') date_of_birth
   from member
   where lower(email) = lower(%s)
"""

GET_MEMBER_BY_PHONE = """
   select member_id, first_name, last_name, email, phone, photo, is_registered, to_char(date_of_birth, 'YYYY-mm-dd') date_of_birth
   from member
   where phone = %s
"""

GET_USERS = """
    select member_id, first_name, last_name, email, phone, photo, is_registered, is_super_user, to_char(date_of_birth, 'YYYY-mm-dd') date_of_birth,
      updated_by, created_by, to_char(created_ts, 'YYYY-MM-DD HH24:MI:SS') created_ts, to_char(updated_ts, 'YYYY-MM-DD HH24:MI:SS') updated_ts,
      to_char(last_accessed_on, 'YYYY-MM-DD HH24:MI:SS') last_accessed_on
    from member
    order by last_accessed_on desc
    limit %s offset %s
"""

SAVE_MEMBER = """
   insert into member (member_id, first_name, last_name, email, phone, photo, date_of_birth, is_registered, created_by, updated_by) values
    (nextval('member_id_seq'), %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

SAVE_MEMBERSHIP = """
   insert into membership (membership_id, club_id, member_id, role_id, start_date, created_by, updated_by) values
    (nextval('membership_id_seq'), %s, %s, %s, now(), %s, %s)
"""

UPSERT_MEMBERSHIP = """
   insert into membership (membership_id, club_id, member_id, role_id, start_date, is_active, created_by, updated_by)
   values (nextval('membership_id_seq'), %s, %s, %s, now(), 1, %s, %s)
   ON CONFLICT (club_id, member_id)
   DO UPDATE SET
      is_active = 1,
      role_id = EXCLUDED.role_id,
      start_date = now(),
      updated_by = EXCLUDED.updated_by,
      updated_ts = now()
"""

GET_MEMBERSHIP_ID = """
   select membership_id
   from membership
   where club_id = %s and member_id = %s and is_active = 1
"""

GET_DUES_BY_MEMBER = """
   select a.club_id, a.club_name, a.upi_id, sum(a.amount)::REAL due_amount,
      json_agg(jsonb_build_object(	
         'fee', a.fee,
         'fee_desc', a.fee_desc,
         'amount', a.amount,
         'payment_id', a.payment_id,	
         'fee_type', a.fee_type
      )) dues
   from (
      select c.club_id, c.club_name, c.upi_id, m.member_id, m.first_name, m.last_name , caf.club_adhoc_fee_name fee, caf.club_adhoc_fee_desc fee_desc, cafp.club_adhoc_fee_payment_amount::REAL amount, cafp.club_adhoc_fee_payment_id payment_id, 'ADHOC-FEE' fee_type
      from club_adhoc_fee_payment cafp 
         join club_adhoc_fee caf on caf.club_adhoc_fee_id =cafp.club_adhoc_fee_id
         join membership ms on ms.membership_id = cafp.membership_id
         join "member" m on m.member_id = ms.member_id
         join club c on c.club_id = ms.club_id
      where cafp.paid = 0  and m.member_id = %s and ms.is_active = 1 and (%s = -1 or c.club_id = %s)  
      union 
      select c.club_id, c.club_name, c.upi_id, m.member_id, m.first_name, m.last_name , cft.club_fee_type fee, cfc.club_fee_type_period fee_desc,  cfp.club_fee_payment_amount::REAL amount, cfp.club_fee_payment_id payment_id, 'FEE' fee_type
      from club_fee_payment cfp 
         join club_fee_collection cfc on cfc.club_fee_collection_id = cfp.club_fee_collection_id
         join club_fee_type cft on cft.club_fee_type_id =cfc.club_fee_type_id
         join membership ms on ms.membership_id = cfp.membership_id
         join "member" m on m.member_id = ms.member_id
         join club c on c.club_id = ms.club_id
      where cfp.paid = 0 and m.member_id = %s and ms.is_active = 1 and (%s = -1 or c.club_id = %s)  
   ) a
   group by  a.club_id, a.club_name, a.upi_id
"""

CHECK_EXISTING_REQUEST = """
   select count(*) as request_count
   from membership_requests
   where club_id = %s and member_id = %s and status = 'REQUESTED'
"""

REQUEST_MEMBERSHIP = """
   insert into membership_requests (club_id, member_id, status, comments, created_by, updated_by, attributes) values
    (%s, %s, 'REQUESTED', 'Please approve', %s, %s, %s)
"""

UPSERT_MEMBERSHIP_REQUEST = """
   insert into membership_requests (club_id, member_id, status, comments, created_by, updated_by, attributes, created_ts, updated_ts)
   values (%s, %s, 'REQUESTED', 'Please approve', %s, %s, %s, now(), now())
   ON CONFLICT (club_id, member_id)
   DO UPDATE SET
      status = 'REQUESTED',
      comments = membership_requests.comments || ' | Re-requested on ' || to_char(now(), 'YYYY-MM-DD HH24:MI:SS'),
      attributes = EXCLUDED.attributes,
      updated_by = EXCLUDED.updated_by,
      updated_ts = now()
"""

GET_REQUESTS = """
   select c.club_id, c.club_name, mr.member_id, mr.status, mr.comments, m.first_name, m.last_name, m.phone
   from membership_requests mr     
	   join club c on c.club_id = mr.club_id 
	   join member m on mr.member_id = m.member_id
   where mr.member_id = %s
"""

UPDATE_MEMBER = """
   update member
   set first_name = %s, last_name = %s, email = %s, phone = %s, date_of_birth = %s, updated_by = %s
   where member_id = %s
"""

VERIFY_MEMBER = """
   update member
   set first_name = %s, last_name = %s, email = %s, phone = %s, photo = %s, date_of_birth = %s, is_registered = %s, updated_by = %s
   where member_id = %s
"""

ADD_MEMBER_ATTRIBUTE = """
   insert into club_member_attributes (club_member_attribute_id, club_id, attribute, required, created_by, created_ts, updated_by, updated_ts)
   values (nextval('club_member_attribute_id_seq'), %s, %s, %s, %s, now(), %s, now())
"""
## Auto created for member attrts
GET_MEMBER_ATTRIBUTES = """
   select club_member_attribute_id, club_id, attribute, required
   from club_member_attributes
   where club_id = %s
"""

## Auto created for member attrts
GET_MEMBER_ATTRIBUTE_VALUES = """
   select cma.club_member_attribute_id, cma."attribute", cma.required, cmav.attribute_value 
   from club_member_attributes cma 
      left join club_member_attribute_value cmav on cma.club_member_attribute_id = cmav.club_member_attribute_id 
      and cmav.membership_id = (select membership_id from membership where club_id=%s and member_id=%s)
   where cma.club_id = %s
   order by cma.required desc, cma."attribute"
"""

UPDATE_MEMBER_ATTRIBUTE = """
   update club_member_attributes
   set attribute = %s, required = %s, updated_by = %s, updated_ts = now()
   where club_member_attribute_id = %s
"""

DELETE_MEMBER_ATTRIBUTE_VALUES = """
   delete from club_member_attribute_value
   where membership_id =(select membership_id from membership where club_id=%s and member_id=%s)
"""

ADD_MEMBER_ATTRIBUTE_VALUE = """
   insert into club_member_attribute_value (club_member_attribute_value_id, club_member_attribute_id, membership_id, attribute_value, created_by, created_ts, updated_by, updated_ts)
   values (nextval('club_member_attribute_value_id_seq'), %s, (select membership_id from membership where club_id=%s and member_id=%s), %s, %s, now(), %s, now())
   ON CONFLICT (club_member_attribute_id, membership_id)
   DO UPDATE SET
      attribute_value = EXCLUDED.attribute_value,
      updated_by = EXCLUDED.updated_by,
      updated_ts = now()
"""

DELETE_MEMBER_ATTRIBUTE = """ 
   delete from club_member_attribute_value
   where club_member_attribute_id = %s;
   delete from club_member_attributes
   where club_member_attribute_id = %s;
"""

GET_UPCOMING_BIRTHDAYS = """
   select m.member_id, m.first_name, m.last_name, m.email, m.phone, m.photo,
          to_char(m.date_of_birth, 'YYYY-MM-DD') as date_of_birth,
          to_char(m.date_of_birth, 'MM-DD') as birthday,
          (DATE(EXTRACT(YEAR FROM CURRENT_DATE) || '-' || to_char(m.date_of_birth, 'MM-DD')) - CURRENT_DATE) as days_until_birthday,
          STRING_AGG(c.club_name, ', ' ORDER BY c.club_name) as club_names,
          COUNT(DISTINCT c.club_id) as club_count,
          MIN(c.club_id) as primary_club_id
   from member m
   join membership ms on m.member_id = ms.member_id and ms.is_active = 1
   join club c on ms.club_id = c.club_id
   where m.date_of_birth is not null 
     and (c.club_id = %s OR %s = -1) and c.is_active = 1
     and (
       -- For all clubs user is member of when memberId is provided
       %s IS NULL OR EXISTS (
         SELECT 1 FROM membership ms2 
         WHERE ms2.member_id = %s 
         AND ms2.club_id = c.club_id 
         AND ms2.is_active = 1
       )
     )
     and (
       -- Birthdays from previous week (-7 days) to next 30 days
       (DATE(EXTRACT(YEAR FROM CURRENT_DATE) || '-' || to_char(m.date_of_birth, 'MM-DD')) - CURRENT_DATE) >= -3
       AND (DATE(EXTRACT(YEAR FROM CURRENT_DATE) || '-' || to_char(m.date_of_birth, 'MM-DD')) - CURRENT_DATE) <= 30
     )
   GROUP BY m.member_id, m.first_name, m.last_name, m.email, m.phone, m.photo, 
            m.date_of_birth, 
            (DATE(EXTRACT(YEAR FROM CURRENT_DATE) || '-' || to_char(m.date_of_birth, 'MM-DD')) - CURRENT_DATE)
   order by 
     CASE 
       -- Today first
       WHEN (DATE(EXTRACT(YEAR FROM CURRENT_DATE) || '-' || to_char(m.date_of_birth, 'MM-DD')) - CURRENT_DATE) = 0 THEN 1
       -- Tomorrow second  
       WHEN (DATE(EXTRACT(YEAR FROM CURRENT_DATE) || '-' || to_char(m.date_of_birth, 'MM-DD')) - CURRENT_DATE) = 1 THEN 2
       -- Future dates
       WHEN (DATE(EXTRACT(YEAR FROM CURRENT_DATE) || '-' || to_char(m.date_of_birth, 'MM-DD')) - CURRENT_DATE) > 1 THEN 3
       -- Past dates last
       ELSE 4
     END,
     ABS(DATE(EXTRACT(YEAR FROM CURRENT_DATE) || '-' || to_char(m.date_of_birth, 'MM-DD')) - CURRENT_DATE),
     m.first_name
"""

## Auto created for member attrts