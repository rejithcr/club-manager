GET_CLUBS = """
    select club_id, club_name from club
"""

GET_CLUB = """
    select club_id, club_name from club where club_id = %s
"""

GET_CLUBS_BY_MEMBER = """
    select c.club_id, c.club_name , r.role_id ,r.role_name
    from club c
        join membership m on c.club_id=m.club_id     
        join role r on m.role_id = r.role_id
    where m.member_id = %s
"""

GET_CLUB_SEQ_NEXT_VAL="select nextval('club_id_seq')"

SAVE_CLUB = """
   insert into club (club_id, club_name, created_by, updated_by) values
    (%s, %s, %s, %s)
"""