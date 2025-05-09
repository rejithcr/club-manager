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

GET_CLUB_MEMBERS = """
    select ms.membership_id, m.member_id, m.first_name,m.last_name, m.email , m.phone 
    from club c
        join membership ms on c.club_id=ms.club_id     
        join member m on m.member_id  = ms.member_id    
    where c.club_id = %s
"""

GET_CLUB_SEQ_NEXT_VAL="select nextval('club_id_seq')"

SAVE_CLUB = """
   insert into club (club_id, club_name, created_by, updated_by) values
    (%s, %s, %s, %s)
"""

GET_TRANSACTIONS = """
    select t.club_transaction_id, t.club_transaction_amount, t.club_transcation_type, 
        t.club_transaction_category, t.club_transaction_comment, t.created_by, to_char(t.created_ts, 'YYYY-mm-dd') created_date,
        coalesce(caf.club_adhoc_fee_name, coalesce(cft.club_fee_type, t.club_transaction_category, concat(cft.club_fee_type, '(', cfc.club_fee_type_period, ')'))) fee_name,
        coalesce(m.first_name, am.first_name) member_name
    from club_transaction t
        left join club_fee_payment cfp on cfp.club_transaction_id = t.club_transaction_id
        left join club_fee_collection cfc on cfc.club_fee_collection_id = cfp.club_fee_collection_id 
        left join club_fee_type cft on cft.club_fee_type_id = cfc.club_fee_type_id 
        left join membership ms on ms.membership_id = cfp.membership_id
        left join "member" m on m.member_id = ms.membership_id
        left join club_adhoc_fee_payment cafp on cafp.club_transaction_id = t.club_transaction_id
        left join club_adhoc_fee caf on caf.club_adhoc_fee_id = cafp.club_adhoc_fee_id
        left join membership ams on ams.membership_id = cafp.membership_id 
        left join member am on am.member_id = ams.member_id
    where t.club_id = %s
    order by t.created_ts desc
    limit %s offset %s
"""

ADD_TRANSACTION = """
    insert into club_transaction(club_transaction_id, club_id, club_transaction_amount, club_transcation_type, 
        club_transaction_category, club_transaction_comment, created_by, updated_by)
    values(nextval('club_transaction_id_seq'), %s, %s, %s, %s, %s, %s, %s)
"""
