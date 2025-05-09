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
   insert into membership (membership_id, club_id, member_id, role_id, created_by, updated_by) values
    (nextval('membership_id_seq'), %s, %s, %s, %s, %s)
"""

GET_MEMBERSHIP_ID = """
   select membership_id
   from membership
   where club_id = %s and member_id = %s
"""