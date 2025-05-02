import { View, Text, FlatList, TouchableOpacity, Button } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'expo-router/build/hooks';
import { Fee, getFeePayments, saveFeePayments } from '@/src/helpers/fee_helper';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { appStyles } from '@/src/utils/styles';
import Checkbox from 'expo-checkbox';
import ThemedButton from '@/src/components/ThemedButton';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '@/src/context/AuthContext';

const Payments = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [reload, setReload] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false)
    const [feeByMembers, setFeeByMembers] = useState<any | undefined>(undefined);
    const [paymentStatusUpdates, setPaymentStatusUpdates] = useState<{
        clubFeePaymentId: number;
        paid: boolean;
        firstName?: string
    }[]>([])
    const { userInfo } = useContext(AuthContext)

    const params = useSearchParams()

    useEffect(() => {
        setIsLoading(true)
        setPaymentStatusUpdates([]);
        getFeePayments(params.get("clubFeeCollectionId"), "true")
            .then(response => { console.log(response.data); setFeeByMembers(response.data) })
            .catch(error => console.error(error))
            .finally(() => setIsLoading(false));
    }, [reload])

    const updatePaymentStatus = () => {
        if (paymentStatusUpdates.length == 0) {
            alert("No updates selected")
        } else {
            setIsConfirmVisible(true)
        }
    }

    const savePaymentUpdates = () => {
        setIsLoading(true)
        setIsConfirmVisible(false)
        saveFeePayments(paymentStatusUpdates, "true", userInfo.email)
            .then(() => setReload(prev => !prev))
            .catch(error => console.error(error))
            .finally(() => setIsLoading(false));
    }

    return (
        <GestureHandlerRootView>
            <View style={{ height: "88%", marginTop: 20 }}>
                {isLoading && <LoadingSpinner />}
                {!isLoading &&
                    <FlatList style={{ width: "100%" }}
                        data={feeByMembers}
                        initialNumToRender={8}
                        //onEndReached={fetchNextPage}
                        //onEndReachedThreshold={0.5}
                        renderItem={({ item }) => (
                            <MemberFeeItem {...item} key={item.clubFeePaymentId} feeByMembers={feeByMembers} setPaymentStatusUpdates={setPaymentStatusUpdates} />
                        )}
                    />}
            </View>
            <Modal isVisible={isConfirmVisible}>
                <ScrollView>
                    <View style={{ backgroundColor: "white", borderRadius: 5, paddingBottom: 20 }}>
                        <Text style={appStyles.heading}>Confirm Updates</Text>
                        {paymentStatusUpdates.map((item) => {
                            return <PaymentUpdates key={item.clubFeePaymentId} {...item} />
                        })}
                        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                            <ThemedButton title="Update" onPress={() => savePaymentUpdates()} />
                            <ThemedButton title="Cancel" onPress={() => setIsConfirmVisible(false)} />
                        </View>
                    </View>
                </ScrollView>
            </Modal>
            <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                <ThemedButton title='Update Status' onPress={() => updatePaymentStatus()} />
                <Text>PERIOD-TBD</Text>
            </View>
        </GestureHandlerRootView>
    )
}

export default Payments

const MemberFeeItem = (props: {
    clubFeePaymentId: number; firstName: string | undefined;
    paid: number; amount: number; setPaymentStatusUpdates: any;
    feeByMembers: any | undefined
}) => {
    const [isSelected, setIsSelected] = useState(props?.paid != 0)

    const selectItem = () => {
        setIsSelected(prev => !prev)

        props.setPaymentStatusUpdates((prev: ({ clubFeePaymentId: number; paid: Boolean; firstName?: string | undefined })[]) => {

            let item = prev.find(item => item.clubFeePaymentId == props.clubFeePaymentId)
            const initialPaymentStatus = props.feeByMembers?.find((item: { clubFeePaymentId: number; }) => item.clubFeePaymentId == props.clubFeePaymentId)
            if (item) {
                item.paid = !isSelected
            } else {
                item = { clubFeePaymentId: props.clubFeePaymentId, paid: !isSelected, firstName: props.firstName }
                prev.push(item)
            }
            if (initialPaymentStatus?.paid == !isSelected) {
                return prev.filter(item => item.clubFeePaymentId != initialPaymentStatus.clubFeePaymentId)
            }
            return prev
        })
    }

    return (
        <TouchableOpacity onPress={selectItem}>
            <View style={{...appStyles.shadowBox, width: "80%", marginBottom: 15, flexWrap: "wrap"}}>
                <View style={{ width: "5%" }}>
                    <Checkbox value={isSelected} color={"black"} /> 
                </View>
                <Text style={{ width: "75%", fontSize: 15, paddingLeft: 15 }}>{props?.firstName}</Text>
                <Text style={{ width: "20%", fontSize: 15, paddingLeft: 15 }}>{props?.amount}</Text>
            </View>
        </TouchableOpacity>
    )
}


const PaymentUpdates = (props: { clubFeePaymentId: number | undefined; firstName?: string | null | undefined; paid: boolean | undefined; }) => {
    return (
        <View style={{ ...appStyles.shadowBox, width: "80%", marginBottom: 15, flexWrap: "wrap"}}>
            <Text numberOfLines={1} style={{ width: "80%", fontSize: 15, paddingLeft: 5, textAlign: "left" }}>{props?.firstName}</Text>
            {props?.paid ?
                <MaterialCommunityIcons style={{ width: "20%", fontSize: 15, textAlign: "right" }} name='checkbox-marked' /> :
                <MaterialCommunityIcons style={{ width: "20%", fontSize: 15, textAlign: "right" }} name='checkbox-blank-outline' />}
        </View>
    )
}