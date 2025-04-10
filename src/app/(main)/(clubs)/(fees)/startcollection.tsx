import { View, Text, FlatList, TouchableOpacity, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'expo-router/build/hooks';
import { Fee, getNextPeriodFee } from '@/src/helpers/fee_helper';
import { GestureHandlerRootView, Pressable } from 'react-native-gesture-handler';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { appStyles } from '@/src/utils/styles';
import Checkbox from 'expo-checkbox';
import ThemedButton from '@/src/components/ThemedButton';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const StartNextPeriod = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false)
    const [periodValue, setPeriodValue] = useState("mar");
    const [nextPeriodFee, setNextPeriodFee] = useState<any>(undefined);
    const [paymentStatusUpdates, setPaymentStatusUpdates] = useState<{
        id: number;
        paid: boolean;
        name?: string
    }[]>([])

    const params = useSearchParams()

    useEffect(() => {
        setIsLoading(true)
        setPaymentStatusUpdates([]);
        getNextPeriodFee(Number(params.get("clubId")))
            .then(data => { setNextPeriodFee(data); setIsLoading(false) })
            .catch(error => console.error(error))
            .finally(() => setIsLoading(false));
    }, [periodValue])

    const updatePaymentStatus = () => {
        if (paymentStatusUpdates.length == 0) {
            alert("No updates selected")
        } else {
            setIsConfirmVisible(true)
        }
    }

    const skipPeriod = () => { console.log("presses skip")} 

    return (
        <GestureHandlerRootView>
            <View style={{
                flexDirection: "row", width: "80%", height: 75, justifyContent: "space-between",
                alignSelf: "center"
            }}>
                <Text numberOfLines={1} style={{
                    ...appStyles.title, lineHeight: 80,
                    width: "75%", textAlign: "left", marginLeft: 0
                }}>{params.get("clubName")}</Text>
                <Text style={{ width: "35%", lineHeight: 80, fontWeight: "bold", textAlign: "right" }}>2025 MAR</Text>
            </View>
            <View style={{ height: "78%", alignItems: "flex-end" }}>
                {isLoading && <LoadingSpinner />}
                {!isLoading &&
                    <FlatList style={{ width: "100%" }}
                        data={nextPeriodFee}
                        initialNumToRender={8}
                        //onEndReached={fetchNextPage}
                        //onEndReachedThreshold={0.5}
                        renderItem={({ item }) => (
                            <MemberFeeItem {...item} key={item.id} />
                        )}
                    />}
            </View>
            <Modal isVisible={isConfirmVisible}>
                <View style={{ backgroundColor: "white" }}>
                    <Text>{JSON.stringify(paymentStatusUpdates)}</Text>
                    <Button title="Hide modal" onPress={() => setIsConfirmVisible(false)} />
                </View>
            </Modal>
            <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                <ThemedButton title='Start Collection' onPress={() => updatePaymentStatus()} />
                <TouchableOpacity onPress={() => skipPeriod()}
                    style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ textAlign: "right", fontWeight: "bold" }}>SKIP</Text>
                    <MaterialCommunityIcons size={50} name='skip-next' />
                </TouchableOpacity>
            </View>
        </GestureHandlerRootView>
    )
}

export default StartNextPeriod

const MemberFeeItem = (props: {
    id: number;
    name: string | undefined;
    amount: number;
    exemption: string
}) => {

    const editFee = () => {
        console.log("Presed edit")
    }

    return (

        <TouchableOpacity onPress={editFee}>
            <View style={{
                ...appStyles.shadowBox, width: "80%", marginBottom: 15, flexWrap: "wrap",
                flexBasis: "auto"
            }}>
                <Text numberOfLines={1} style={{ width: "70%", fontSize: 15, paddingLeft: 5, textAlign: "left" }}>{props?.name}</Text>

                <Text style={{ width: "20%", fontSize: 15, textAlign: "right" }}>{props?.amount}</Text>

                <MaterialCommunityIcons style={{ width: "10%", fontSize: 15, textAlign: "right" }} name='square-edit-outline' />

                {/* <View style={{ width: "30%", flexDirection: "row", flexBasis: "auto", justifyContent: "flex-end" }}>
            </View> */}
                {/* <Picker selectedValue={"leave"} style={{ width: "60%", margin:0, padding:0 }}>
                <Picker.Item label="Leave (300)" value="leave" />
                <Picker.Item label="Injury (50)" value="injury" />
            </Picker> */}
            </View>
        </TouchableOpacity>
    )
}
