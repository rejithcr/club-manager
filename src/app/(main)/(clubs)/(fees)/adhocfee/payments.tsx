import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'expo-router/build/hooks';
import { deleteAdhocFeeCollection, getAdhocFeePayments, saveAdhocFeePayments } from '@/src/helpers/fee_helper';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { appStyles } from '@/src/utils/styles';
import Checkbox from 'expo-checkbox';
import ThemedButton from '@/src/components/ThemedButton';
import Modal from 'react-native-modal';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '@/src/context/AuthContext';
import { router } from 'expo-router';
import { ClubContext } from '@/src/context/ClubContext';
import ShadowBox from '@/src/components/ShadowBox';

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
    const feeObj = JSON.parse(params.get('adhocFee') || "")

    useEffect(() => {
        setIsLoading(true)
        setPaymentStatusUpdates([]);
        getAdhocFeePayments(feeObj?.clubAdhocFeeId)
            .then(response => { console.log(response.data.memberAdhocFees); setFeeByMembers(response.data.memberAdhocFees) })
            .catch(error => console.error(error))
            .finally(() => setIsLoading(false));
    }, [])

    const updatePaymentStatus = () => {
        console.log(paymentStatusUpdates)
        if (paymentStatusUpdates.length == 0) {
            alert("No updates selected")
        } else {
            setIsConfirmVisible(true)
        }
    }

    const savePaymentUpdates = () => {
        setIsLoading(true)
        setIsConfirmVisible(false)
        saveAdhocFeePayments(paymentStatusUpdates, clubInfo.clubId, "true", userInfo.email)
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
                        deleteAdhocFeeCollection(feeObj?.clubAdhocFeeId, userInfo.email)
                            .then((response) => { Alert.alert("Success", response.data.message); router.back() })
                            .catch(error => Alert.alert("Error", error.response.data.error))
                            .finally(() => setIsLoading(false));
                    }
                },
                { text: 'cancel', onPress: () => null },
            ],
            { cancelable: true },
        );
    }
    
    return (
        <GestureHandlerRootView>
            <View style={{ marginVertical: 10 }} />
            <ShadowBox style={{
                flexDirection: "row", padding:10, 
                justifyContent: "space-between", alignSelf: "center"
            }}>
                <View>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>{feeObj?.clubAdhocFeeName}</Text>
                    <Text style={{ fontSize: 10, marginTop: 5 }}>{feeObj?.clubAdhocFeeDesc}</Text>
                </View>
                <Text style={{ marginRight: 10 }}>Rs. {feeObj?.clubAdhocFeePaymentAmount}</Text>
            </ShadowBox>
            <Text style={appStyles.heading}>Payment Status</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "80%", alignSelf: "center", marginBottom: 10 }}>
                <View style={{flexDirection:"row"}}><Text style={{marginRight:10}}>Paid</Text><MaterialIcons name='check-circle' size={20} /></View>
                <View style={{flexDirection:"row"}}><Text style={{marginRight:10}}>Not Paid</Text><MaterialIcons name='radio-button-unchecked' size={20} /></View>
            </View>
            <View style={{ height: "70%" }}>
                {isLoading && <LoadingSpinner />}
                {!isLoading &&
                    <FlatList style={{ width: "100%" }}
                        data={feeByMembers}
                        initialNumToRender={8}
                        renderItem={({ item }) => (
                            <MemberFeeItem {...item} key={item.clubAdhocFeePaymentId} feeByMembers={feeByMembers} setPaymentStatusUpdates={setPaymentStatusUpdates} />
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
    clubAdhocFeePaymentId: number; firstName: string | undefined;
    paid: number; clubAdhocFeePaymentAmount: number; setPaymentStatusUpdates: any;
    feeByMembers: any | undefined
}) => {
    const [isSelected, setIsSelected] = useState(props?.paid != 0)

    const selectItem = () => {
        setIsSelected(prev => !prev)

        props.setPaymentStatusUpdates((prev: ({ clubAdhocFeePaymentId: number; paid: Boolean; firstName?: string | undefined; clubAdhocFeePaymentAmount: number })[]) => {

            let item = prev.find(item => item.clubAdhocFeePaymentId == props.clubAdhocFeePaymentId)
            const initialPaymentStatus = props.feeByMembers?.find((item: { clubAdhocFeePaymentId: number; }) => item.clubAdhocFeePaymentId == props.clubAdhocFeePaymentId)
            if (item) {
                item.paid = !isSelected
            } else {
                item = { clubAdhocFeePaymentId: props.clubAdhocFeePaymentId, paid: !isSelected, firstName: props.firstName, clubAdhocFeePaymentAmount: props.clubAdhocFeePaymentAmount }
                prev.push(item)
            }
            if (initialPaymentStatus?.paid == !isSelected) {
                return prev.filter(item => item.clubAdhocFeePaymentId != initialPaymentStatus.clubAdhocFeePaymentId)
            }
            return prev
        })
    }

    return (
        <TouchableOpacity onPress={selectItem}>
            <View style={{ ...appStyles.shadowBox, width: "80%", marginBottom: 15, flexWrap: "wrap" }}>
                <View style={{ width: "5%" }}>
                    <Checkbox value={isSelected} color={"black"} />
                </View>
                <Text style={{ width: "75%", fontSize: 15, paddingLeft: 15 }}>{props?.firstName}</Text>
                <Text style={{ width: "20%", fontSize: 15, paddingLeft: 15 }}>{props?.clubAdhocFeePaymentAmount}</Text>
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