create table club_adhoc_fee (
    club_adhoc_fee_id integer primary key,
    club_id integer not null,
    club_adhoc_fee_name varchar(50) unique not null, -- Akme cup reg fee
    club_adhoc_fee_desc varchar, 
    club_adhoc_fee_is_active smallint not null, -- 1,0
    created_by varchar(100) not null,
    created_ts timestamp  default now(),
    updated_by varchar(100) not null,
    updated_ts timestamp  default now(),
    FOREIGN KEY (club_id) REFERENCES club(club_id),
    CONSTRAINT unique_adhoc_fee_name UNIQUE (club_id,club_adhoc_fee_name, club_adhoc_fee_is_active)
);
CREATE SEQUENCE club_adhoc_fee_id_seq START 1;

create table club_adhoc_fee_payment (
    club_adhoc_fee_payment_id integer primary key,
    club_adhoc_fee_id integer not null,
    membership_id integer not null,
    club_adhoc_fee_payment_amount integer not null, -- 300
    paid integer not null default 0,
    club_transaction_id BIGINT null, 
    created_by varchar(100) not null,
    created_ts timestamp  default now(),
    updated_by varchar(100) not null,
    updated_ts timestamp  default now(),
    FOREIGN KEY (club_adhoc_fee_id) REFERENCES club_adhoc_fee(club_adhoc_fee_id),
    FOREIGN KEY (membership_id) REFERENCES membership(membership_id),
    FOREIGN KEY (club_transaction_id) REFERENCES club_transaction(club_transaction_id),
    CONSTRAINT unique_club_adhoc_fee_payment UNIQUE (club_adhoc_fee_id, membership_id)
);
CREATE SEQUENCE club_adhoc_fee_payment_id_seq START 1;