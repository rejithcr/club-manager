ALTER TABLE public.club_transaction ADD CONSTRAINT club_transaction_unique_fee_payment_id UNIQUE (club_fee_payment_id);
ALTER TABLE public.club_transaction ADD CONSTRAINT club_transaction_unique_adhoc_fee_payment_id UNIQUE (club_adhoc_fee_payment_id);

-- Sequences
CREATE SEQUENCE category_type_id_seq START 1;


-- category_types: fee , split, balls, match other etc. 
CREATE TABLE transaction_category_types (
    category_type_id INT PRIMARY KEY DEFAULT nextval('category_type_id_seq'),
    club_id integer not null,
    category_name VARCHAR(50) UNIQUE NOT null,
    created_by varchar(50),
    UNIQUE(name, club_id),
    FOREIGN KEY (club_id) REFERENCES club(club_id)
);

ALTER TABLE club_transaction ADD COLUMN club_transaction_category_type_id INTEGER;;

ALTER TABLE club_transaction
ADD CONSTRAINT fk_transaction_category_type_id
FOREIGN KEY (club_transaction_category_type_id)
REFERENCES transaction_category_types (category_type_id);
