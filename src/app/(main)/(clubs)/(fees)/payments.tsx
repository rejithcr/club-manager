import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'expo-router/build/hooks';
import { Fee, getFeeByMembers } from '@/src/helpers/fee_helper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { appStyles } from '@/src/utils/styles';
import Checkbox from 'expo-checkbox';
import ThemedButton from '@/src/components/ThemedButton';
import { Picker } from '@react-native-picker/picker';


const Payments = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [periodValue, setPeriodValue] = useState();
    const [feeByMembers, setFeeByMembers] = useState<Fee[] | undefined>(undefined);
    const [paymentStatusUpdates, setPaymentStatusUpdates] = useState<{ id: number; paid: boolean; name?: string }[]>([])

    const params = useSearchParams()

    useEffect(() => {
        setIsLoading(true)
        getFeeByMembers(Number(params.get("clubId")), periodValue)
            .then(data => { setFeeByMembers(data); setIsLoading(false) })
            .catch(error => console.error(error))
            .finally(() => setIsLoading(false));
    }, [periodValue])

    const updatePaymentStatus = () => {
        if (paymentStatusUpdates.length == 0) {
            alert("No updates selected")
        } else {
            alert(JSON.stringify(paymentStatusUpdates))
        }
    }

    return (
        <GestureHandlerRootView>
            <Text style={appStyles.title}>{params.get("clubName")}</Text>
            <View style={{ height: "75%", alignItems: "center" }}>
                <Picker style={{ width: 175 }}
                    selectedValue={periodValue}
                    onValueChange={(itemValue, itemIndex) =>
                        setPeriodValue(itemValue)
                    }>
                    <Picker.Item label="2025 MAR" value="mar" />
                    <Picker.Item label="2025 FEB" value="feb" />
                </Picker>
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
            <ThemedButton title='Update Payment Status' onPress={() => updatePaymentStatus()} />
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
                <View style={{ width: "5%" }}><Checkbox value={isSelected} /></View>
                <Text style={{ width: "75%", fontSize: 15, paddingLeft: 15 }}>{props?.name}</Text>
                <Text style={{ width: "20%", fontSize: 15, paddingLeft: 15 }}>{props?.amount}</Text>
            </View>
        </TouchableOpacity>
    )
}
