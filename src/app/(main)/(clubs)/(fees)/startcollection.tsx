import { View, Text, FlatList, Button, TextInput, Platform } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'expo-router/build/hooks';
import { getNextPeriodFeeMemberList, getNextPeriods, saveNextPeriodFeeCollection } from '@/src/helpers/fee_helper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import ThemedButton from '@/src/components/ThemedButton';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import { UserContext } from '@/src/context/UserContext';
import { router } from 'expo-router';
import ThemedView from '@/src/components/themed-components/ThemedView';
import ThemedText from '@/src/components/themed-components/ThemedText';
import TouchableCard from '@/src/components/TouchableCard';
import Spacer from '@/src/components/Spacer';
import { useTheme } from '@/src/hooks/use-theme';
import { isValidYear } from '@/src/utils/validators';
import { getCurrentMonthItem, getCurrentQuarterItem, getMonths, getQuarters } from '@/src/utils/common';

const StartNextPeriod = () => {
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [periods, setPeriods] = useState<{ period: string, startDate: string }[] | undefined>();
    const [isStartCollectionEnabled, setIsStartCollectionEnabled] = useState(true)

    const [isLoadingPeriods, setIsLoadingPeriods] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false)
    const [nextPeriodDate, setNextPeriodDate] = useState<string>();
    const [nextPeriodFee, setNextPeriodFee] = useState<any>(undefined);
    const { userInfo } = useContext(UserContext)
    const { colors } = useTheme()
    const params = useSearchParams()
    const interval = JSON.parse(params.get('fee') || '').clubFeeTypeInterval;

    useEffect(() => {
        if (validate(year)) {
            if (interval != 'YEARLY') {
                const periodList = interval === 'MONTHLY' ? getMonths(Number(year)) : getQuarters(Number(year))
                setPeriods(periodList)
                setNextPeriodDate(interval === 'MONTHLY' ? getCurrentMonthItem(periodList)?.startDate : getCurrentQuarterItem(periodList)?.startDate)
            } else {
                setIsLoadingPeriods(true)
                setNextPeriodDate(year + '-01-01')
                getNextPeriodFeeMemberList(params.get("clubFeeTypeId"), "true")
                    .then(response => { setNextPeriodFee(response.data) })
                    .catch(error => console.error(error))
                    .finally(() => setIsLoadingPeriods(false));
            }
            setIsStartCollectionEnabled(true)
        } else {
            if (interval != 'YEARLY') {
                setPeriods([])
            }
            setIsStartCollectionEnabled(false)
        }
    }, [year]);

    useEffect(() => {
        if (periods && periods.length > 0) {
            setIsLoadingPeriods(true)
            getNextPeriodFeeMemberList(params.get("clubFeeTypeId"), "true")
                .then(response => { setNextPeriodFee(response.data) })
                .catch(error => console.error(error))
                .finally(() => setIsLoadingPeriods(false));
        }
    }, [periods]);


    const handleStartCollection = () => {
        setIsLoadingPeriods(true)
        let nextPeriodLabel;
        if (interval !== 'YEARLY') {
            const nextP = periods?.find((p: any) => p.startDate == nextPeriodDate)
            nextPeriodLabel = nextP?.period + '-' + nextPeriodDate?.substring(0, 4)
        } else {
            nextPeriodLabel = nextPeriodDate?.substring(0, 4)
        }
        saveNextPeriodFeeCollection(params.get("clubFeeTypeId"), nextPeriodFee, nextPeriodDate, nextPeriodLabel, userInfo.email)
            .then(() =>
                router.dismissTo({
                    pathname: "/(main)/(clubs)/(fees)/feetypedetails",
                    params: { fee: params.get('fee') }
                })
            )
            .catch((error: any) => alert(error.response.data.error))
            .finally(() => setIsLoadingPeriods(false));
    }

    return (
        <ThemedView style={{ flex: 1 }}>
            <GestureHandlerRootView>
                <View style={{
                    flexDirection: "row", width: "80%", justifyContent: "space-between",
                    alignSelf: "center", marginBottom: 10, alignItems: "center",
                    marginTop: Platform.OS === 'web' ? 10 : 0
                }}>
                    <ThemedText style={{ width: "35%", fontWeight: "bold" }}>Select Period</ThemedText>
                    <View style={{ width: "65%", flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                        {interval != 'YEARLY' &&
                            <Picker style={{ width: "64%" }}
                                selectedValue={interval === 'MONTHLY' ? getCurrentMonthItem(periods)?.startDate : getCurrentQuarterItem(periods)?.startDate}
                                onValueChange={(itemValue, _itemIndex) => setNextPeriodDate(itemValue)}>
                                {periods?.map(monthObj => {
                                    return <Picker.Item key={monthObj.period} label={monthObj.period} value={monthObj.startDate} />
                                })}
                            </Picker>}
                        <TextInput keyboardType='numeric' defaultValue={'2025'} onChangeText={(text) => setYear(text)}
                            style={{
                                color: colors.text, width: "30%", fontSize: 18, textAlign: "center",
                                borderBottomColor: colors.text, borderBottomWidth: 1, padding: 1
                            }} />

                    </View>
                </View>
                <View style={{ height: "100%" }}>
                    {isLoadingPeriods && <LoadingSpinner />}
                    {!isLoadingPeriods &&
                        <FlatList style={{ width: "100%" }}
                            data={nextPeriodFee}
                            initialNumToRender={8}
                            ListFooterComponent={() => <Spacer space={80}/>}
                            ItemSeparatorComponent={() => <Spacer space={4} />}
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
                <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-around", alignItems: "center", position: "absolute", bottom: 30 }}>
                    {!isLoadingPeriods && <ThemedButton title='Start Collection' onPress={handleStartCollection} disabled={!isStartCollectionEnabled} />}
                </View>
            </GestureHandlerRootView>
        </ThemedView>
    )
}

export default StartNextPeriod

const MemberFeeItem = (props: {
    id: number;
    firstName: string | undefined;
    lastName: string | undefined;
    clubFeeAmount: number;
    exemption: string
}) => {


    return (
        <TouchableCard>
            <ThemedText>{props?.firstName} {props?.lastName}</ThemedText>
            <ThemedText>{props?.clubFeeAmount}</ThemedText>
        </TouchableCard>
    )
}


const validate = (year: string) => {
    if (!isValidYear(year)) {
        return false
    }
    return true
}