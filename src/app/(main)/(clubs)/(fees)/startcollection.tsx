import { View, Text, FlatList, TouchableOpacity, Button } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'expo-router/build/hooks';
import { getNextPeriodFeeMemberList, getNextPeriods, saveNextPeriodFeeCollection } from '@/src/helpers/fee_helper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import ThemedButton from '@/src/components/ThemedButton';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import KeyValueTouchableBox from '@/src/components/KeyValueTouchableBox';
import { AuthContext } from '@/src/context/AuthContext';
import { router } from 'expo-router';

const StartNextPeriod = () => {
    const [isLoadingPeriods, setIsLoadingPeriods] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false)
    const [nextPeriods, setNextPeriods] = useState<any>([]);
    const [nextPeriodDate, setNextPeriodDate] = useState<string>();
    const [nextPeriodFee, setNextPeriodFee] = useState<any>(undefined);
    const { userInfo } = useContext(AuthContext)

    const params = useSearchParams()

    useEffect(() => {
        setIsLoading(true)
        setIsLoadingPeriods(true)
        getNextPeriods(params.get("clubFeeTypeId"), "true")
            .then(response => { setNextPeriods(response.data); setNextPeriodDate(response.data[0].date) })
            .catch(error => console.error(error))
            .finally(() => { setIsLoading(false); setIsLoadingPeriods(false) });
    }, [])

    useEffect(() => {
        setIsLoadingPeriods(true)
        getNextPeriodFeeMemberList(params.get("clubFeeTypeId"), "true")
            .then(response => { setNextPeriodFee(response.data) })
            .catch(error => console.error(error))
            .finally(() => setIsLoadingPeriods(false));
    }, [nextPeriodDate])

    const startCollection = () => {
        setIsLoadingPeriods(true)
        const nextPeriodLabel = nextPeriods.filter((p: any) => p.date == nextPeriodDate)[0].label
        saveNextPeriodFeeCollection(params.get("clubFeeTypeId"), nextPeriodFee, nextPeriodDate, nextPeriodLabel, userInfo.email)
            .then(() =>
                router.dismissTo({
                    pathname: "/(main)/(clubs)/(fees)/feetypedetails",
                    params: { fee: params.get('fee'), clubId: params.get("clubId"), clubName: params.get("clubName")}
                })
            )
            .catch((error: any) => alert(error))
            .finally(() => setIsLoadingPeriods(false));
    }

    return (
        <GestureHandlerRootView>
            {isLoading && <LoadingSpinner />}
            {!isLoading &&
                <View style={{
                    flexDirection: "row", width: "80%", justifyContent: "space-between",
                    alignSelf: "center", marginBottom: 10, alignItems: "center"
                }}>
                    <Text style={{ width: "35%", fontWeight: "bold" }}>Select Period</Text>
                    <Picker style={{ width: "60%" }}
                        selectedValue={nextPeriodDate}
                        onValueChange={(itemValue, _itemIndex) => setNextPeriodDate(itemValue)}>
                        {nextPeriods?.map((period: { label: string | undefined; date: string; }) => {
                            return <Picker.Item key={period.date} label={period.label} value={period.date} />
                        })}
                    </Picker>
                </View>}
            <View style={{ height: "80%" }}>
                {isLoadingPeriods && <LoadingSpinner />}
                {!isLoadingPeriods &&
                    <FlatList style={{ width: "100%" }}
                        data={nextPeriodFee}
                        initialNumToRender={8}
                        //onEndReached={fetchNextPage}
                        //onEndReachedThreshold={0.5}
                        renderItem={({ item }) => (
                            <MemberFeeItem {...item} key={item.memberId} />
                        )}
                    />}
            </View>
            <Modal isVisible={isConfirmVisible}>
                <View style={{ backgroundColor: "white" }}>
                    <Text>Test</Text>
                    <Button title="Hide modal" onPress={() => setIsConfirmVisible(false)} />
                </View>
            </Modal>
            <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                {!isLoading && !isLoadingPeriods && <ThemedButton title='Start Collection' onPress={startCollection} /> }
            </View>
        </GestureHandlerRootView>
    )
}

export default StartNextPeriod

const MemberFeeItem = (props: {
    id: number;
    firstName: string | undefined;
    clubFeeAmount: number;
    exemption: string
}) => {

    const editFee = () => {
        console.log("Presed edit")
    }

    return (
        <KeyValueTouchableBox onPress={undefined} keyName={props?.firstName} keyValue={props?.clubFeeAmount} edit/>
    )
}
