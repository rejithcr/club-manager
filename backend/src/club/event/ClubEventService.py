from flask import jsonify

from src import db, helper
from src.club.event import queries_events


class ClubEventService():
    def get_event_types(self, conn, params):
        club_id = params.get('clubId')

        event_types = db.fetch(conn, queries_events.GET_EVENT_TYPES, (club_id,))
        return helper.convert_to_camel_case(event_types if event_types else [])

    def get(self, conn, params):
        event_id = params.get('eventId')
        event_type = params.get('eventType', -1)
        limit = params.get('limit')
        offset = params.get('offset')
        status = params.get('status')
        club_id = params.get('clubId')
        club_ids = params.get('clubIds')

        if event_id:
            event = db.fetch_one(conn, queries_events.GET_EVENT_BY_ID, (event_id,))
            return helper.convert_to_camel_case(event if event else {})
        elif status:
            events = db.fetch(conn, queries_events.GET_EVENTS_BY_STATUS, (status, club_id, limit,offset))
            return helper.convert_to_camel_case(events if events else [])
        elif club_ids:
            club_id_list = list(map(int, club_ids.split(',')))
            events = db.fetch(conn, queries_events.GET_EVENTS_BY_MEMBER, (club_id_list, limit,offset))
            return helper.convert_to_camel_case(events if events else [])
        else:
            events = db.fetch(conn, queries_events.GET_EVENTS, (club_id, event_type, event_type, limit,offset))
            return helper.convert_to_camel_case(events if events else [])

    def post(self, conn, params):
        db.execute(conn,queries_events.ADD_EVENT, (
            params['title'],
            params.get('description'),
            params['eventDate'],
            params.get('startTime'),
            params.get('endTime'),
            params.get('location'),
            params['eventTypeId'],
            params.get('createdBy')
        ))
        conn.commit()
        return jsonify({'message': 'Event created'})

    def put(self, conn, params):
        event_id = params['eventId']
        fields = []
        values = []

        keys = {'title': 'title', 'description':'description', 'eventDate':'event_date', 'startTime':'start_time',
                   'endTime': 'end_time', 'location': 'location', 'eventTypeId': 'event_type_id',
                   'status': 'status', 'cancellationReason': 'cancellation_reason'}

        for paramField, dbField in keys.items():
            if paramField in params:
                fields.append(f"{dbField} = %s")
                values.append(params[paramField])

        if not fields:
            return jsonify({'error': 'No valid fields to update'}), 400

        values.append(event_id)
        query = f"UPDATE events SET {', '.join(fields)} WHERE event_id = %s"
        db.execute(conn, query, tuple(values))
        conn.commit()

        return jsonify({'message': 'Event updated'})


    def delete(self, conn, params):
        event_id = params['eventId']
        db.execute(conn, queries_events.DELETE_EVENT, (event_id,event_id,event_id))
        conn.commit()
        return jsonify({'message': 'Event deleted'})


    def filtered_events(self, conn, params):
        status = params.get('status')
        event_type_id = params.get('event_type_id')
        date = params.get('date')
        limit = params.get('limit')
        offset = params.get('offset')

        filters = []
        values = []

        if status:
            filters.append("status = %s")
            values.append(status)
        if event_type_id:
            filters.append("event_type_id = %s")
            values.append(event_type_id)
        if date:
            filters.append("event_date = %s")
            values.append(date)

        where_clause = "WHERE " + " AND ".join(filters) if filters else ""
        query = f"""
                SELECT * FROM events
                {where_clause}
                ORDER BY event_date
                LIMIT %s OFFSET %s
            """
        values.extend([limit, offset])

        events = db.fetch(conn, query, tuple(values))

        return helper.convert_to_camel_case(events)


    def create_or_update_rsvp(self, conn, params):
        """
        {
          "event_id": 12,
          "responses": [
            { "membership_id": 1, "status": "Yes" },
            { "membership_id": 2, "status": "No" },
            { "membership_id": 3, "status": "Maybe" }
          ]
        }
        """
        event_id = params.get('event_id')
        responses = params.get('responses', [])

        if not event_id or not responses:
            raise Exception('Missing event_id or responses')

        for r in responses:
            db.execute(conn, """
                    INSERT INTO rsvps (event_id, membership_id, status)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (event_id, membership_id)
                    DO UPDATE SET status = EXCLUDED.status, timestamp = CURRENT_TIMESTAMP
                """, (event_id, r['membership_id'], r['status']))
        conn.commit()
        return jsonify({'message': 'RSVP saved'})


    def get_rsvp(self, conn, params):
        event_id = params.get('event_id')
        rsvps = db.fetch(conn, "SELECT * FROM rsvps WHERE event_id = %s", (event_id,))
        return helper.convert_to_camel_case(rsvps)

    def mark_attendance(self, conn, params):
        """
        {
          "event_id": 12,
          "records": [
            { "membership_id": 1, "present": true },
            { "membership_id": 2, "present": false },
            { "membership_id": 3, "present": true }
          ]
        }
        """
        event_id = params.get('eventId')
        records = params.get('records', [])
        status = params.get('status')

        if not event_id and not records:
            raise Exception('Either eventId or records required!')

        for r in records:
            db.execute(conn, """
                    INSERT INTO attendance (event_id, membership_id, present)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (event_id, membership_id)
                    DO UPDATE SET present = EXCLUDED.present
                """, (event_id, r['membershipId'], r['present']))

        if status:
            db.execute(conn, """
                                UPDATE events SET status = %s where event_id = %s
                            """, (status, event_id))

        conn.commit()
        return jsonify({'message': 'Status updated.'})

    def get_attendance(self, conn, params):
        event_id = params.get('eventId')
        start_date = params.get('startDate')
        end_date = params.get('endDate')
        event_type_id = params.get('eventTypeId')

        if event_id:
            attendance = db.fetch(conn, """
                                            SELECT ms.membership_id, m.member_id, m.first_name, m.last_name, a.present
                                            FROM attendance a
                                                join membership ms on ms.membership_id = a.membership_id
                                                join member m on m.member_id = ms.member_id
                                            WHERE event_id = %s
                                        """, (event_id,))
            return helper.convert_to_camel_case(attendance)


        filters = []
        values = []

        if start_date:
            filters.append("e.event_date >= %s")
            values.append(start_date)
        if end_date:
            filters.append("e.event_date <= %s")
            values.append(end_date)
        if event_type_id:
            filters.append("e.event_type_id = %s")
            values.append(event_type_id)

        where_clause = "WHERE " + " AND ".join(filters) if filters else ""

        query = f"""
                        SELECT
                            m.member_id,
                            m.first_name,
                            m.last_name,
                            COUNT(e.event_id) AS total_events,
                            COUNT(a.event_id) FILTER (WHERE a.present IS TRUE) AS attended_events,
                            ROUND(
                                COUNT(e.event_id) FILTER (WHERE a.present IS TRUE)::DECIMAL /
                                NULLIF(COUNT(e.event_id), 0) * 100, 2
                            ) AS attendance_percentage
                         FROM events e                        
                        	join event_types et on et.event_type_id = e.event_type_id 
                        	join club c on c.club_id = et.club_id
                        	join membership ms ON ms.club_id=c.club_id 
                        	join "member" m on m.member_id = ms.member_id
                        	left join attendance a ON a.event_id = e.event_id and a.membership_id = ms.membership_id
                        {where_clause}
                        GROUP BY m.member_id, m.first_name, m.last_name
                        ORDER BY attendance_percentage DESC, m.first_name
                    """
        results = db.fetch(conn, query, tuple(values))
        return helper.convert_to_camel_case(results if results else [])

