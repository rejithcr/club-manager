import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
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
import ThemedView from '@/src/components/themed-components/ThemedView'
import ThemedText from '@/src/components/themed-components/ThemedText'
import ThemedIcon from '@/src/components/themed-components/ThemedIcon'
import Spacer from '@/src/components/Spacer'
import { useTheme } from '@/src/hooks/use-theme'
import { ROLE_ADMIN } from '@/src/utils/constants'
import { ClubContext } from '@/src/context/ClubContext'

const FeeTypeDetails = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [showAddException, setShowAddException] = useState(false)
    const [fee, setFee] = useState<any>()
    const [exceptionTypes, setExceptionTypes] = useState<[{}]>()
    const [feeCollections, setFeeCollections] = useState<any>([])
    const [isFeeCollectionsLoading, setIsFeeCollectionsLoading] = useState(false)
    const { colors } = useTheme();
    const { clubInfo } = useContext(ClubContext)
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
                clubFeeType: fee.clubFeeType, clubFeeTypeInterval: fee.clubFeeTypeInterval,
                isEditable: feeCollections.length > 0 ? "false" : "true"
            }
        })
    }
    return (
        <ThemedView style={{ flex: 1 }}>
            <GestureHandlerRootView>
                <Spacer space={10} />
                <TouchableCard id={fee?.clubFeeTypeId} onPress={clubInfo.role === ROLE_ADMIN && editFeeType}
                     icon={<ThemedIcon name={'MaterialCommunityIcons:square-edit-outline'} color={colors.warning}/>}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width:"90%"}}>
                        <View>
                            <ThemedText style={{ fontSize: 18, fontWeight: "bold" }}>{fee?.clubFeeType}</ThemedText>
                            <ThemedText style={{ fontSize: 10, marginTop: 5 }}>{fee?.clubFeeTypeInterval}</ThemedText>
                        </View>
                        <View><ThemedText>Rs. {fee?.clubFeeAmount}</ThemedText></View>
                    </View>
                </TouchableCard>
                <View>
                    <View style={{
                        flexDirection: "row", width: "70%", alignItems: "center",
                        justifyContent: "space-between", alignSelf: "center",
                    }}>
                        <TouchableOpacity onPress={() => setShowAddException(!showAddException)}
                            style={{ flexDirection: "row", width: "80%", justifyContent: "flex-start", alignItems: "center" }}>
                            <ThemedIcon size={25} name={showAddException ? 'MaterialCommunityIcons:chevron-down-circle' : 'MaterialCommunityIcons:chevron-right-circle'} color={colors.nav}/>
                            <ThemedText style={{ ...appStyles.heading, paddingLeft: 5 }}>Exceptions</ThemedText>
                        </TouchableOpacity>
                        {clubInfo.role === ROLE_ADMIN &&<TouchableOpacity style={{ width: 50, alignItems: "center" }} onPress={() => gotoAddFeeExceptions()}>
                            <ThemedIcon size={25} name={'MaterialCommunityIcons:plus-circle'} color={colors.add} />
                        </TouchableOpacity>}
                    </View>
                    {showAddException && <View style={{ width: "90%", alignSelf: "center" }}>
                        {(!exceptionTypes?.length || exceptionTypes?.length < 1) &&
                            <ThemedText style={{ alignSelf: "center", width: "80%" }}>No exceptions present for this fee type. You can add exceptions by pressing the + icon above. With this feature you can configure special fees for some members for this fee type (eg. in case of leave)</ThemedText>}
                        {exceptionTypes?.map((et: any) =>
                            <View key={et.clubFeeTypeExceptionId}><KeyValueTouchableBox edit  onPress={() => gotoEditFeeExceptions(et.clubFeeTypeExceptionId)}
                                keyName={et.clubFeeTypeExceptionReason} keyValue={`Rs. ${et.clubFeeExceptionAmount}`} />
                                <Spacer space={4}/>
                                </View>
                        )}
                    </View>
                    }
                </View>
                <View style={{ height: 450 }}>
                    <ThemedText style={appStyles.heading}>Collections</ThemedText>
                    {isFeeCollectionsLoading && <LoadingSpinner />}
                    {!isFeeCollectionsLoading && feeCollections.length == 0 &&
                        <ThemedText style={{ alignSelf: "center", width: "80%" }}>No collections present. To start collecting fee for a period, press the below button.</ThemedText>}
                    {!isFeeCollectionsLoading && feeCollections &&
                        <FlatList style={{ width: "100%" }}
                            data={feeCollections}
                            initialNumToRender={8}
                            ItemSeparatorComponent={() => <Spacer space={4} />}
                            renderItem={({ item }) => (
                                <KeyValueTouchableBox onPress={() => gotoPayments(item.clubFeeCollectionId, item.clubFeeTypePeriod)} 
                                    keyName={item.clubFeeTypePeriod}
                                    keyValue={item.total != 0 ? `${Math.round(item.collected / item.total * 100)}%` : 'NA'} goto />
                            )}
                        />
                    }
                </View>
                {clubInfo.role === ROLE_ADMIN &&
                <View style={{ position: "absolute", bottom: 30, alignSelf: "center" }} >
                    <ThemedButton title='Start new collection' onPress={showStartCollectionPage} />
                </View>}
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
        </ThemedView>
    )
}

export default FeeTypeDetails
