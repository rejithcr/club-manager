GET_ROLE_BY_CLUB = """
    select r.role_id
    from membership m 
    	join "role" r on r.role_id = m.role_id
		join "member" m2 on m2.member_id = m.member_id
		join club c on m.club_id = c.club_id
	where (%s is null or m.club_id = %s)  and m2.email = %s
"""

UPDATE_LAST_ACCESS = """
    update member 
    set last_accessed_on = now()
    where email = %s
"""
