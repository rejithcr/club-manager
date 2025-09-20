GET_CLUB_MEMBER_ATTRIBUTES_VALUES = """
    select m.first_name , m.last_name, m.phone, m.email, to_char(date_of_birth, 'YYYY-mm-dd') date_of_birth, 
    json_agg(distinct jsonb_build_object('attribute', cma."attribute", 'attribute_value', cmav.attribute_value)) attributes
    from member m 
	    join membership ms on m.member_id = ms.member_id 
    	left join club_member_attribute_value cmav on cmav.membership_id = ms.membership_id
        left join club_member_attributes cma on cma.club_member_attribute_id = cmav.club_member_attribute_id 
    where ms.club_id = 1
    group by 1,2,3,4,5
"""

