ALTER TABLE public.club_transaction ADD CONSTRAINT club_transaction_unique_fee_payment_id UNIQUE (club_fee_payment_id);
ALTER TABLE public.club_transaction ADD CONSTRAINT club_transaction_unique_adhoc_fee_payment_id UNIQUE (club_adhoc_fee_payment_id);

-- Sequences
CREATE SEQUENCE category_type_id_seq START 1;


-- category_types: fee , split, balls, match other etc. 
CREATE TABLE public.transaction_category_types (
	category_type_id int4 DEFAULT nextval('category_type_id_seq') NOT NULL,
	club_id int4 NOT NULL,
	category_name varchar(50) NOT NULL,
	created_by varchar(50) NULL,
	CONSTRAINT transaction_category_types_category_name_club_id_key UNIQUE (category_name, club_id),
	CONSTRAINT transaction_category_types_pkey PRIMARY KEY (category_type_id),
	CONSTRAINT transaction_category_types_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.club(club_id)
);

ALTER TABLE club_transaction ADD COLUMN club_transaction_category_type_id INTEGER;;

ALTER TABLE club_transaction
ADD CONSTRAINT fk_transaction_category_type_id
FOREIGN KEY (club_transaction_category_type_id)
REFERENCES transaction_category_types (category_type_id);
