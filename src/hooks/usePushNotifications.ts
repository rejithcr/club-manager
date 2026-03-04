import { useState, useEffect, useRef } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Alert, Platform } from 'react-native';
import { useRegisterPushTokenMutation } from '../services/memberApi';

export const usePushNotifications = (memberId: number | undefined) => {
    const [expoPushToken, setExpoPushToken] = useState<string | undefined>(undefined);
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
    const notificationListener = useRef<ReturnType<typeof Notifications.addNotificationReceivedListener>>(undefined);
    const responseListener = useRef<ReturnType<typeof Notifications.addNotificationResponseReceivedListener>>(undefined);
    const [registerPushToken] = useRegisterPushTokenMutation();

    useEffect(() => {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldShowBanner: true,
                shouldShowList: true,
                shouldPlaySound: true,
                shouldSetBadge: false,
            }),
        });

        if (memberId) {
            registerForPushNotificationsAsync().then(token => {
                setExpoPushToken(token ?? undefined);
                if (token && memberId) {
                    registerPushToken({ memberId, pushToken: token });
                }
            });
        }

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            notificationListener.current?.remove();
            responseListener.current?.remove();
        };
    }, [memberId]);

    return { expoPushToken, notification };
};

async function registerForPushNotificationsAsync(): Promise<string | null> {
    if (Platform.OS === 'web') return null;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (!Device.isDevice) {
        return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        Alert.alert('Permission required', 'Failed to get push token for push notifications!');
        return null;
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId as string | undefined;

    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    return token;
}
