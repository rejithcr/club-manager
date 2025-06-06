import React, { useEffect, useRef, useState } from 'react'
import ThemedView from '@/src/components/themed-components/ThemedView'
import { FlatList, GestureHandlerRootView, RefreshControl } from 'react-native-gesture-handler'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import ThemedText from '@/src/components/themed-components/ThemedText'
import { View, Image } from 'react-native'
import Alert, { AlertProps } from '@/src/components/Alert'
import { getUsers, Member } from '@/src/helpers/member_helper'
import ThemedIcon from '@/src/components/themed-components/ThemedIcon'
import { useTheme } from '@/src/hooks/use-theme'
import Spacer from '@/src/components/Spacer'


const users = () => {
    const [users, setUsers] = useState<any>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isFectching, setIsFetching] = useState(false)
    const [hasMoreData, setHasMoreData] = useState(false)
    const [alertConfig, setAlertConfig] = useState<AlertProps>();

    const offset = useRef(0)
    const limit = 20

    const onRefresh = () => {
        setIsLoading(true)
        offset.current = 0
        getUsers(limit, offset.current)
            .then(response => {
                setHasMoreData(response.data?.length > 0);
                setUsers(response.data)
            })
            .catch(error => setAlertConfig({
                visible: true, title: 'Error', message: error.response.data.error,
                buttons: [{ text: 'OK', onPress: () => setAlertConfig({ visible: false }) }]
            }))
            .finally(() => setIsLoading(false))
    }
    useEffect(() => {
        onRefresh()
    }, [])

    const fetchNextPage = () => {
        if (hasMoreData && !isFectching) {
            setIsFetching(true)
            offset.current = offset.current + limit
            getUsers(limit, offset.current)
                .then(response => {
                    setHasMoreData(response.data?.length > 0);
                    setUsers((prev: any) => [...prev, ...response.data])
                })
                .catch(error => setAlertConfig({
                    visible: true, title: 'Error', message: error.response.data.error,
                    buttons: [{ text: 'OK', onPress: () => setAlertConfig({ visible: false }) }]
                }))
                .finally(() => setIsFetching(false))
        }
    }

    return (
        <GestureHandlerRootView>
            <ThemedView style={{ flex: 1 }}>
                <Spacer space={5} />
                {isLoading && <LoadingSpinner />}
                {!isLoading && users &&
                    <FlatList style={{ width: "100%" }}
                        ItemSeparatorComponent={() => <View style={{ marginVertical: 7, borderBottomWidth: .3, borderBottomColor: "grey", width: "85%", alignSelf: "center" }} />}
                        ListFooterComponent={() => isFectching && <LoadingSpinner /> || <View style={{ marginVertical: 30 }} />}
                        data={users}
                        ListEmptyComponent={() => <ThemedText style={{ textAlign: "center" }}>No transactions found!</ThemedText>}
                        initialNumToRender={8}
                        onEndReached={fetchNextPage}
                        onEndReachedThreshold={0.2}
                        refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
                        renderItem={({ item }) => (
                            <UserInfoView {...item} />
                        )}
                    />
                }
                {alertConfig?.visible && <Alert {...alertConfig} />}
            </ThemedView>
        </GestureHandlerRootView>
    )
}

export default users

const UserInfoView = (props: Member) => {
    const { colors } = useTheme()
    return (
        <ThemedView style={{ width: "85%", alignSelf: "center", flexDirection: "row", 
                            justifyContent: "space-between", paddingVertical: 5, alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                {props?.photo ? <Image source={{ uri: props?.photo }} style={{ height: 32, width: 32, borderRadius: 100, }} />
                    : <ThemedIcon name={"MaterialIcons:account-circle"} size={32} />}
                <View style={{ paddingLeft: 10 }}>
                    <View style={{ flexDirection: "row"}}>
                        <ThemedText>{props.firstName} {props.lastName}</ThemedText>
                        <Spacer hspace={2} />
                        {props.isRegistered === 1 && <ThemedIcon name='MaterialIcons:verified-user' color={colors.success} size={12}/>}                    
                    </View>                    
                    <ThemedText style={{ fontSize: 10 }}>{props.email}</ThemedText>
                </View>
            </View>
            <View style={{alignItems: "flex-end"}}>                
                <ThemedText style={{ fontSize: 12 }}>{props.phone}</ThemedText>
                <ThemedText style={{ fontSize: 9 }}>{props.updatedTs}</ThemedText>
            </View>
        </ThemedView>
    )
}