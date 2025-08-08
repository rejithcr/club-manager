import React, { useCallback, useEffect, useRef, useState } from 'react'
import ThemedView from '@/src/components/themed-components/ThemedView'
import { FlatList, GestureHandlerRootView, RefreshControl } from 'react-native-gesture-handler'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import ThemedText from '@/src/components/themed-components/ThemedText'
import { View, Image } from 'react-native'
import Alert, { AlertProps } from '@/src/components/Alert'
import { getUsers, Member } from '@/src/helpers/member_helper'
import Spacer from '@/src/components/Spacer'
import UserInfoView from '../(members)/UserInfoView'
import { useGetMembersQuery } from '@/src/services/memberApi'

const limit = 20;

const users = () => {

      const [offset, setOffset] = useState(0);
      const [items, setItems] = useState<any[]>([]);
      const [hasMore, setHasMore] = useState(true);
      const [refreshing, setRefreshing] = useState(false);
    
      const {
        data: users,
        isLoading: isFetching,
        refetch,
      } = useGetMembersQuery({ limit, offset }, { skip: !hasMore });
    
      const onRefresh = useCallback(() => {
        setRefreshing(true);
        setOffset(0);
        refetch(); // Optional: triggers revalidation
      }, [refetch]);
    
      useEffect(() => {
        if (users) {
          setItems((prev) => [...prev, ...users]);
          if (users.length < limit) {
            setHasMore(false);
          }
        }
      }, [users]);
    
      const loadMore = () => {
        if (!isFetching && hasMore) {
          setOffset((prev) => prev + limit);
        }
      };
    
    return (
        <GestureHandlerRootView>
            <ThemedView style={{ flex: 1 }}>
                <Spacer space={5} />
                {isFetching && <LoadingSpinner />}
                {!isFetching && items &&
                    <FlatList style={{ width: "100%" }}
                        ItemSeparatorComponent={() => <View style={{ marginVertical: 7, borderBottomWidth: .3, borderBottomColor: "grey", width: "85%", alignSelf: "center" }} />}
                        ListFooterComponent={() => isFetching && <LoadingSpinner /> || <View style={{ marginVertical: 30 }} />}
                        data={items}
                        ListEmptyComponent={() => <ThemedText style={{ textAlign: "center" }}>No transactions found!</ThemedText>}
                        initialNumToRender={8}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.2}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        renderItem={({ item }) => (
                            <UserInfoView {...item} />
                        )}
                    />
                }
            </ThemedView>
        </GestureHandlerRootView>
    )
}

export default users