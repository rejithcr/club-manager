GET_FEES = """
           select cft.club_fee_type_id, \
                  club_id, \
                  club_fee_type, \
                  club_fee_type_interval,
                  club_fee_is_active, \
                  club_fee_amount::REAL, \
                  club_fee_type_desc,
                  json_agg(json_build_object(
                          'club_fee_type_exception_id', cfte.club_fee_type_exception_id,
                          'exception_type', cfte.club_fee_type_exception_reason,
                          'exception_amount', cfte.club_fee_exception_amount
                           )) exception_types
           from club_fee_type cft
                    left join club_fee_type_exception cfte on cft.club_fee_type_id = cfte.club_fee_type_id
           where club_id = %s
           group by cft.club_fee_type_id, club_id, club_fee_type, club_fee_type_interval,
                    club_fee_is_active, club_fee_amount, club_fee_type_desc \
           """

GET_FEES_BY_ID = """
                 select club_fee_type_id, \
                        club_id, \
                        club_fee_type, \
                        club_fee_type_interval,
                        club_fee_is_active, \
                        club_fee_amount::REAL, \
                        club_fee_type_desc
                 from club_fee_type
                 where club_fee_type_id = %s \
                 """

ADD_FEE_TYPE = """
               insert into club_fee_type(club_fee_type_id, club_id, club_fee_type, club_fee_type_interval,
                                         club_fee_is_active, club_fee_amount, created_by, updated_by)
               values (nextval('club_fee_type_id_seq'), %s, %s, %s, 1, %s, %s, %s) \
               """

EDIT_FEE_TYPE = """
                update club_fee_type
                set club_fee_type          = %s, \
                    club_fee_type_interval = %s,
                    club_fee_amount        = %s, \
                    updated_by             = %s
                where club_fee_type_id = %s \
                """

DELETE_FEE_TYPE = """
                  delete \
                  from club_fee_type_exception_member
                  where club_fee_type_exception_id in (select club_fee_type_exception_id \
                                                       from club_fee_type_exception \
                                                       where club_fee_type_id = %s);

                  delete \
                  from club_fee_type_exception
                  where club_fee_type_id = %s;

                  delete \
                  from club_fee_type
                  where club_fee_type_id = %s; \
                  """

GET_FEE_TYPE_EXCEPTIONS = """
                          select club_fee_type_exception_id, \
                                 club_fee_type_id, \
                                 club_fee_type_exception_reason,
                                 club_fee_exception_amount::REAL
                          from club_fee_type_exception
                          where club_fee_type_id = %s \
                          """

GET_COLLECTIONS_OF_EXCEPTION = """
                               select distinct cfc.club_fee_type_period
                               from club_fee_type_exception cfte
                                        join club_fee_type cft on cft.club_fee_type_id = cfte.club_fee_type_id
                                        join club_fee_collection cfc on cfc.club_fee_type_id = cft.club_fee_type_id
                                        join club_fee_type_exception_member cftem \
                                             on cftem.club_fee_type_exception_id = cfte.club_fee_type_exception_id
                                        join club_fee_payment cfp on cftem.club_fee_type_exception_member_id = \
                                                                     cfp.club_fee_type_exception_member_id
                               where cfte.club_fee_type_exception_id = %s \
                               """

GET_FEE_TYPE_EXCEPTION = """
                         select cfte.club_fee_type_exception_id, \
                                cfte.club_fee_type_id, \
                                cfte.club_fee_type_exception_reason,
                                cfte.club_fee_exception_amount::REAL,
                                json_agg(distinct jsonb_build_object(
			'club_fee_type_exception_member_id', cftem.club_fee_type_exception_member_id,
			'membership_id', cftem.membership_id,
			'start_date', cftem.start_date,
			'end_date', cftem.end_date,
			'member_id', m.member_id,
			'first_name', m.first_name,
			'last_name', m.last_name
		)) members
                         from club_fee_type_exception cfte
                                  left join club_fee_type_exception_member cftem \
                                            on cfte.club_fee_type_exception_id = cftem.club_fee_type_exception_id
                                  left join membership ms on cftem.membership_id = ms.membership_id
                                  left join member m on m.member_id = ms.member_id
                         where cfte.club_fee_type_exception_id = %s
                         group by cfte.club_fee_type_exception_id, cfte.club_fee_type_id, \
                                  cfte.club_fee_type_exception_reason,
                                  cfte.club_fee_exception_amount \
                         """

GET_FEE_TYPE_EXCEPTIONS = """
                          select club_fee_type_exception_id, \
                                 club_fee_type_id, \
                                 club_fee_type_exception_reason,
                                 club_fee_exception_amount::REAL
                          from club_fee_type_exception
                          where club_fee_type_id = %s \
                          """
GET_FEE_TYPE_EXCEPTION_SEQ_NEXT_VAL = "select nextval('club_fee_type_exception_id_seq')"

ADD_FEE_TYPE_EXCEPTION = """
                         insert into club_fee_type_exception(club_fee_type_exception_id, club_fee_type_id,
                                                             club_fee_type_exception_reason, club_fee_exception_amount, \
                                                             club_fee_exception_is_active,
                                                             created_by, updated_by)
                         values (%s, %s, %s, %s, 1, %s, %s) \
                         """

UPDATE_FEE_TYPE_EXCEPTION = """
                            update club_fee_type_exception
                            set club_fee_type_exception_reason = %s, \
                                club_fee_exception_amount      = %s, \
                                updated_by                     = %s
                            where club_fee_type_exception_id = %s \
                            """

ADD_FEE_TYPE_EXCEPTION_MEMBER = """
                                insert into club_fee_type_exception_member(club_fee_type_exception_member_id, \
                                                                           club_fee_type_exception_id,
                                                                           membership_id, start_date, created_by, \
                                                                           updated_by)
                                values (nextval('club_fee_type_exception_member_id_seq'), %s, %s, now(), %s, %s) \
                                """
UPDATE_FEE_TYPE_EXCEPTION_MEMBER_END_DATE = """
                                            update club_fee_type_exception_member
                                            set end_date   = %s, \
                                                updated_by = %s
                                            where club_fee_type_exception_member_id = %s \
                                            """

GET_FEE_TYPE_EXCEPTION_MEMBERS = """
                                 select club_fee_type_exception_member_id, \
                                        club_fee_type_exception_id, \
                                        membership_id,
                                        start_date, \
                                        end_date
                                 from club_fee_type_exception_member
                                 where club_fee_type_exception_id = %s \
                                 """

GET_FEE_TYPE_EXCEPTION_MEMBER_SEQ_NEXT_VAL = "select nextval('club_fee_type_exception_member_id_seq')"

GET_OPEN_FEE_EXCEPTION_PAYMENTS = """
                                  select cfc.club_fee_type_period
                                  from club_fee_payment cfp
                                           join club_fee_collection cfc \
                                                on cfc.club_fee_collection_id = cfp.club_fee_collection_id
                                  where 1 = 1
                                    and club_fee_type_exception_member_id = %s
                                    and cfp.paid = 0 \
                                  """

GET_LATEST_COLLECTION_PERIOD = """
                               select cfc.club_fee_type_period, cfc.club_fee_type_date
                               from club_fee_collection cfc
                                        join club_fee_type cft on cfc.club_fee_type_id = cfc.club_fee_type_id
                               where cft.club_fee_type_id = %s
                                 and cfc.club_fee_type_date = (select max(club_fee_type_date) \
                                                               from club_fee_collection \
                                                               where club_fee_type_id = %s) \

                               """

GET_NEXT_PAYTMENT_COLLECTION_LIST = """
                                    select s.member_id, \
                                           s.first_name, \
                                           s.last_name, \
                                           s.membership_id,
                                           json_agg(distinct jsonb_build_object('club_fee_amount', s.club_fee_amount::REAL, 'club_fee_type_exception_member_id', s.club_fee_type_exception_member_id)) exceptions
                                    from (select m.member_id, \
                                                 m.first_name, \
                                                 m.last_name, \
                                                 ms.membership_id, \
                                                 (case \
                                                      when cftem.membership_id is not null \
                                                          then cfte.club_fee_exception_amount \
                                                      else cft.club_fee_amount end) as club_fee_amount, \
                                                 cftem.club_fee_type_exception_member_id \
                                          from club c \
                                                   join membership ms on c.club_id = ms.club_id \
                                                   join "member" m on ms.member_id = m.member_id \
                                                   join club_fee_type cft on cft.club_id = c.club_id \
                                                   left join club_fee_type_exception cfte \
                                                             on cfte.club_fee_type_id = cft.club_fee_type_id \
                                                   left join club_fee_type_exception_member cftem \
                                                             on cftem.club_fee_type_exception_id = \
                                                                cfte.club_fee_type_exception_id \
                                                                 and cftem.membership_id = ms.membership_id and \
                                                                cftem.end_date is null \
                                          where cft.club_fee_type_id = %s \
                                            and ms.is_active = 1) s
                                    group by s.member_id, s.first_name, s.last_name, s.membership_id
                                    order by s.first_name asc \
                                    """

GET_FEE_COLLECTION_BY_FEE_TYPE_ID = """
                                    select s.club_fee_collection_id, \
                                           s.club_fee_type_period, \
                                           s.club_fee_type_date,
                                           sum(s.club_fee_payment_amount)::REAL          total, \
                                           sum(s.paid * s.club_fee_payment_amount)::REAL collected,
                                           sum(s.paid * s.club_fee_payment_amount)/sum(s.club_fee_payment_amount)*100 as percentage
                                    from (select cfc.club_fee_collection_id, \
                                                 cfc.club_fee_type_period, \
                                                 to_char(cfc.club_fee_type_date, 'YYYY-MM-DD') club_fee_type_date, \
                                                 cfp.club_fee_payment_amount, \
                                                 cfp.paid \
                                          from club_fee_collection cfc \
                                                   inner join club_fee_payment cfp \
                                                              on cfc.club_fee_collection_id = cfp.club_fee_collection_id \
                                          where cfc.club_fee_type_id = %s) s
                                    group by s.club_fee_collection_id, s.club_fee_type_period, s.club_fee_type_date
                                    order by percentage, club_fee_type_date desc \
                                    limit %s offset %s 
                                    """

GET_FEE_PAYMENT_BY_FEE_COLLECTION_ID = """
                                       select cfp.club_fee_payment_id, \
                                              m.first_name, \
                                              m.last_name, \
                                              cfp.paid, \
                                              cfp.club_fee_payment_amount::REAL as amount
                                       from club_fee_payment cfp
                                                inner join club_fee_collection cfc \
                                                           on cfc.club_fee_collection_id = cfp.club_fee_collection_id
                                                inner join membership ms on cfp.membership_id = ms.membership_id
                                                inner join "member" m on m.member_id = ms.member_id
                                       where cfp.club_fee_collection_id = %s
                                       order by cfp.paid, amount \
                                       """

GET_FEE_TYPE_COLLECTION_SEQ_NEXT_VAL = "select nextval('club_fee_collection_id_seq')"

ADD_FEE_TYPE_COLLECTION_START = """
                                insert into club_fee_collection(club_fee_collection_id, club_fee_type_id,
                                                                club_fee_type_period, club_fee_type_date, created_by, \
                                                                updated_by)
                                values (%s, %s, %s, %s, %s, %s) \
                                """

GET_TRANSACTION_IDS_TO_BE_DELETED = """
                                    select club_fee_payment_id
                                    from club_fee_payment cfp
                                    where cfp.club_fee_collection_id = %s \
                                    """

DELETE_FEE_COLLECTION = """
                        delete \
                        from club_fee_payment
                        where club_fee_collection_id = %s;

                        delete \
                        from club_fee_collection
                        where club_fee_collection_id = %s; \
                        """

DELETE_ADHOC_FEE_COLLECTION = """
                              delete \
                              from club_adhoc_fee_payment
                              where club_adhoc_fee_id = %s;

                              delete \
                              from club_adhoc_fee
                              where club_adhoc_fee_id = %s; \

                              """

ADD_FEE_TYPE_PAYMENT = """
                       insert into club_fee_payment(club_fee_payment_id, club_fee_collection_id, membership_id,
                                                    club_fee_payment_amount, club_fee_type_exception_member_id, \
                                                    created_by, updated_by)
                       values (nextval('club_fee_payment_id_seq'), %s, %s, %s, %s, %s, %s) \
                       """

UPDATE_FEE_PAYMENT_STATUS = """
                            update club_fee_payment cfp
                            set paid       = %s, \
                                updated_by = %s
                            where cfp.club_fee_payment_id = %s \
                            """

UPDATE_ADHOC_FEE_PAYMENT_STATUS = """
                                  update club_adhoc_fee_payment cafp
                                  set paid       = %s, \
                                      updated_by = %s
                                  where cafp.club_adhoc_fee_payment_id = %s \
                                  """

# GET_TRANSACTION_ID_SEQ_NEXT_VAL = "select nextval('club_transaction_id_seq')"

ADD_FEE_TRANSACTION = """
                      insert into club_transaction(club_transaction_id, club_id, club_transaction_amount, \
                                                   club_transcation_type,
                                                   club_transaction_category, club_transaction_comment, \
                                                   club_fee_payment_id, club_transaction_date, created_by, updated_by)
                      values (nextval('club_transaction_id_seq'), %s, %s, %s, %s, %s, %s, %s, %s, %s) \
                      """

ADD_ADHOC_FEE_TRANSACTION = """
                            insert into club_transaction(club_transaction_id, club_id, club_transaction_amount, \
                                                         club_transcation_type,
                                                         club_transaction_category, club_transaction_comment, \
                                                         club_adhoc_fee_payment_id, club_transaction_date, created_by, \
                                                         updated_by)
                            values (nextval('club_transaction_id_seq'), %s, %s, %s, %s, %s, %s, %s, %s, %s) \
                            """

DELETE_FEE_TRANSACTION = """
                         delete \
                         from club_transaction
                         where club_fee_payment_id = %s \
                         """

DELETE_ADHOC_FEE_TRANSACTION = """
                               delete \
                               from club_transaction
                               where club_adhoc_fee_payment_id = %s \
                               """

GET_FEE_ADHOC_ID_SEQ_NEXT_VAL = "select nextval('club_adhoc_fee_id_seq')"

ADD_FEE_ADHOC = """
                insert into club_adhoc_fee(club_adhoc_fee_id, club_id, club_adhoc_fee_name,
                                           club_adhoc_fee_desc, club_adhoc_fee_date, club_adhoc_fee_is_active, created_by, updated_by)
                values (%s, %s, %s, %s, %s, %s, %s, %s) \
                """

UPDATE_FEE_ADHOC = """
    update club_adhoc_fee
    set club_adhoc_fee_name = %s, club_adhoc_fee_desc = %s, 
        club_adhoc_fee_date = %s, updated_by = %s
    where club_adhoc_fee_id = %s
"""

ADD_FEE_ADHOC_PAYMENT = """
                        insert into club_adhoc_fee_payment(club_adhoc_fee_payment_id, club_adhoc_fee_id, membership_id,
                                                           club_adhoc_fee_payment_amount, created_by, updated_by)
                        values (nextval('club_adhoc_fee_payment_id_seq'), %s, %s, %s, %s, %s) \
                        """

GET_FEE_ADHOC_COLLECTIONS = """
                            select caf.club_adhoc_fee_id, \
                                   caf.club_adhoc_fee_name, \
                                   caf.club_adhoc_fee_desc, \
                                   to_char(caf.club_adhoc_fee_date, 'YYYY-mm-dd') club_adhoc_fee_date, \
                                   caf.club_adhoc_fee_is_active, \
                                   sum(cafp.club_adhoc_fee_payment_amount)::REAL club_adhoc_fee_payment_amount,
                                   cast(sum(cafp.paid) as numeric) / count(*) * 100 completion_percentage
                            from club_adhoc_fee caf
                                     join club_adhoc_fee_payment cafp on caf.club_adhoc_fee_id = cafp.club_adhoc_fee_id
                            where caf.club_id = %s
                            group by caf.club_adhoc_fee_id, caf.club_adhoc_fee_name, caf.club_adhoc_fee_desc, \
                                     caf.club_adhoc_fee_date, caf.club_adhoc_fee_is_active
                            order by 7 
                            limit %s offset %s 
                            """

GET_FEE_ADHOC_COLLECTION_BY_ID = """
                                 select caf.club_id, \
                                        caf.club_adhoc_fee_name, \
                                        caf.club_adhoc_fee_desc, \
                                        to_char(caf.club_adhoc_fee_date, 'YYYY-mm-dd') club_adhoc_fee_date, \
                                        caf.club_adhoc_fee_is_active, \
                                        sum(cafp.club_adhoc_fee_payment_amount)::REAL club_adhoc_fee_payment_amount,
                                        json_agg(json_build_object(
                                                'club_adhoc_fee_payment_id', cafp.club_adhoc_fee_payment_id,
                                                'paid', cafp.paid,
                                                'first_name', m.first_name,
                                                'last_name', m.last_name,
                                                'club_adhoc_fee_payment_amount', cafp.club_adhoc_fee_payment_amount
                                                 ))                             member_adhoc_fees
                                 from club_adhoc_fee caf
                                          join club_adhoc_fee_payment cafp \
                                               on caf.club_adhoc_fee_id = cafp.club_adhoc_fee_id
                                          join membership ms on ms.membership_id = cafp.membership_id
                                          join "member" m on m.member_id = ms.member_id
                                 where caf.club_adhoc_fee_id = %s
                                 group by caf.club_id, caf.club_adhoc_fee_name, caf.club_adhoc_fee_desc,
                                          caf.club_adhoc_fee_date, caf.club_adhoc_fee_is_active \
                                 """

GET_ADHOC_TRANSACTION_IDS_TO_BE_DELETED = """
                                          select club_adhoc_fee_payment_id
                                          from club_adhoc_fee_payment cafp
                                          where cafp.club_adhoc_fee_id = %s \
                                          """
