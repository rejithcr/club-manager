GET_MEMBER = """
   select member_id, first_name, last_name, email, phone
   from member
   where member_id = %s
"""

GET_MEMBER_BY_EMAIL = """
   select member_id, first_name, last_name, email, phone
   from member
   where email = %s
"""

GET_MEMBER_BY_PHONE = """
   select member_id, first_name, last_name, email, phone
   from member
   where phone = %s
"""


SAVE_MEMBER = """
   insert into member (member_id, first_name, last_name, email, phone, created_by, updated_by) values
    (nextval('member_id_seq'), %s, %s, %s, %s, %s, %s)
"""

SAVE_MEMBERSHIP = """
   insert into membership (membership_id, club_id, member_id, role_id, start_date, created_by, updated_by) values
    (nextval('membership_id_seq'), %s, %s, %s, now(), %s, %s)
"""

GET_MEMBERSHIP_ID = """
   select membership_id
   from membership
   where club_id = %s and member_id = %s
"""

GET_DUES_BY_MEMBER = """
   select a.club_id, a.club_name, sum(a.amount) due_amount,
      json_agg(jsonb_build_object(	
         'fee', a.fee,
         'fee_desc', a.fee_desc,
         'amount', a.amount,
         'payment_id', a.payment_id,	
         'fee_type', a.fee_type
      )) dues
   from (
      select c.club_id, c.club_name, m.member_id, m.first_name, m.last_name , caf.club_adhoc_fee_name fee, caf.club_adhoc_fee_desc fee_desc, cafp.club_adhoc_fee_payment_amount amount, cafp.club_adhoc_fee_payment_id payment_id, 'ADHOC-FEE' fee_type
      from club_adhoc_fee_payment cafp 
         join club_adhoc_fee caf on caf.club_adhoc_fee_id =cafp.club_adhoc_fee_id
         join membership ms on ms.membership_id = cafp.membership_id
         join "member" m on m.member_id = ms.member_id
         join club c on c.club_id = ms.club_id
      where cafp.paid = 0  and m.member_id = %s     
      union 
      select c.club_id, c.club_name, m.member_id, m.first_name, m.last_name , cft.club_fee_type fee, cfc.club_fee_type_period fee_desc,  cft.club_fee_amount amount, cfp.club_fee_payment_id payment_id, 'FEE' fee_type
      from club_fee_payment cfp 
         join club_fee_collection cfc on cfc.club_fee_collection_id = cfp.club_fee_collection_id
         join club_fee_type cft on cft.club_fee_type_id =cfc.club_fee_type_id
         join membership ms on ms.membership_id = cfp.membership_id
         join "member" m on m.member_id = ms.member_id
         join club c on c.club_id = ms.club_id
      where cfp.paid = 0 and m.member_id = %s
   ) a
   group by  a.club_id, a.club_name
"""

REQUEST_MEMBERSHIP = """
   insert into membership_requests (club_id, member_id, status, comments, created_by, updated_by) values
    (%s, %s, 'REQUESTED', 'Please approve', %s, %s)
"""

GET_REQUESTS = """
   select c.club_id, c.club_name, mr.member_id, mr.status, mr.comments, m.first_name, m.last_name, m.phone
   from membership_requests mr     
	   join club c on c.club_id = mr.club_id 
	   join member m on mr.member_id = m.member_id
   where mr.member_id = %s
"""
