ALTER TABLE events ADD COLUMN is_transaction_enabled BOOLEAN DEFAULT false;
ALTER TABLE events ADD COLUMN is_attendance_enabled BOOLEAN DEFAULT false;


CREATE SEQUENCE event_transaction_category_type_id_seq START 1;
-- category_types: fee , split, balls, match other etc. 
CREATE TABLE public.event_transaction_category_types (
	event_category_type_id int4 DEFAULT nextval('event_transaction_category_type_id_seq') primary key,
	club_id int4 NOT NULL,
	event_category_name varchar(50) NOT NULL,
	created_by varchar(50) NULL,
	CONSTRAINT event_transaction_category_types_category_name_event_id_key UNIQUE (event_category_name, club_id),
	CONSTRAINT event_transaction_category_types_event_id_fkey FOREIGN KEY (club_id) REFERENCES public.club(club_id)
);

CREATE SEQUENCE event_transaction_id_seq START 1;
create table event_transaction (
    event_transaction_id BIGINT DEFAULT nextval('event_transaction_id_seq') primary key,
    event_id integer not null,
    event_transaction_amount numeric(10,2) not null,
    event_transaction_type varchar(6) not null, -- CREDIT/DEBIT
    event_transaction_category_type_id int4 not null, -- FEE,CASHPRIZE, ...
    event_transaction_comment varchar(100), -- Akme Cup
    event_transaction_date date not null, -- day 1 of the period
    created_by varchar(100) not null,
    created_ts timestamp default now(),
    updated_by varchar(100) not null,
    updated_ts timestamp  default now(),
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (event_transaction_category_type_id) REFERENCES event_transaction_category_types(event_category_type_id),
    CONSTRAINT event_transaction_type_check CHECK (event_transaction_type in ('CREDIT','DEBIT'))
);


ALTER TABLE club_transaction ADD COLUMN event_id INTEGER;

ALTER TABLE club_transaction
ADD CONSTRAINT fk_event_id
FOREIGN KEY (event_id)
REFERENCES events (event_id);
