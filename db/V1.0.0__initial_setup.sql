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
    created_by varchar(100) not null,
    created_ts timestamp  default now(),
    updated_by varchar(100) not null,
    updated_ts timestamp  default now(),
    FOREIGN KEY (club_id) REFERENCES club(club_id),
    FOREIGN KEY (member_id) REFERENCES member(member_id),
    FOREIGN KEY (role_id) REFERENCES role(role_id)
);
CREATE SEQUENCE membership_id_seq START 1;

create table club_fee_type (
    club_fee_type_id integer primary key,
    club_id integer not null,
    club_fee_type varchar(50) not null, -- MEMBERSHIP, MAINTENANCE, JOINING, TOURNEY REG FEE
    club_fee_type_period varchar(10) not null, -- REGULAR / OTO
    club_fee_type_desc varchar(100) not null,
    created_by varchar(100) not null,
    created_ts timestamp  default now(),
    updated_by varchar(100) not null,
    updated_ts timestamp  default now(),
    CONSTRAINT unique_fe_type UNIQUE (club_id,club_fee_type)
);
CREATE SEQUENCE club_fee_type_id_seq START 1;


create table transaction (
    transaction_id BIGINT primary key,
    transaction_amount numeric not null,
    transcation_credit_debit varchar(6) not null, -- CREDIT/DEBIT
    transaction_club_fee_type_id integer not null, -- FEE, TOURNAMENT REGISTRATION, OTHER
    transaction_comment varchar(100) not null, -- Akme Cup
    created_by varchar(100) not null,
    created_ts timestamp  default now(),
    updated_by varchar(100) not null,
    updated_ts timestamp  default now(),
    FOREIGN KEY (transaction_club_fee_type_id) REFERENCES club_fee_type(club_fee_type_id)
);
CREATE SEQUENCE transaction_id_seq START 1;


create table club_fee_payment (
    club_fee_payment_id integer primary key,
    club_fee_type_id integer not null,
    membership_id integer not null,
    transaction_id BIGINT null, 
    paid integer not null default 0,
    created_by varchar(100) not null,
    created_ts timestamp  default now(),
    updated_by varchar(100) not null,
    updated_ts timestamp  default now(),
    FOREIGN KEY (club_fee_type_id) REFERENCES club_fee_type(club_fee_type_id),
    FOREIGN KEY (membership_id) REFERENCES membership(membership_id),
    FOREIGN KEY (transaction_id) REFERENCES transaction(transaction_id)
);
CREATE SEQUENCE club_fee_payment_id_seq START 1;