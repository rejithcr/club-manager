import { View, TouchableOpacity, FlatList, RefreshControl } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'expo-router/build/hooks'
import ThemedButton from '@/src/components/ThemedButton'
import { appStyles } from '@/src/utils/styles';
import KeyValueTouchableBox from '@/src/components/KeyValueTouchableBox'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { router } from 'expo-router'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import TouchableCard from '@/src/components/TouchableCard'
import ThemedView from '@/src/components/themed-components/ThemedView'
import ThemedText from '@/src/components/themed-components/ThemedText'
import ThemedIcon from '@/src/components/themed-components/ThemedIcon'
import Spacer from '@/src/components/Spacer'
import { useTheme } from '@/src/hooks/use-theme'
import { ROLE_ADMIN } from '@/src/utils/constants'
import { ClubContext } from '@/src/context/ClubContext'
import ProgressBar from '@/src/components/charts/ProgressBar'
import { useGetCollectionsOfFeeTypeQuery, useGetExceptionTypesQuery } from '@/src/services/feeApi'
import usePaginatedQuery from '@/src/hooks/usePaginatedQuery'

const FeeTypeDetails = () => {
    const [showAddException, setShowAddException] = useState(false)
    const [fee, setFee] = useState<any>()
    const { colors } = useTheme();
    const { clubInfo } = useContext(ClubContext)
    const params = useSearchParams()

    const feeObj = JSON.parse(params.get('fee') || "")

    const {data: exceptionTypes, isLoading: isExceptionTypesLoading} = useGetExceptionTypesQuery({ feeTypeId: feeObj.clubFeeTypeId });
   
    useEffect(() => {
        setFee(feeObj)
    }, [])

    const showStartCollectionPage = () => {
        router.push({
            pathname: "/(main)/(clubs)/(fees)/startcollection",
            params: { fee: params.get('fee'), clubFeeTypeId: fee?.clubFeeTypeId }
        })
    }
    const gotoPayments = (clubFeeCollectionId: string, clubFeeTypePeriod: string, collected: number, total: number) => {
        router.push({
            pathname: "/(main)/(clubs)/(fees)/payments",
            params: { fee: params.get('fee'), clubFeeCollectionId, clubFeeTypePeriod, collected, total }
        })
    }
    const gotoAddFeeExceptions = () => {
        router.push({
            pathname: "/(main)/(clubs)/(fees)/exception/addfeeexception",
            params: { fee: params.get('fee'), clubFeeTypeId: fee.clubFeeTypeId }
        })
    }
    const gotoEditFeeExceptions = (clubFeeTypeExceptionId: string) => {
        router.push({
            pathname: "/(main)/(clubs)/(fees)/exception/editfeeexception",
            params: { fee: params.get('fee'), clubFeeTypeId: fee.clubFeeTypeId, clubFeeTypeExceptionId }
        })
    }
    const editFeeType = () => {
        router.push({
            pathname: "/(main)/(clubs)/(fees)/editfeetype",
            params: {
                clubFeeTypeId: fee.clubFeeTypeId, clubFeeAmount: fee.clubFeeAmount,
                clubFeeType: fee.clubFeeType, clubFeeTypeInterval: fee.clubFeeTypeInterval,
                isEditable: items.length > 0 ? "false" : "true"
            }
        })
    }

    
    const limit = 12;
    const { items, isLoading, isFetching, refreshing, onRefresh, loadMore } = usePaginatedQuery(
      useGetCollectionsOfFeeTypeQuery,
      { feeTypeId: feeObj.clubFeeTypeId, listCollectionsOfFeetType: "true" },
      limit
    );

    return (
        <ThemedView style={{ flex: 1 }}>
            <GestureHandlerRootView>
                <Spacer space={10} />
                <TouchableCard id={fee?.clubFeeTypeId} onPress={clubInfo.role === ROLE_ADMIN && editFeeType}
                    icon={<ThemedIcon name={'MaterialCommunityIcons:square-edit-outline'} color={colors.warning} />}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%" }}>
                        <View>
                            <ThemedText style={{ fontSize: 18, fontWeight: "bold" }}>{fee?.clubFeeType}</ThemedText>
                            <ThemedText style={{ fontSize: 10, marginTop: 5 }}>{fee?.clubFeeTypeInterval}</ThemedText>
                        </View>
                        <View><ThemedText>Rs. {fee?.clubFeeAmount}</ThemedText></View>
                    </View>
                </TouchableCard>
                <View>
                    <View style={{
                        flexDirection: "row", width: "80%", alignItems: "center",
                        justifyContent: "space-between", alignSelf: "center",
                    }}>
                        <TouchableOpacity onPress={() => setShowAddException(!showAddException)}
                            style={{ flexDirection: "row", width: "80%", justifyContent: "flex-start", alignItems: "center" }}>
                            <ThemedIcon size={25} name={showAddException ? 'MaterialCommunityIcons:chevron-down-circle' : 'MaterialCommunityIcons:chevron-right-circle'} color={colors.nav} />
                            <ThemedText style={{ ...appStyles.heading, paddingLeft: 5 }}>Exceptions</ThemedText>
                        </TouchableOpacity>
                        {clubInfo.role === ROLE_ADMIN && <TouchableOpacity style={{ width: 50, alignItems: "center" }} onPress={() => gotoAddFeeExceptions()}>
                            <ThemedIcon size={25} name={'MaterialCommunityIcons:plus-circle'} color={colors.add} />
                        </TouchableOpacity>}
                    </View>
                    {showAddException && <View style={{ width: "95%", alignSelf: "center" }}>
                        {isExceptionTypesLoading && <LoadingSpinner />}
                        {!isExceptionTypesLoading && (!exceptionTypes?.length || exceptionTypes?.length < 1) &&
                            <ThemedText style={{ alignSelf: "center", width: "80%" }}>No exceptions present for this fee type. You can add exceptions by pressing the + icon above. With this feature you can configure special fees for some members for this fee type (eg. in case of leave)</ThemedText>}
                        {!isExceptionTypesLoading && exceptionTypes?.map((et: any) =>
                            <View key={et.clubFeeTypeExceptionId}><KeyValueTouchableBox edit onPress={() => gotoEditFeeExceptions(et.clubFeeTypeExceptionId)}
                                keyName={et.clubFeeTypeExceptionReason} keyValue={`Rs. ${et.clubFeeExceptionAmount}`} />
                                <Spacer space={4} />
                            </View>
                        )}
                    </View>
                    }
                </View>
                <View style={{ flex: 1 }}>
                    <ThemedText style={appStyles.heading}>Collections</ThemedText>
                    {!isLoading &&
                        <FlatList style={{ width: "100%" }}
                            data={items}
                            ListEmptyComponent={() => <ThemedText style={{ alignSelf: "center", width: "85%" }}>No collections present. To start collecting fee for a period, press the below button.</ThemedText>}
                            initialNumToRender={20}
                            onEndReached={loadMore}
                            onEndReachedThreshold={0.2}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                            ListFooterComponent={() => isFetching && <><Spacer space={10} /><LoadingSpinner /></> || <Spacer space={40} />}
                            ItemSeparatorComponent={() => <Spacer space={4} />}
                            renderItem={({ item }) => (
                                <TouchableCard onPress={() => gotoPayments(item.clubFeeCollectionId, item.clubFeeTypePeriod, item.collected, item.total)} id={item}>
                                    <View style={{
                                        flexDirection: "row", width: "90%",
                                        justifyContent: "space-between", alignItems: "center", flexWrap: "wrap"
                                    }}>
                                        <View style={{ width: "50%" }}>
                                            <ThemedText style={{ fontWeight: "bold" }}>{item.clubFeeTypePeriod}</ThemedText>
                                        </View>
                                        <View style={{ width: "50%" }}>
                                            <Spacer space={2} />
                                            <ProgressBar height={12} value={Math.round(item.collected / item.total * 100)} />
                                        </View>
                                    </View>
                                </TouchableCard>
                            )}
                        />
                    }
                </View>
                {clubInfo.role === ROLE_ADMIN &&
                    <ThemedButton style={{ position: "absolute", bottom: 20, alignSelf: "center" }} title='Start new collection' onPress={showStartCollectionPage} />
                }
            </GestureHandlerRootView>
        </ThemedView>
    )
}

export default FeeTypeDetails;

