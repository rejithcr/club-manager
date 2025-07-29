-- Sequences
CREATE SEQUENCE event_type_id_seq START 1;
CREATE SEQUENCE event_id_seq START 1;
CREATE SEQUENCE rsvp_id_seq START 1;
CREATE SEQUENCE attendance_id_seq START 1;


-- event_types: Practice, Match, Meeting, etc.
CREATE TABLE event_types (
    event_type_id INT PRIMARY KEY DEFAULT nextval('event_type_id_seq'),
    club_id integer not null,
    name VARCHAR(50) UNIQUE NOT null,
    UNIQUE(name, club_id),
    FOREIGN KEY (club_id) REFERENCES club(club_id)
);

-- events: Club events
CREATE TABLE events (
    event_id INT PRIMARY KEY DEFAULT nextval('event_id_seq'),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location VARCHAR(100),
    event_type_id INT NOT NULL,
    created_by varchar(100) not null,
    status VARCHAR(20) CHECK (status IN ('Scheduled', 'Completed', 'Cancelled')) DEFAULT 'Scheduled',
    cancellation_reason TEXT,
    FOREIGN KEY (event_type_id) REFERENCES event_types(event_type_id)
);


-- rsvps: Who plans to attend
CREATE TABLE rsvps (
    rsvp_id INT PRIMARY KEY DEFAULT nextval('rsvp_id_seq'),
    event_id INT NOT NULL,
    membership_id INT NOT NULL,
    status VARCHAR(10) CHECK (status IN ('Yes', 'No', 'Maybe')) DEFAULT 'Yes',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, membership_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (membership_id) REFERENCES membership(membership_id)
);

-- attendance: Who actually attended
CREATE TABLE attendance (
    attendance_id INT PRIMARY KEY DEFAULT nextval('attendance_id_seq'),
    event_id INT NOT NULL,
    membership_id INT NOT NULL,
    present BOOLEAN DEFAULT FALSE,
    UNIQUE(event_id, membership_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (membership_id) REFERENCES membership(membership_id)
);

