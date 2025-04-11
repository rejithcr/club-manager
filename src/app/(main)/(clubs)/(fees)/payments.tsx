import { View, Text, FlatList, TouchableOpacity, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'expo-router/build/hooks';
import { Fee, getFeeByMembers } from '@/src/helpers/fee_helper';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { appStyles } from '@/src/utils/styles';
import Checkbox from 'expo-checkbox';
import ThemedButton from '@/src/components/ThemedButton';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Payments = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false)
    const [periodValue, setPeriodValue] = useState("mar");
    const [feeByMembers, setFeeByMembers] = useState<Fee[] | undefined>(undefined);
    const [paymentStatusUpdates, setPaymentStatusUpdates] = useState<{
        id: number;
        paid: boolean;
        name?: string
    }[]>([])

    const params = useSearchParams()

    useEffect(() => {
        setIsLoading(true)
        setFeeByMembers(undefined)
        setPaymentStatusUpdates([]);
        getFeeByMembers(Number(params.get("clubId")), periodValue)
            .then(data => { setFeeByMembers(data); setIsLoading(false) })
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

    return (
        <GestureHandlerRootView>
            <Text style={appStyles.title}>{params.get("clubName")}</Text>
            <View style={{ height: "78%", alignItems: "flex-end" }}>
                {isLoading && <LoadingSpinner />}
                {!isLoading &&
                    <FlatList style={{ width: "100%" }}
                        data={feeByMembers}
                        initialNumToRender={8}
                        //onEndReached={fetchNextPage}
                        //onEndReachedThreshold={0.5}
                        renderItem={({ item }) => (
                            <MemberFeeItem {...item} key={item.id} feeByMembers={feeByMembers} setPaymentStatusUpdates={setPaymentStatusUpdates} />
                        )}
                    />}
            </View>
            <Modal isVisible={isConfirmVisible}>
                <ScrollView>
                    <View style={{ backgroundColor: "white", borderRadius: 5, paddingBottom: 20 }}>
                        <Text style={appStyles.heading}>Confirm Updates</Text>
                        {paymentStatusUpdates.map((item) => {
                            return <PaymentUpdates key={item.id} {...item} />
                        })}
                        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                            <ThemedButton title="Update" onPress={() => setIsConfirmVisible(false)} />
                            <ThemedButton title="Cancel" onPress={() => setIsConfirmVisible(false)} />
                        </View>
                    </View>
                </ScrollView>
            </Modal>
            <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                <ThemedButton title='Update Status' onPress={() => updatePaymentStatus()} />
                <Picker style={{ width: 155 }}
                    selectedValue={periodValue}
                    onValueChange={(itemValue, itemIndex) => setPeriodValue(itemValue)}>
                    <Picker.Item label="2025 MAR" value="mar" />
                    <Picker.Item label="2025 FEB" value="feb" />
                    <Picker.Item label="2024 Q4" value="q4" />
                    <Picker.Item label="2023" value="2023" />
                </Picker>
            </View>
        </GestureHandlerRootView>
    )
}

export default Payments

const MemberFeeItem = (props: {
    id: number; name: string | undefined;
    paid: boolean; amount: number; setPaymentStatusUpdates: any;
    feeByMembers: Fee[] | undefined
}) => {
    const [isSelected, setIsSelected] = useState(props?.paid)

    const selectItem = () => {

        setIsSelected(!isSelected)

        props.setPaymentStatusUpdates((prev: ({ id: number; paid: Boolean; name?: string | undefined })[]) => {

            let item = prev.find(item => item.id == props.id)
            const initialPaymentStatus = props.feeByMembers?.find((item: { id: number; }) => item.id == props.id)
            if (item) {
                item.paid = !isSelected
            } else {
                item = { id: props.id, paid: !isSelected, name: props.name }
                prev.push(item)
            }
            if (initialPaymentStatus?.paid == !isSelected) {
                return prev.filter(item => item.id != initialPaymentStatus.id)
            }
            return prev
        })
    }

    return (
        <TouchableOpacity onPress={selectItem}>
            <View style={{
                ...appStyles.shadowBox, width: "80%", marginBottom: 15, flexWrap: "wrap",
                flexBasis: "auto"
            }}>
                <View style={{ width: "5%" }}><Checkbox value={isSelected} color={"black"} /></View>
                <Text style={{ width: "75%", fontSize: 15, paddingLeft: 15 }}>{props?.name}</Text>
                <Text style={{ width: "20%", fontSize: 15, paddingLeft: 15 }}>{props?.amount}</Text>
            </View>
        </TouchableOpacity>
    )
}


const PaymentUpdates = (props: { id: number | undefined; name?: string | null | undefined; paid: boolean | undefined; }) => {
    return (
        <View style={{
            ...appStyles.shadowBox, width: "80%", marginBottom: 15, flexWrap: "wrap",
            flexBasis: "auto"
        }}>
            <Text numberOfLines={1} style={{ width: "80%", fontSize: 15, paddingLeft: 5, textAlign: "left" }}>{props?.name}</Text>
            {props?.paid ?
                <MaterialCommunityIcons style={{ width: "20%", fontSize: 15, textAlign: "right" }} name='checkbox-marked' /> :
                <MaterialCommunityIcons style={{ width: "20%", fontSize: 15, textAlign: "right" }} name='checkbox-blank-outline' />}
        </View>
    )
}