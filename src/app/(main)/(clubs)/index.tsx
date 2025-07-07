import { View, GestureResponderEvent, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'expo-router/build/hooks'
import { getClubCounts, getFundBalance, getTotalDue } from '@/src/helpers/club_helper'
import { appStyles } from '@/src/utils/styles'
import { FlatList, GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import { ClubContext } from '@/src/context/ClubContext'
import ThemedView from '@/src/components/themed-components/ThemedView'
import ThemedText from '@/src/components/themed-components/ThemedText'
import ThemedIcon from '@/src/components/themed-components/ThemedIcon'
import Spacer from '@/src/components/Spacer'
import TouchableCard from '@/src/components/TouchableCard'
import { ROLE_ADMIN } from '@/src/utils/constants'
import { useTheme } from '@/src/hooks/use-theme'
import { getFeeStructure } from '@/src/helpers/fee_helper'
import Alert, { AlertProps } from '@/src/components/Alert'
import ThemedHeading from '@/src/components/themed-components/ThemedHeading'
import { useHttpGet } from '@/src/hooks/use-http'
import Card from '@/src/components/Card'

const ClubHome = () => {
    const router = useRouter()
    const params = useSearchParams()
    const [alertConfig, setAlertConfig] = useState<AlertProps>();
    const { setClubInfo } = useContext(ClubContext)

    const { colors } = useTheme();

    const [isTotalDueLoading, setIsTotalDueLoading] = useState(false)
    const [isClubCountsLoading, setIsClubCountsLoading] = useState(false)
    const [totalDue, setTotalDue] = useState<number | undefined>(0);
    const [clubCounts, setClubCounts] = useState<any[]>([]);

    const [currentFeeStructure, setCurrentFeeStructure] = useState<any>([])
    const [isLoadingCurrent, setIsLoadingCurrent] = useState(false);

    const {
        data: fbr,
        isLoading: isFundBalanceLoading,
        refetch: fetchFundBalance
    } = useHttpGet("/club", { clubId: params.get("clubId"), fundBalance: "true" })

    const {
        data: expenseSplits,
        isLoading: isLoadingSplits,
        refetch: fetchSplits
    } = useHttpGet("/fee/adhoc", { clubId: Number(params.get("clubId")) })

    const fetchTotalDue = () => {
        setIsTotalDueLoading(true)
        getTotalDue(params.get("clubId"))
            .then(response => setTotalDue(response.data.totalDue))
            .catch(error => setAlertConfig({ visible: true, title: 'Error', message: error.response.data.error, buttons: [{ text: 'OK', onPress: () => setAlertConfig({ visible: false }) }] }))
            .finally(() => setIsTotalDueLoading(false))
    }
    const fetchClubCounts = () => {
        setIsClubCountsLoading(true)
        getClubCounts(params.get("clubId"))
            .then(response => { setClubCounts(response.data) })
            .catch(error => setAlertConfig({ visible: true, title: 'Error', message: error.response.data.error, buttons: [{ text: 'OK', onPress: () => setAlertConfig({ visible: false }) }] }))
            .finally(() => setIsClubCountsLoading(false))
    }
    const showFeeTypeDetails = (fee: any) => {
        router.push({
            pathname: "/(main)/(clubs)/(fees)/feetypedetails",
            params: { fee: JSON.stringify(fee) }
        })
    }

    const fetchFees = () => {
        setIsLoadingCurrent(true)
        getFeeStructure(Number(params.get('clubId')))
            .then(response => setCurrentFeeStructure(response.data))
            .catch(error => setAlertConfig({ visible: true, title: 'Error', message: error.response.data.error, buttons: [{ text: 'OK', onPress: () => setAlertConfig({ visible: false }) }] }))
            .finally(() => setIsLoadingCurrent(false));
    }

    useEffect(() => {
        setClubInfo({ clubId: params.get("clubId"), clubName: params.get("clubName"), role: params.get("role") });
        fetchFundBalance();
        fetchTotalDue();
        fetchFees();
        fetchClubCounts()
    }, [])

    const showClubDues = (_: GestureResponderEvent): void => {
        router.push(`/(main)/(clubs)/(fees)/clubdues`)
    }

    const onRefresh = () => {
        fetchFundBalance();
        fetchTotalDue();
        fetchFees();
    };

      const showAdhocFeeDetails = (adhocFee: any) => {
        router.push({
          pathname: "/(main)/(clubs)/(fees)/adhocfee/payments",
          params: { adhocFee: JSON.stringify(adhocFee) }
        })
      }

    return (
        <ThemedView style={{ flex: 1 }}>
            <GestureHandlerRootView>
                <Spacer space={5} />
                <View style={{
                    flexDirection: "row", width: "90%", alignSelf: "center",
                    justifyContent: "space-between", alignItems: "center"
                }}>
                    <ThemedHeading style={{ width: 200 }}>Fund Balance</ThemedHeading>
                    {isFundBalanceLoading && <LoadingSpinner />}
                    {!isFundBalanceLoading &&
                        <ThemedText style={{ fontWeight: "bold", fontSize: 16, color: fbr?.fundBalance > 0 ? colors.success : colors.error }}>Rs. {fbr?.fundBalance || 0}</ThemedText>}
                </View>
                <Spacer space={5} />
                <ScrollView refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}>
                    <TouchableCard onPress={Number(totalDue) > 0 ? showClubDues : null}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                            <ThemedText style={{ fontSize: 15 }}>Total Due</ThemedText>
                            {isTotalDueLoading && <LoadingSpinner />}
                            {!isTotalDueLoading &&
                                <ThemedText style={{ fontWeight: "bold", fontSize: 15, position: "absolute", right: Number(totalDue) > 0 ? 30 : 5 }}> Rs. {totalDue}</ThemedText>
                            }
                        </View>
                    </TouchableCard>
                    <Spacer space={4} />
                    <TouchableCard onPress={() => router.push(`/(main)/(clubs)/(transactions)`)}>
                        <ThemedText>Transactions</ThemedText>
                    </TouchableCard>
                    <Spacer space={4} />
                    <View style={{
                        flexDirection: "row", alignItems: "center", width: "90%",
                        justifyContent: "space-between", alignSelf: "center",
                    }}>
                        <ThemedHeading style={{ width: 200 }}>Fees</ThemedHeading>
                        <View style={{ width: "20%", flexDirection: "row", justifyContent: "flex-end" }}>
                            {params.get("role") == ROLE_ADMIN && <TouchableOpacity
                                onPress={() => router.push(`/(main)/(clubs)/(fees)/definefee`)}>
                                <ThemedIcon size={25} name={'MaterialCommunityIcons:plus-circle'} color={colors.add} />
                            </TouchableOpacity>}</View>
                    </View>
                    {isLoadingCurrent && <LoadingSpinner />}
                    {!isLoadingCurrent && currentFeeStructure?.length == 0 && <ThemedText style={{ alignSelf: "center", width: "80%" }}>No fees defined. To define a fee type (eg. Membership fee), press the + icon.</ThemedText>}
                    {!isLoadingCurrent && currentFeeStructure?.map((fee: any) => {
                        return <View key={fee.clubFeeTypeId}>
                            <TouchableCard onPress={showFeeTypeDetails} id={fee}>
                                <View style={{
                                    flexDirection: "row", width: "100%",
                                    justifyContent: "space-between", alignItems: "center"
                                }}>
                                    <View>
                                        <ThemedText style={{ fontWeight: "bold" }}>{fee.clubFeeType}</ThemedText>
                                        <ThemedText style={{ fontSize: 10, marginTop: 5 }}>{fee.clubFeeTypeInterval}</ThemedText>
                                    </View>
                                    <ThemedText style={{ fontWeight: "bold", fontSize: 15, position: "absolute", right: 30 }}>Rs. {fee.clubFeeAmount}</ThemedText>
                                </View>
                            </TouchableCard>
                            <Spacer space={4} />
                        </View>
                    })}
                    <Spacer space={4} />
                    <ThemedHeading>Expense Splits</ThemedHeading>
                    {isLoadingSplits && <LoadingSpinner />}
                    {!isLoadingSplits && <View style={{ width: "85%", alignSelf: "center", flexDirection:"row"}}>
                        <View style={{ width: 100, alignItems:"center", justifyContent:"center"}}>
                            {params.get("role") == ROLE_ADMIN && <TouchableOpacity
                                onPress={() => router.push(`/(main)/(clubs)/(fees)/adhocfee/definefee`)}>
                                <ThemedIcon size={35} name={'MaterialCommunityIcons:plus-circle'} color={colors.add} />
                            </TouchableOpacity>}</View>
                        <FlatList
                            data={expenseSplits}
                            onEndReachedThreshold={0.2}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => showAdhocFeeDetails(item)}>
                                <Card style={{ height: 100 }}>
                                    <ThemedText style={{ fontWeight: "bold" }}>{item.clubAdhocFeeName}</ThemedText>
                                    <ThemedText style={{ fontSize: 10, marginTop: 5 }}>{item.clubAdhocFeeDate} {item.clubAdhocFeeDesc}</ThemedText>
                                    <ThemedText style={{ fontSize: 12, marginTop: 5 }}>Rs. {item.clubAdhocFeePaymentAmount}</ThemedText>
                                    <ThemedText style={{ fontSize: 10, marginTop: 5, position:"absolute", bottom: 10}}>Collected {Math.round(item.completionPercentage)}%</ThemedText>
                                </Card>
                                </TouchableOpacity>
                            )}
                            horizontal
                        />
                    </View>
                    }
                    <Spacer space={4} />
                    <ThemedHeading>Membership</ThemedHeading>
                    <TouchableCard onPress={() => router.push('/(main)/(members)')}>
                        <ThemedText>Members</ThemedText>
                    </TouchableCard>
                    <Spacer space={4} />
                    <TouchableCard onPress={() => router.push(`/(main)/(clubs)/membershiprequests`)}>
                        <ThemedText>Membership Requests</ThemedText>
                        {isClubCountsLoading && <LoadingSpinner />}
                        {!isClubCountsLoading && clubCounts?.find(i => i.countType === "openMembershipRequests")?.count > 0 && <View style={{ alignItems: "center", borderRadius: 100, width: 20, backgroundColor: colors.button }}>
                            <ThemedText>{clubCounts?.find(i => i.countType === "openMembershipRequests")?.count}</ThemedText></View>}
                    </TouchableCard>
                    <Spacer space={4} />
                    <TouchableCard onPress={() => router.push('/(main)/(members)/memberattributes')}>
                        <ThemedText>Member Attributes</ThemedText>
                    </TouchableCard>
                    <Spacer space={4} />
                    <TouchableCard onPress={() => router.push(`/(main)/(clubs)/(reports)/memberattributesexport`)}>
                        <ThemedText>Export</ThemedText>
                    </TouchableCard>
                    <Spacer space={20} />
                </ScrollView>
                {alertConfig?.visible && <Alert {...alertConfig} />}
                {/* <FloatingMenu actions={actions} position={"left"} color='black'
                    icon={<MaterialIcons name={"menu"} size={32} color={"white"} />}
                    onPressItem={(name: string | undefined) => handleMenuPress(name)}
                /> */}
            </GestureHandlerRootView>
        </ThemedView>
    )
}

const handleMenuPress = (name: string | undefined) => {
    if (name == "attendance") {
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
    // {
    //     color: "black",
    //     text: "Attendance",
    //     icon: <MaterialCommunityIcons name={"human-greeting-variant"} size={15} color={"white"} />,
    //     name: "attendance",
    //     position: 3
    // },
    {
        color: "black",
        text: "Memebers",
        icon: <MaterialCommunityIcons name={"account-circle"} size={15} color={"white"} />,
        name: "members",
        position: 4
    }
];

export default ClubHome