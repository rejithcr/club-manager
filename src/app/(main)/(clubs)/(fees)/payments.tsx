import { View, Text, FlatList, TouchableOpacity,  Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'expo-router/build/hooks';
import { deleteFeeCollection, getFeePayments, saveFeePayments } from '@/src/helpers/fee_helper';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { appStyles } from '@/src/utils/styles';
import ThemedButton from '@/src/components/ThemedButton';
import Modal from 'react-native-modal';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '@/src/context/AuthContext';
import { router } from 'expo-router';
import { ClubContext } from '@/src/context/ClubContext';

const Payments = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false)
    const [feeByMembers, setFeeByMembers] = useState<any | undefined>(undefined);
    const [paymentStatusUpdates, setPaymentStatusUpdates] = useState<{
        clubFeePaymentId: number;
        paid: boolean;
        firstName?: string
    }[]>([])
    const { userInfo } = useContext(AuthContext)
    const { clubInfo } = useContext(ClubContext)

    const params = useSearchParams()

    useEffect(() => {
        setIsLoading(true)
        setPaymentStatusUpdates([]);
        getFeePayments(params.get("clubFeeCollectionId"), "true")
            .then(response => { console.log(response.data); setFeeByMembers(response.data) })
            .catch(error => console.error(error))
            .finally(() => setIsLoading(false));
    }, [])

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
        saveFeePayments(paymentStatusUpdates, clubInfo.clubId, "true", userInfo.email)
            .then(() => router.back())
            .catch(error => Alert.alert("Error", error.response.data.error))
            .finally(() => setIsLoading(false));
    }

    const deleteCollection = () => {
        Alert.alert(
            'Are you sure!',
            'This will delete the transcations of this collecton. This cannot be recovered.',
            [
                {
                    text: 'OK', onPress: () => {
                        setIsLoading(true)
                        deleteFeeCollection(params.get("clubFeeCollectionId"), userInfo.email)
                            .then((response) => {Alert.alert("Success", response.data.message); router.back()})
                            .catch(error => Alert.alert("Error", error.response.data.error))
                            .finally(() => setIsLoading(false));
                    }
                },
                { text: 'cancel', onPress: () => null},
            ],
            { cancelable: true },
        );
    }
    return (
        <GestureHandlerRootView>
            <Text style={{ ...appStyles.heading }}>Payment Status - {params.get("clubFeeTypePeriod")}</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "80%", alignSelf: "center", marginBottom: 10 }}>
                <View style={{flexDirection:"row"}}><Text style={{marginRight:10}}>Paid</Text><MaterialIcons name='check-circle' size={20} /></View>
                <View style={{flexDirection:"row"}}><Text style={{marginRight:10}}>Not Paid</Text><MaterialIcons name='radio-button-unchecked' size={20} /></View>
            </View>
            <View style={{ height: "80%" }}>
                {isLoading && <LoadingSpinner />}
                {!isLoading &&
                    <FlatList style={{ width: "100%" }}
                        data={feeByMembers}
                        initialNumToRender={8}
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
            <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-around", alignItems: "center", position: "absolute", bottom: 30}}>
                <ThemedButton title='Update Payment Status' onPress={() => updatePaymentStatus()} />
                <MaterialCommunityIcons name='delete' size={30} onPress={() => deleteCollection()} />
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

        props.setPaymentStatusUpdates((prev: ({ clubFeePaymentId: number; paid: Boolean; firstName?: string | undefined; amount: number })[]) => {

            let item = prev.find(item => item.clubFeePaymentId == props.clubFeePaymentId)
            const initialPaymentStatus = props.feeByMembers?.find((item: { clubFeePaymentId: number; }) => item.clubFeePaymentId == props.clubFeePaymentId)
            if (item) {
                item.paid = !isSelected
            } else {
                item = { clubFeePaymentId: props.clubFeePaymentId, paid: !isSelected, firstName: props.firstName, amount: props.amount }
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
            <View style={{ ...appStyles.shadowBox, width: "80%", marginBottom: 15, flexWrap: "wrap" }}>
                <View style={{ width: "10%" }}>
                    {isSelected ? <MaterialIcons name='check-circle' size={20} /> :
                        <MaterialIcons name='radio-button-unchecked' size={20} />}
                    {/* <Checkbox value={isSelected} color={"black"} /> */}
                </View>
                <Text style={{ width: "70%", fontSize: 15, paddingLeft: 15 }}>{props?.firstName}</Text>
                <Text style={{ width: "20%", fontSize: 15, paddingLeft: 15 }}>{props?.amount}</Text>
            </View>
        </TouchableOpacity>
    )
}


const PaymentUpdates = (props: { clubFeePaymentId: number | undefined; firstName?: string | null | undefined; paid: boolean | undefined; }) => {
    return (
        <View style={{ ...appStyles.shadowBox, width: "80%", marginBottom: 15, flexWrap: "wrap" }}>
            <Text numberOfLines={1} style={{ width: "80%", fontSize: 15, paddingLeft: 5, textAlign: "left" }}>{props?.firstName}</Text>
            {props?.paid ?
                <MaterialCommunityIcons style={{ width: "20%", fontSize: 15, textAlign: "right" }} name='checkbox-marked' /> :
                <MaterialCommunityIcons style={{ width: "20%", fontSize: 15, textAlign: "right" }} name='checkbox-blank-outline' />}
        </View>
    )
}