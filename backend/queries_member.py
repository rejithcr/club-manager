GET_MEMBER = """
   select member_id, first_name, last_name, email, phone
   from member
   where member_id = %s
"""


SAVE_MEMBER = """
   insert into member (member_id, first_name, last_name, email, phone, created_by, updated_by) values
    (nextval('member_id_seq'), %s, %s, %s, %s, %s, %s)
"""

SAVE_MEMBERSHIP = """
   insert into membership (membership_id, club_id, member_id, role_id, created_by, updated_by) values
    (nextval('membership_id_seq'), %s, %s, %s, %s, %s)
"""