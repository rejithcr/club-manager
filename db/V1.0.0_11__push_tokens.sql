CREATE SEQUENCE member_push_token_id_seq START 1;

CREATE TABLE member_push_token (
    member_push_token_id integer DEFAULT nextval('member_push_token_id_seq') primary key,
    member_id integer not null,
    push_token varchar(255) not null,
    created_ts timestamp default now(),
    updated_ts timestamp default now(),
    UNIQUE(member_id, push_token),
    FOREIGN KEY (member_id) REFERENCES member(member_id)
);

CREATE INDEX idx_member_push_token_member_id ON member_push_token(member_id);
