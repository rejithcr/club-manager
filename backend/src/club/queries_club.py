GET_CLUBS = """
    select club_id, club_name from club
"""

GET_CLUB = """
    select club_id, club_name from club where club_id = %s
"""

SEARCH_CLUB = """
    select club_id, club_name from club 
    where upper(club_name) like %s 
    limit 10
"""

GET_CLUBS_BY_MEMBER = """ 
    select c.club_id, c.club_name , r.role_id ,r.role_name
    from club c
        join membership ms on c.club_id=ms.club_id     
        join role r on ms.role_id = r.role_id      
    where ms.member_id = %s and ms.is_active = 1
"""
GET_CLUB_MEMBER = """
    select m.first_name, m.last_name, m.email, m.phone, m.photo, m.is_registered, r.role_name role, m.updated_by, to_char(date_of_birth, 'YYYY-mm-dd') date_of_birth
    from "member" m 
        join membership m2 on m.member_id = m2.member_id
        join club c on c.club_id = m2.club_id
        join "role" r on m2.role_id = r.role_id
    where m.member_id = %s and c.club_id = %s
"""
GET_CLUB_MEMBERS = """
    select ms.membership_id, m.member_id, m.first_name,m.last_name, m.email , m.phone, m.photo , 
        m.is_registered, to_char(date_of_birth, 'YYYY-mm-dd') date_of_birth,
        r.role_name
    from club c
        join membership ms on c.club_id=ms.club_id     
        join member m on m.member_id  = ms.member_id  
        join role r on ms.role_id = r.role_id    
    where c.club_id = %s and ms.is_active = 1
"""

UPDATE_CLUB_MEMBER_ROLE = """
    update membership 
    set role_id = (select role_id from role where role_name = %s)
    where club_id = %s and member_id = %s
"""

GET_CLUB_SEQ_NEXT_VAL="select nextval('club_id_seq')"

SAVE_CLUB = """
   insert into club (club_id, club_name, description, location, created_by, updated_by) values
    (%s, %s, %s, %s, %s, %s)
"""

GET_TRANSACTIONS = """
    select t.club_transaction_id, t.club_transaction_amount::REAL, t.club_transcation_type, 
        t.club_transaction_category, t.club_transaction_comment, t.created_by, to_char(t.club_transaction_date, 'YYYY-mm-dd') club_transaction_date,
        coalesce(caf.club_adhoc_fee_name, coalesce(cft.club_fee_type, t.club_transaction_category, concat(cft.club_fee_type, '(', cfc.club_fee_type_period, ')'))) fee_name,
        coalesce(m.first_name, am.first_name) member_name
    from club_transaction t
        left join club_fee_payment cfp on cfp.club_fee_payment_id = t.club_fee_payment_id
        left join club_fee_collection cfc on cfc.club_fee_collection_id = cfp.club_fee_collection_id 
        left join club_fee_type cft on cft.club_fee_type_id = cfc.club_fee_type_id 
        left join membership ms on ms.membership_id = cfp.membership_id
        left join "member" m on m.member_id = ms.member_id
        left join club_adhoc_fee_payment cafp on cafp.club_adhoc_fee_payment_id = t.club_adhoc_fee_payment_id
        left join club_adhoc_fee caf on caf.club_adhoc_fee_id = cafp.club_adhoc_fee_id
        left join membership ams on ams.membership_id = cafp.membership_id 
        left join member am on am.member_id = ams.member_id
    where t.club_id = %s
	    and t.club_fee_payment_id is null and t.club_adhoc_fee_payment_id is null
        and (%s = 'ALL' OR t.club_transcation_type = %s)
    order by t.club_transaction_date desc
    limit %s offset %s
"""

GET_TRANSACTIONS_ALL = """
    select t.club_transaction_id, t.club_transaction_amount::REAL, t.club_transcation_type, 
        t.club_transaction_category, t.club_transaction_comment, t.created_by, to_char(t.club_transaction_date, 'YYYY-mm-dd') club_transaction_date,
        coalesce(caf.club_adhoc_fee_name, coalesce(cft.club_fee_type, t.club_transaction_category, concat(cft.club_fee_type, '(', cfc.club_fee_type_period, ')'))) fee_name,
        coalesce(m.first_name, am.first_name) member_name
    from club_transaction t
        left join club_fee_payment cfp on cfp.club_fee_payment_id = t.club_fee_payment_id
        left join club_fee_collection cfc on cfc.club_fee_collection_id = cfp.club_fee_collection_id 
        left join club_fee_type cft on cft.club_fee_type_id = cfc.club_fee_type_id 
        left join membership ms on ms.membership_id = cfp.membership_id
        left join "member" m on m.member_id = ms.member_id
        left join club_adhoc_fee_payment cafp on cafp.club_adhoc_fee_payment_id = t.club_adhoc_fee_payment_id
        left join club_adhoc_fee caf on caf.club_adhoc_fee_id = cafp.club_adhoc_fee_id
        left join membership ams on ams.membership_id = cafp.membership_id 
        left join member am on am.member_id = ams.member_id
    where t.club_id = %s
    order by t.club_transaction_date desc
    limit %s offset %s
"""

ADD_TRANSACTION = """
    insert into club_transaction(club_transaction_id, club_id, club_transaction_amount, club_transcation_type, 
        club_transaction_category, club_transaction_comment, club_transaction_date, created_by, updated_by)
    values(nextval('club_transaction_id_seq'), %s, %s, %s, %s, %s, %s, %s, %s)
"""

UPDATE_TRANSACTION = """
    update club_transaction 
    set club_transaction_amount = %s, club_transcation_type = %s, club_transaction_category = %s, club_transaction_comment = %s, 
    club_transaction_date = %s, updated_by = %s, updated_ts = now()
    where club_transaction_id = %s
"""

DELETE_TRANSACTION = """
    delete from club_transaction
    where club_transaction_id = %s
"""

GET_FUND_BALANCE = """
    select (c.credit - d.debit)::REAL fund_balance
    from (
        select coalesce(sum(t.club_transaction_amount), 0) credit
        from "club_transaction" t
        where t.club_transcation_type ='CREDIT'
            and t.club_id = %s            
    ) c,  (
        select coalesce(sum(t.club_transaction_amount), 0) debit
        from "club_transaction" t
        where t.club_transcation_type ='DEBIT'
            and t.club_id = %s
    ) d
"""

TOTAL_DUE = """
	select (c.adhoc + d.regular)::REAL total_due
    from (
       select coalesce(sum(club_adhoc_fee_payment_amount),0) adhoc
		from club_adhoc_fee_payment cafp 
		join club_adhoc_fee caf on caf.club_adhoc_fee_id =cafp.club_adhoc_fee_id
		where caf.club_id = %s and cafp.paid = 0            
    ) c, (
      select coalesce(sum(cfp.club_fee_payment_amount),0) regular
		from club_fee_payment cfp 
			join club_fee_collection cfc on cfc.club_fee_collection_id = cfp.club_fee_collection_id
			join club_fee_type cft on cft.club_fee_type_id =cfc.club_fee_type_id
		where cft.club_id = %s and cfp.paid = 0

    ) d
"""


GET_DUES = """
   select a.member_id, a.first_name, a.last_name, sum(a.amount)::REAL total_due, 
      json_agg(jsonb_build_object(	
         'fee', a.fee,
         'fee_desc', a.fee_desc,
         'amount', a.amount,
         'payment_id', a.payment_id,	
         'fee_type', a.fee_type
      )) dues
   from (
      select m.member_id, m.first_name, m.last_name , caf.club_adhoc_fee_name fee, caf.club_adhoc_fee_desc fee_desc, cafp.club_adhoc_fee_payment_amount amount, cafp.club_adhoc_fee_payment_id payment_id, 'ADHOC-FEE' fee_type
      from club_adhoc_fee_payment cafp 
         join club_adhoc_fee caf on caf.club_adhoc_fee_id =cafp.club_adhoc_fee_id
         join membership ms on ms.membership_id = cafp.membership_id
         join "member" m on m.member_id = ms.member_id
      where cafp.paid =0 and ms.club_id = %s    
      union 
      select m.member_id, m.first_name, m.last_name , cft.club_fee_type fee, cfc.club_fee_type_period fee_desc,  cfp.club_fee_payment_amount amount, cfp.club_fee_payment_id payment_id, 'FEE' fee_type
      from club_fee_payment cfp 
         join club_fee_collection cfc on cfc.club_fee_collection_id = cfp.club_fee_collection_id
         join club_fee_type cft on cft.club_fee_type_id =cfc.club_fee_type_id
         join membership ms on ms.membership_id = cfp.membership_id
         join "member" m on m.member_id = ms.member_id
      where cfp.paid = 0 and ms.club_id = %s
   ) a
   group by a.member_id, a.first_name, a.last_name
   order by 4 desc
"""

GET_MEMBERSHIP_REQUESTS = """
	select club_id, m.member_id, status, m.first_name, m.last_name, comments, 
        case status when 'REQUESTED' then 1 when 'REJECTED' then 2 else 3 end		
    from membership_requests mr
    	join member m on mr.member_id = m.member_id
    where club_id = %s
    order by 7
"""

UPDATE_MEMBERSHIP_REQUEST_STATUS = """
    update membership_requests
    set status = %s, comments = concat(comments, ', ', %s), updated_by = %s
    where club_id = %s
        and member_id = %s
"""

DELETE_MEMBERSHIP = """
    delete from membership where club_id = %s and member_id = %s
"""

GET_CLUB_COUNTS = """
    select 'openMembershipRequests' count_type, count(*) 
    from membership_requests mr
    where mr.club_id = %s and mr.status = 'REQUESTED'
"""

REMOVE_MEMBERSHIP = """
    update membership
    set is_active = 0, updated_by = %s, updated_ts = now()
    where club_id = %s and member_id = %s
"""
