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
import ThemedView from '@/src/components/themed-components/ThemedView';
import ThemedText from '@/src/components/themed-components/ThemedText';
import ShadowBox from '@/src/components/ShadowBox';
import ThemedCheckBox from '@/src/components/themed-components/ThemedCheckBox';

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
        <ThemedView style={{ flex: 1 }}>
        <GestureHandlerRootView>
            <ThemedText style={{ ...appStyles.heading }}>Payment Status - {params.get("clubFeeTypePeriod")}</ThemedText>
            <View style={{ flexDirection: "row",  alignItems: "center", width: "80%", alignSelf: "center", marginBottom: 10 }}>
                <MaterialIcons name='warning' size={25} color={"#fff85b"}/><ThemedText style={{marginLeft:10, fontSize: 20}}>Pending</ThemedText>                
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
                        <ThemedText style={appStyles.heading}>Confirm Updates</ThemedText>
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
                <MaterialCommunityIcons name='delete' size={30} onPress={() => deleteCollection()} color={"#ff6b6b"}/>
            </View>
        </GestureHandlerRootView>
        </ThemedView>
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
            <ShadowBox style={{ ...appStyles.shadowBox, width: "80%", marginBottom: 15, flexWrap: "wrap" }}>
                <View style={{ width: "10%" }}>
                    <ThemedCheckBox checked={isSelected}/>
                </View>
                <ThemedText style={{ width: "70%", fontSize: 15, paddingLeft: 15 }}>{props?.firstName}</ThemedText>
                <ThemedText style={{ width: "20%", fontSize: 15, paddingLeft: 15 }}>{props?.amount}</ThemedText>
            </ShadowBox>
        </TouchableOpacity>
    )
}


const PaymentUpdates = (props: { clubFeePaymentId: number | undefined; firstName?: string | null | undefined; paid: boolean | undefined; }) => {
    return (
        <ShadowBox style={{ ...appStyles.shadowBox, width: "80%", marginBottom: 15, flexWrap: "wrap" }}>
            <ThemedText numberOfLines={1} style={{ width: "80%", fontSize: 15, paddingLeft: 5, textAlign: "left" }}>{props?.firstName}</ThemedText>
            {props?.paid ?
                <MaterialCommunityIcons style={{ width: "20%", fontSize: 15, textAlign: "right" }} name='checkbox-marked' /> :
                <MaterialCommunityIcons style={{ width: "20%", fontSize: 15, textAlign: "right" }} name='checkbox-blank-outline' />}
        </ShadowBox>
    )
}