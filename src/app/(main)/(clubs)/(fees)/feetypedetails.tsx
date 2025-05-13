import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'expo-router/build/hooks'
import ThemedButton from '@/src/components/ThemedButton'
import { appStyles } from '@/src/utils/styles'
import { getExceptionTypes, getCollectionsOfFeeType } from '@/src/helpers/fee_helper'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import KeyValueTouchableBox from '@/src/components/KeyValueTouchableBox'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { router, useFocusEffect } from 'expo-router'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import TouchableCard from '@/src/components/TouchableCard'

const FeeTypeDetails = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [showAddException, setShowAddException] = useState(false)
    const [fee, setFee] = useState<any>()
    const [exceptionTypes, setExceptionTypes] = useState<[{}]>()
    const [feeCollections, setFeeCollections] = useState<any>([])
    const [isFeeCollectionsLoading, setIsFeeCollectionsLoading] = useState(false)

    const params = useSearchParams()

    const feeObj = JSON.parse(params.get('fee') || "")

    const setExceptionTypesValue = () => {
        getExceptionTypes(feeObj.clubFeeTypeId)
            .then(response => {
                console.log(response.data)
                setExceptionTypes(response.data)
            })
            .catch((error) => alert(error?.message))
            .finally(() => setIsLoading(false))
    }

    const setFeeCollectionsValue = () => {
        setIsFeeCollectionsLoading(true)
        getCollectionsOfFeeType(feeObj.clubFeeTypeId, "true")
            .then(response => {
                console.log(response.data)
                setFeeCollections(response.data)
            })
            .catch((error) => alert(error?.message))
            .finally(() => setIsFeeCollectionsLoading(false))
    }

    useFocusEffect(
        useCallback(() => {
            setFeeCollectionsValue()
            setExceptionTypesValue()
            return () => { console.log('Screen is unfocused'); };
        }, [])
    );

    useEffect(() => {
        setFee(feeObj)
        console.log(feeObj)
    }, [])

    const showStartCollectionPage = () => {
        router.push({
            pathname: "/(main)/(clubs)/(fees)/startcollection",
            params: { fee: params.get('fee'), clubFeeTypeId: fee?.clubFeeTypeId }
        })
    }
    const gotoPayments = (clubFeeCollectionId: string, clubFeeTypePeriod: string) => {
        router.push({
            pathname: "/(main)/(clubs)/(fees)/payments",
            params: { fee: params.get('fee'), clubFeeCollectionId, clubFeeTypePeriod }
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
                clubFeeType: fee.clubFeeType,clubFeeTypeInterval: fee.clubFeeTypeInterval,
                isAmountEditable: feeCollections.length > 0 ? "false" : "true"
            }
        })
    }
    return (
        <GestureHandlerRootView>
            <View style={{ marginVertical: 10 }} />
            <TouchableCard id={fee?.clubFeeTypeId} showDetails={editFeeType} style={{
                flexDirection: "row",
                justifyContent: "space-between", alignSelf: "center"
            }}>
                <View>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>{fee?.clubFeeType}</Text>
                    <Text style={{ fontSize: 10, marginTop: 5 }}>{fee?.clubFeeTypeInterval}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <Text style={{ marginRight: 10 }}>Rs. {fee?.clubFeeAmount}</Text>
                    <MaterialCommunityIcons size={20} name={'square-edit-outline'} />
                </View>
            </TouchableCard>
            <View>
                <View style={{
                    flexDirection: "row", width: "70%", alignItems: "center",
                    justifyContent: "space-between", alignSelf: "center",
                }}>
                    <TouchableOpacity onPress={() => setShowAddException(!showAddException)}
                        style={{ flexDirection: "row", width: "80%", justifyContent: "flex-start", alignItems: "center" }}>
                        <MaterialCommunityIcons size={25} name={showAddException ? 'chevron-down-circle' : 'chevron-right-circle'} />
                        <Text style={appStyles.heading}>Exceptions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: 50, alignItems: "center" }} onPress={() => gotoAddFeeExceptions()}>
                        <MaterialCommunityIcons size={25} name={'plus-circle'} />
                    </TouchableOpacity>
                </View>
                {showAddException && <View style={{ width: "90%", alignSelf: "center" }}>
                    {(!exceptionTypes?.length || exceptionTypes?.length < 1) && 
                    <Text style={{ alignSelf: "center", width:"80%" }}>No exceptions present for this fee type. You can add exceptions by pressing the + icon above. With this feature you can configure special fees for some members for this fee type (eg. in case of leave)</Text>}
                    {exceptionTypes?.map((et: any) =>
                        <KeyValueTouchableBox edit key={et.clubFeeTypeExceptionId} onPress={() => gotoEditFeeExceptions(et.clubFeeTypeExceptionId)}
                            keyName={et.clubFeeTypeExceptionReason} keyValue={`Rs. ${et.clubFeeExceptionAmount}`} />
                    )}
                </View>
                }
            </View>
            <View style={{ height: 450 }}>
                <Text style={appStyles.heading}>Collections</Text>
                {isFeeCollectionsLoading && <LoadingSpinner />}
                {!isFeeCollectionsLoading && feeCollections.length ==0 && 
                <Text style={{alignSelf:"center", width:"80%"}}>No collections present. To start collecting fee for a period, press the below button.</Text>}
                {!isFeeCollectionsLoading && feeCollections &&
                    <FlatList style={{ width: "100%" }}
                        data={feeCollections}
                        initialNumToRender={8}
                        //onEndReached={fetchNextPage}
                        //onEndReachedThreshold={0.5}
                        renderItem={({ item }) => (
                            <KeyValueTouchableBox onPress={() => gotoPayments(item.clubFeeCollectionId, item.clubFeeTypePeriod)} keyName={item.clubFeeTypePeriod}
                                keyValue={item.total != 0 ? `${Math.round(item.collected / item.total * 100)}%` : 'NA'} goto/>
                        )}
                    />
                }
            </View>
            <View style={{ position: "absolute", bottom: 30, alignSelf:"center" }} >
            <ThemedButton title='Start new collection' onPress={showStartCollectionPage} />
            </View>
            {/*  <Modal isVisible={isSelectPeriodVisible}>
                <View style={{ backgroundColor: "white", borderRadius: 5, paddingBottom: 20 }}>
                    <Text style={appStyles.heading}>Select Period</Text>
                    <Picker style={{ width: "60%" , alignSelf:"center"}}
                        selectedValue={"MONTHLY"}
                        onValueChange={(itemValue, _itemIndex) => undefined}>
                        <Picker.Item label="MONTHLY" value="MONTHLY" />
                        <Picker.Item label="QUATERLY" value="QUATERLY" />
                        <Picker.Item label="YEARLY" value="YEARLY" />
                        <Picker.Item label="ADHOC" value="ADHOC" />
                    </Picker>
                    <View style={{flexDirection:"row", justifyContent:"space-around"}}>
                    <ThemedButton title='Start' onPress={showStartCollectionPage}/>
                    <ThemedButton title='Cancel' onPress={() => setIsSelectPeriodVisible(false)}/>
                    </View>
                </View>
            </Modal>  */}
        </GestureHandlerRootView>
    )
}

export default FeeTypeDetails
