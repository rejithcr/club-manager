from src import db
from src.member import queries_member
from src import helper
from exponent_server_sdk import (
    DeviceNotRegisteredError,
    PushClient,
    PushMessage,
    PushServerError,
    PushTicketError,
)
from requests.exceptions import ConnectionError, HTTPError


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
        registerPushToken = params.get('registerPushToken')

        if registerPushToken:
            member_id = params.get('memberId')
            push_token = params.get('pushToken')
            if member_id and push_token:
                db.execute(conn, queries_member.UPSERT_PUSH_TOKEN, (member_id, push_token))
                conn.commit()
                return {"message": "Push token registered successfully"}
            return {"message": "Missing memberId or pushToken"}, 400

        if sendNotification:
            member_ids = params.get('memberIds')
            title = params.get('title')
            message = params.get('message')
            target_type = params.get('targetType', 'GENERAL')
            target_id = params.get('targetId')
            
            # 1. Save notifications to DB
            db.execute(conn, queries_member.SEND_NOTIFICATIONS, (member_ids, title, message, target_type, target_id))
            
            # 2. Retrieve push tokens for these members
            token_rows = db.fetch(conn, queries_member.GET_PUSH_TOKENS_FOR_MEMBERS, (member_ids,))
            push_tokens = [row['push_token'] for row in token_rows]
            
            # 3. Send push notifications via Expo
            if push_tokens:
                self._send_push_notifications(push_tokens, title, message, {"targetType": target_type, "targetId": target_id})
            
            conn.commit()
            return {"message": "Notifications sent successfully"}

        db.execute(conn, queries_member.SAVE_MEMBER,
                   (first_name, last_name, email, phone, photo, dateOfBirth, isRegistered, createdBy, createdBy))
        conn.commit()
        member = db.fetch_one(conn, queries_member.GET_MEMBER_BY_EMAIL, (email,))

        return helper.convert_to_camel_case(member)

    def _send_push_notifications(self, tokens, title, body, data=None):
        client = PushClient()
        messages = [
            PushMessage(to=token, title=title, body=body, data=data)
            for token in tokens
        ]
        try:
            responses = client.publish_multiple(messages)
            # Potentially handle responses/tickets here if needed for debugging
        except (PushServerError, HTTPError, ConnectionError) as exc:
            # Encountered some network or server error
            print(f"Error sending push: {exc}")
        except Exception as exc:
            # Any other error
            print(f"Unexpected error sending push: {exc}")

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
