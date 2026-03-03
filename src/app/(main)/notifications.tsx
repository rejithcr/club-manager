import React, { useContext, useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';
import ThemedView from '@/src/components/themed-components/ThemedView';
import ThemedText from '@/src/components/themed-components/ThemedText';
import { useTheme } from '@/src/hooks/use-theme';
import { UserContext } from '@/src/context/UserContext';
import { useGetNotificationsQuery, useMarkNotificationAsReadMutation } from '@/src/services/memberApi';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import Divider from '@/src/components/Divider';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const PAGE_SIZE = 40;

const NotificationsScreen = () => {
    const { colors } = useTheme();
    const { userInfo } = useContext(UserContext);
    const router = useRouter();
    const [offset, setOffset] = useState(0);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const pendingReadIds = React.useRef<Set<number>>(new Set());

    const { data: newNotifications, isLoading, isFetching, refetch } = useGetNotificationsQuery(
        { memberId: userInfo?.memberId, limit: PAGE_SIZE, offset },
        { skip: !userInfo?.memberId }
    );

    const [markAsRead] = useMarkNotificationAsReadMutation();

    // Batch update on unmount
    useEffect(() => {
        return () => {
            const idsToUpdate = Array.from(pendingReadIds.current);
            if (idsToUpdate.length > 0) {
                markAsRead({ notificationIds: idsToUpdate }).unwrap().catch(err => {
                    console.error("Failed to sync read status on unmount", err);
                });
            }
        };
    }, []);

    useEffect(() => {
        if (newNotifications && Array.isArray(newNotifications)) {
            if (offset === 0) {
                setNotifications(newNotifications);
            } else {
                setNotifications(prev => [...prev, ...newNotifications]);
            }
        }
    }, [newNotifications]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        setOffset(0);
        await refetch();
        setIsRefreshing(false);
    };

    const handleLoadMore = () => {
        if (!isFetching && newNotifications?.length === PAGE_SIZE) {
            setOffset(prev => prev + PAGE_SIZE);
        }
    };

    const handleNotificationPress = async (notification: any) => {
        // Optimistic UI update
        if (notification.isRead === 0) {
            pendingReadIds.current.add(notification.notificationId);
            setNotifications(prev =>
                prev.map(n => n.notificationId === notification.notificationId ? { ...n, isRead: 1 } : n)
            );
        }

        // Navigate based on target type
        if (notification.targetType === 'EVENT' && notification.targetId) {
            router.push(`/(main)/(clubs)/(events)/eventdetails?eventId=${notification.targetId}`);
        } else if (notification.targetType === 'DUE') {
            router.push(`/(main)/(profile)/duesbyclub?memberId=${userInfo?.memberId}`);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={[styles.notificationItem, { backgroundColor: item.isRead ? colors.background : colors.muted }]}
            onPress={() => handleNotificationPress(item)}
        >
            <View style={styles.content}>
                <ThemedText style={[styles.title, { fontWeight: item.isRead ? '400' : '700' }]}>
                    {item.title}
                </ThemedText>
                <ThemedText style={styles.message}>{item.message}</ThemedText>
                <ThemedText style={[styles.date, { color: colors.subText }]}>{item.createdTs}</ThemedText>
            </View>
        </TouchableOpacity>
    );

    if (isLoading && offset === 0) return <LoadingSpinner />;

    return (
        <ThemedView style={styles.container}>
            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={(item) => item.notificationId.toString()}
                onRefresh={handleRefresh}
                refreshing={isRefreshing}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ItemSeparatorComponent={() => <Divider />}
                ListEmptyComponent={
                    !isLoading ? (
                        <View style={styles.emptyContainer}>
                            <ThemedText>No notifications found.</ThemedText>
                        </View>
                    ) : null
                }
                ListFooterComponent={
                    isFetching && offset > 0 ? (
                        <ActivityIndicator color={colors.primary} style={{ margin: 16 }} />
                    ) : null
                }
            />
        </ThemedView>
    );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    notificationItem: {
        padding: 16,
        alignItems: 'flex-start',
    },

    content: {
        flex: 1,
        flexDirection: 'column',
    },
    title: {
        fontSize: 16,
        marginBottom: 4,
    },
    message: {
        fontSize: 14,
        marginBottom: 8,
    },
    date: {
        fontSize: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
});

