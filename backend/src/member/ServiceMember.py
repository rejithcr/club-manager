from src import db
from src.member import queries_member
from src import helper


class MemberService():

    def get(self, conn, params):
        member_id = params.get('memberId')
        email = params.get('email')
        phone = params.get('phone')
        requests = params.get('requests')
        limit = params.get("limit")
        offset = params.get("offset")
        upcomingBirthdays = params.get('upcomingBirthdays')
        clubId = params.get('clubId')
        notifications = params.get('notifications')
        unreadCount = params.get('unreadCount')

        member = None
        if email:
            member = db.fetch_one(conn, queries_member.GET_MEMBER_BY_EMAIL, (email,))
        elif phone:
            member = db.fetch_one(conn, queries_member.GET_MEMBER_BY_PHONE, (phone,))
        elif requests:
            requests = db.fetch(conn, queries_member.GET_REQUESTS, (member_id,))
            return [helper.convert_to_camel_case(request) for request in requests]
        elif notifications:
            notifications = db.fetch(conn, queries_member.GET_NOTIFICATIONS, (member_id, limit, offset))
            return [helper.convert_to_camel_case(notification) for notification in notifications]
        elif unreadCount:
            result = db.fetch_one(conn, queries_member.GET_UNREAD_NOTIFICATION_COUNT, (member_id,))
            return helper.convert_to_camel_case(result)
        elif upcomingBirthdays:
            birthdays = db.fetch(conn, queries_member.GET_UPCOMING_BIRTHDAYS, (clubId, clubId, member_id, member_id))
            return [helper.convert_to_camel_case(birthday) for birthday in birthdays]
        elif offset and limit:
            users = db.fetch(conn, queries_member.GET_USERS, (limit, offset))
            return [helper.convert_to_camel_case(user) for user in users]
        else:
            member = db.fetch_one(conn, queries_member.GET_MEMBER, (member_id,))

        return helper.convert_to_camel_case(member) if member else {}

    def post(self, conn, params):
        email = params.get('email')
        phone = params.get('phone')
        photo = params.get('photo')
        first_name = params.get('firstName')
        last_name = params.get('lastName')
        dateOfBirth = params.get('dateOfBirth')
        createdBy = params.get('createdBy')
        isRegistered = params.get('isRegistered')
        sendNotification = params.get('sendNotification')

        if sendNotification:
            member_ids = params.get('memberIds')
            title = params.get('title')
            message = params.get('message')
            target_type = params.get('targetType', 'GENERAL')
            target_id = params.get('targetId')
            
            db.execute(conn, queries_member.SEND_NOTIFICATIONS, (member_ids, title, message, target_type, target_id))
            conn.commit()
            return {"message": "Notifications sent successfully"}

        db.execute(conn, queries_member.SAVE_MEMBER,
                   (first_name, last_name, email, phone, photo, dateOfBirth, isRegistered, createdBy, createdBy))
        conn.commit()
        member = db.fetch_one(conn, queries_member.GET_MEMBER_BY_EMAIL, (email,))

        return helper.convert_to_camel_case(member)

    def put(self, conn, params):
        email = params.get('email')
        phone = params.get('phone')
        first_name = params.get('firstName')
        last_name = params.get('lastName')
        memberId = params.get('memberId')
        dateOfBirth = params.get('dateOfBirth')
        updatedBy = params.get('updatedBy')
        photo = params.get('photo')
        isRegistered = params.get('isRegistered')
        verify = params.get('verify')
        markAsRead = params.get('markAsRead')
        notificationId = params.get('notificationId')
        notificationIds = params.get('notificationIds')

        if markAsRead:
            ids_to_update = notificationIds if notificationIds else [notificationId]
            db.execute(conn, queries_member.MARK_NOTIFICATION_AS_READ, (ids_to_update,))
            conn.commit()
            return {"message": "Notifications marked as read"}
        elif verify:
            db.execute(conn, queries_member.VERIFY_MEMBER,
                       (first_name, last_name, email, phone, photo, dateOfBirth, isRegistered, updatedBy, memberId))
            conn.commit()
        else:
            db.execute(conn, queries_member.UPDATE_MEMBER,
                       (first_name, last_name, email, phone, dateOfBirth, updatedBy, memberId))
            conn.commit()

        return {"message": "Member updated successfully"}
