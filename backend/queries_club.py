GET_CLUBS = """
    select club_id, club_name from club
"""

GET_CLUB = """
    select club_id, club_name from club where club_id = %s
"""

GET_CLUB_SEQ_NEXT_VAL="select nextval('club_id_seq')"

SAVE_CLUB = """
   insert into club (club_id, club_name, created_by, updated_by) values
    (%s, %s, %s, %s)
"""