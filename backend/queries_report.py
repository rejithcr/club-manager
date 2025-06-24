GET_CLUB_MEMBER_ATTRIBUTES_VALUES = """
    select m.first_name , m.last_name, m.phone, m.email, to_char(date_of_birth, 'YYYY-mm-dd') date_of_birth, cma."attribute", cmav.attribute_value
    from club_member_attribute_value cmav 
        join club_member_attributes cma on cma.club_member_attribute_id = cmav.club_member_attribute_id
        join membership ms on cmav.membership_id = ms.membership_id
        join member m on m.member_id = ms.member_id
    where cma.club_id = %s and cmav.club_member_attribute_id = ANY(%s);
"""

