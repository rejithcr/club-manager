import { View, GestureResponderEvent, Alert, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'expo-router/build/hooks'
import { getFundBalance, getTotalDue } from '@/src/helpers/club_helper'
import { appStyles } from '@/src/utils/styles'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { FontAwesome6, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import FloatingMenu from '@/src/components/FloatingMenu'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import { ClubContext } from '@/src/context/ClubContext'
import ThemedView from '@/src/components/themed-components/ThemedView'
import ShadowBox from '@/src/components/ShadowBox'
import ThemedText from '@/src/components/themed-components/ThemedText'
import ThemedIcon from '@/src/components/themed-components/ThemedIcon'

const ClubDetails = () => {
    const router = useRouter()
    const params = useSearchParams()
    const { setClubInfo } = useContext(ClubContext)

    const [isFundBalanceLoading, setIsFundBalanceLoading] = useState(false)
    const [isTotalDueLoading, setIsTotalDueLoading] = useState(false)
    const [fundBalance, setFundBalance] = useState(0)
    const [totalDue, setTotalDue] = useState<number | undefined>(0);


    const fetchFundBalance = () => {
        setIsFundBalanceLoading(true)
        getFundBalance(params.get("clubId"))
            .then(response => setFundBalance(response.data.fundBalance))
            .catch(error => Alert.alert("Error", error.response.data.error))
            .finally(() => setIsFundBalanceLoading(false))
    }
    const fetchTotalDue = () => {
        setIsTotalDueLoading(true)
        getTotalDue(params.get("clubId"))
            .then(response => setTotalDue(response.data.totalDue))
            .catch(error => Alert.alert("Error", error.response.data.error))
            .finally(() => setIsTotalDueLoading(false))
    }

    useEffect(() => {
        setClubInfo({ clubId: params.get("clubId"), clubName: params.get("clubName"), role: params.get("role") });
        fetchFundBalance();
        fetchTotalDue();
    }, [])

    const showClubDues = (_: GestureResponderEvent): void => {
        router.push(`/(main)/(clubs)/(fees)/clubdues`)
    }

    const onRefresh = () => {
        fetchFundBalance();
        fetchTotalDue();
    };
    return (
        <ThemedView style={{flex:1}}>
        <GestureHandlerRootView>
            <View style={{ marginVertical: 10 }} />
            <ScrollView refreshControl={<RefreshControl  onRefresh={onRefresh} refreshing={false} />}>
                <ShadowBox style={{ width: "80%", marginBottom: 5 }}>
                    <View style={{ width: "100%", flexDirection: "row", flexWrap: "wrap" }}>
                        <View style={{
                            flexDirection: "row", width: "100%", margin: 5, paddingVertical: 5,
                            justifyContent: "space-between", alignItems: "center"
                        }}>
                            <ThemedText style={{ fontWeight: "bold", fontSize: 15 }}>Fund Balance</ThemedText>
                            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                {isFundBalanceLoading && <LoadingSpinner />}
                                {!isFundBalanceLoading && <ThemedText style={{ fontWeight: "bold", fontSize: 15, paddingRight: 10 }}> Rs. {fundBalance || 0} </ThemedText>}
                                <View style={{ width: 20 }} />
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <TouchableOpacity onPress={showClubDues} style={{
                            flexDirection: "row", width: "100%", margin: 5, paddingVertical: 5,
                            justifyContent: "space-between"
                        }}>
                            <ThemedText style={{ fontSize: 15 }}>Total Due</ThemedText>
                            {isTotalDueLoading && <LoadingSpinner />}
                            {!isTotalDueLoading &&
                                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                    <ThemedText style={{ fontWeight: "bold", fontSize: 15, paddingRight: 10 }}> Rs. {totalDue} </ThemedText>
                                    <ThemedIcon size={20} name={'MaterialCommunityIcons:chevron-right-circle'} />
                                </View>
                            }
                        </TouchableOpacity>
                    </View>
                </ShadowBox>
            </ScrollView>
            <FloatingMenu actions={actions} position={"left"} color='black'
                icon={<MaterialIcons name={"menu"} size={32} color={"white"} />}
                onPressItem={(name: string | undefined) => handleMenuPress(name)}
            />
        </GestureHandlerRootView>
        </ThemedView>
    )
}

const handleMenuPress = (name: string | undefined) => {
    if (name == "fees") {
        router.push(`/(main)/(clubs)/(fees)`)
    } else if (name == "attendance") {
        router.push(`/(main)/(clubs)/(attendance)`)
    } else if (name == "members") {
        router.push(`/(main)/(members)`)
    } else if (name == "transactions") {
        router.push(`/(main)/(clubs)/(transactions)`)
    } else {
        throw ("Error")
    }
}

const actions = [
    {
        color: "black",
        text: "Attendance",
        icon: <MaterialCommunityIcons name={"human-greeting-variant"} size={15} color={"white"} />,
        name: "attendance",
        position: 3
    },
    {
        color: "black",
        text: "Memebers",
        icon: <MaterialCommunityIcons name={"human-greeting-variant"} size={15} color={"white"} />,
        name: "members",
        position: 4
    },
    {
        color: "black",
        text: "Fees",
        icon: <FontAwesome6 name={"cash-register"} size={15} color={"white"} />,
        name: "fees",
        position: 2
    },
    {
        color: "black",
        text: "Transactions",
        icon: <FontAwesome6 name={"money-bill-transfer"} size={15} color={"white"} />,
        name: "transactions",
        position: 1
    },
];

export default ClubDetails


const styles = StyleSheet.create({
    item: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between"
    },
    label: {
        padding: 10,
    },
    date: {
        padding: 10,
    },
    amount: {
        padding: 10,
    },
    divider: {
        borderBottomColor: 'rgba(136, 136, 136, 0.2)',
        borderBottomWidth: StyleSheet.hairlineWidth,
        width: "100%"
    }
});