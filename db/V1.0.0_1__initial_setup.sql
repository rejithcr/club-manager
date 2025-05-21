create table club (
    club_id integer primary key,
    club_name varchar(50) not null unique,
    created_by varchar(100) not null,
    created_ts timestamp  default now(),
    updated_by varchar(100) not null,
    updated_ts timestamp  default now()
);
CREATE SEQUENCE club_id_seq START 1;

create table member (
    member_id integer primary key,
    first_name varchar(50) not null,
    last_name varchar(50) not null,
    email varchar(100) not null unique,
    phone varchar(13) not null unique,
    created_by varchar(100) not null,
    created_ts timestamp  default now(),
    updated_by varchar(100) not null,
    updated_ts timestamp  default now()
);
CREATE SEQUENCE member_id_seq START 1;

create table role (
    role_id integer primary key,
    role_name varchar(20) not null unique,
    role_desc varchar(100) not null unique,
    created_by varchar(100) not null,
    created_ts timestamp  default now(),
    updated_by varchar(100) not null,
    updated_ts timestamp  default now()
);
CREATE SEQUENCE role_id_seq START 1;
insert into role (role_id, role_name, role_desc, created_by, updated_by) values
    (nextval('role_id_seq'), 'ADMIN', 'Administrator', 'init', 'init'), 
    (nextval('role_id_seq'), 'MAINTAINER', 'Maintainer', 'init', 'init'),
    (nextval('role_id_seq'), 'MEMBER', 'Member', 'init', 'init');

create table membership (
    membership_id integer primary key,
    club_id integer not null,
    member_id integer not null,
    role_id integer not null,
    start_date date not null,
    end_date date,
    created_by varchar(100) not null,
    created_ts timestamp  default now(),
    updated_by varchar(100) not null,
    updated_ts timestamp  default now(),
    FOREIGN KEY (club_id) REFERENCES club(club_id),
    FOREIGN KEY (member_id) REFERENCES member(member_id),
    FOREIGN KEY (role_id) REFERENCES role(role_id),
    CONSTRAINT unique_membership UNIQUE (club_id,member_id)
);
CREATE SEQUENCE membership_id_seq START 1;

create table club_fee_type (
    club_fee_type_id integer primary key,
    club_id integer not null,
    club_fee_type varchar(50) not null, -- MEMBERSHIP, MAINTENANCE, JOINING
    club_fee_type_interval varchar(10) not null, -- MONTHLY / QUATERLY / YEARLY 
    club_fee_is_active smallint not null, -- 1,0
    club_fee_amount numeric(7,2) not null, -- 300
    club_fee_type_desc varchar(100),
    created_by varchar(100) not null,
    created_ts timestamp  default now(),
    updated_by varchar(100) not null,
    updated_ts timestamp  default now(),
    FOREIGN KEY (club_id) REFERENCES club(club_id),
    CONSTRAINT unique_fee_type_period CHECK (club_fee_type_interval in ('MONTHLY','QUARTERLY','YEARLY')),
    CONSTRAINT unique_fee_type UNIQUE (club_id,club_fee_type, club_fee_type_interval, club_fee_is_active)
);
CREATE SEQUENCE club_fee_type_id_seq START 1;


create table club_fee_type_exception (
    club_fee_type_exception_id integer primary key,
    club_fee_type_id integer not null,
    club_fee_type_exception_reason varchar(100) not null,
    club_fee_exception_amount numeric(7,2) not null, -- 300
	club_fee_exception_is_active smallint not null, -- 1,0
    created_by varchar(100) not null,
    created_ts timestamp  default now(),
    updated_by varchar(100) not null,
    updated_ts timestamp  default now(),
    FOREIGN KEY (club_fee_type_id) REFERENCES club_fee_type(club_fee_type_id),
    CONSTRAINT unique_fee_type_exception UNIQUE (club_fee_type_id, club_fee_type_exception_reason)
);
CREATE SEQUENCE club_fee_type_exception_id_seq START 1;

create table club_fee_type_exception_member (
	club_fee_type_exception_member_id integer primary key,
    club_fee_type_exception_id integer not null,
    membership_id integer not null,
    start_date date not null,
    end_date date,
    created_by varchar(100) not null,
    created_ts timestamp  default now(),
    updated_by varchar(100) not null,
    updated_ts timestamp  default now(),
    FOREIGN KEY (club_fee_type_exception_id) REFERENCES club_fee_type_exception(club_fee_type_exception_id),
    FOREIGN KEY (membership_id) REFERENCES membership(membership_id),
    CONSTRAINT unique_club_fee_type_exception_member UNIQUE (club_fee_type_exception_id, membership_id, end_date)
);
CREATE SEQUENCE club_fee_type_exception_member_id_seq START 1;

create table club_fee_collection (
    club_fee_collection_id integer primary key,
    club_fee_type_id integer not null,
    club_fee_type_period varchar(20) not null, -- JAN, Q1, 2024 etc
    club_fee_type_date date not null, -- day 1 of the period
    created_by varchar(100) not null,
    created_ts timestamp  default now(),
    updated_by varchar(100) not null,
    updated_ts timestamp  default now(),
    FOREIGN KEY (club_fee_type_id) REFERENCES club_fee_type(club_fee_type_id),
    CONSTRAINT unique_fee_type_collection_period UNIQUE (club_fee_type_id, club_fee_type_period),
    CONSTRAINT unique_fee_type_collection_date UNIQUE (club_fee_type_id, club_fee_type_date)
);
CREATE SEQUENCE club_fee_collection_id_seq START 1;

create table club_fee_payment (
    club_fee_payment_id integer primary key,
    club_fee_collection_id integer not null,
    membership_id integer not null,
    paid integer not null default 0,
    club_fee_type_exception_member_id integer,
    created_by varchar(100) not null,
    created_ts timestamp  default now(),
    updated_by varchar(100) not null,
    updated_ts timestamp  default now(),
    FOREIGN KEY (club_fee_collection_id) REFERENCES club_fee_collection(club_fee_collection_id),
    FOREIGN KEY (membership_id) REFERENCES membership(membership_id),
    FOREIGN KEY (club_fee_type_exception_member_id) REFERENCES club_fee_type_exception_member(club_fee_type_exception_member_id),
    CONSTRAINT unique_club_fee_payment UNIQUE (club_fee_collection_id, membership_id)
);
CREATE SEQUENCE club_fee_payment_id_seq START 1;

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
    club_adhoc_fee_payment_amount numeric(7,2) not null, -- 300
    paid integer not null default 0,
    created_by varchar(100) not null,
    created_ts timestamp  default now(),
    updated_by varchar(100) not null,
    updated_ts timestamp  default now(),
    FOREIGN KEY (club_adhoc_fee_id) REFERENCES club_adhoc_fee(club_adhoc_fee_id),
    FOREIGN KEY (membership_id) REFERENCES membership(membership_id),
    CONSTRAINT unique_club_adhoc_fee_payment UNIQUE (club_adhoc_fee_id, membership_id)
);
CREATE SEQUENCE club_adhoc_fee_payment_id_seq START 1;

create table club_transaction (
    club_transaction_id BIGINT primary key,
    club_id integer not null,
    club_transaction_amount numeric(7,2) not null,
    club_transcation_type varchar(6) not null, -- CREDIT/DEBIT
    club_transaction_category varchar(100) not null, -- FEE,CASHPRIZE, ...
    club_transaction_comment varchar(100), -- Akme Cup
    club_adhoc_fee_payment_id integer,
    club_fee_payment_id integer,
    created_by varchar(100) not null,
    created_ts timestamp  default now(),
    updated_by varchar(100) not null,
    updated_ts timestamp  default now(),
    FOREIGN KEY (club_id) REFERENCES club(club_id),
    FOREIGN KEY (club_adhoc_fee_payment_id) REFERENCES club_adhoc_fee_payment(club_adhoc_fee_payment_id),
    FOREIGN KEY (club_fee_payment_id) REFERENCES club_fee_payment(club_fee_payment_id),
    CONSTRAINT club_transcation_type_check CHECK (club_transcation_type in ('CREDIT','DEBIT'))
);
CREATE SEQUENCE club_transaction_id_seq START 1;

create table membership_requests (
    club_id integer not null,
    member_id integer not null,
    status varchar(30) not null,
    comments text not null,
    created_by varchar(100) not null,
    created_ts timestamp  default now(),
    updated_by varchar(100) not null,
    updated_ts timestamp  default now(),
    CONSTRAINT membership_status_check CHECK (status in ('REQUESTED','APPROVED','REJECTED')),
    CONSTRAINT unique_membership_request UNIQUE (club_id,member_id)
);