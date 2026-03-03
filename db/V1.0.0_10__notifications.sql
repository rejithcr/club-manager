CREATE SEQUENCE notification_id_seq START 1;

-- Create notification table
create table notification (
    notification_id integer DEFAULT nextval('notification_id_seq') primary key,
    member_id integer not null,
    title varchar(100) not null,
    message text not null,
    is_read smallint default 0, -- 0 for unread, 1 for read
    target_type varchar(30), -- EVENT, DUE, GENERAL, etc.
    target_id varchar(50), -- id of the target entity
    created_ts timestamp default now(),
    FOREIGN KEY (member_id) REFERENCES member(member_id)
);

-- Index for faster retrieval of user notifications
CREATE INDEX idx_notification_member_id ON notification(member_id);
CREATE INDEX idx_notification_created_ts ON notification(created_ts DESC);
CREATE INDEX idx_notification_target_type ON notification(target_type);
