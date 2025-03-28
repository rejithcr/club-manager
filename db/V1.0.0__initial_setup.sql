create table organization (
    id integer primary key,
    name varchar(50) not null unique,
    owner varchar(100),
    created_by varchar(100),
    created_ts date,
    updated_by varchar(100),
    updated_ts date
);
