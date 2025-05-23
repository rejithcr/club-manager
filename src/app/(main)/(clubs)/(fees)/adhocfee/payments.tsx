import { View, FlatList, TouchableOpacity, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'expo-router/build/hooks';
import { deleteAdhocFeeCollection, getAdhocFeePayments, saveAdhocFeePayments } from '@/src/helpers/fee_helper';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { appStyles, colors } from '@/src/utils/styles';
import ThemedButton from '@/src/components/ThemedButton';
import Modal from 'react-native-modal';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '@/src/context/AuthContext';
import { router } from 'expo-router';
import { ClubContext } from '@/src/context/ClubContext';
import ShadowBox from '@/src/components/ShadowBox';
import ThemedView from '@/src/components/themed-components/ThemedView';
import ThemedText from '@/src/components/themed-components/ThemedText';
import { useTheme } from '@/src/hooks/use-theme';
import ThemedIcon from '@/src/components/themed-components/ThemedIcon';
import Spacer from '@/src/components/Spacer';
import ThemedCheckBox from '@/src/components/themed-components/ThemedCheckBox';
import { ROLE_ADMIN } from '@/src/utils/constants';

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
    const { colors } = useTheme()

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
                            .then((response) => { Alert.alert("Success", response.data.message); router.dismissTo('/(main)/(clubs)/(fees)/adhocfee') })
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
        <ThemedView style={{ flex: 1 }}>
        <GestureHandlerRootView>
            <Spacer space={5} />
            <View style={{
                flexDirection: "row", padding:10, width: "80%",
                justifyContent: "space-between", alignSelf: "center"
            }}>
                <View>
                    <ThemedText style={{ fontSize: 18, fontWeight: "bold" }}>{feeObj?.clubAdhocFeeName}</ThemedText>
                    <ThemedText style={{ fontSize: 10, marginTop: 5 }}>{feeObj?.clubAdhocFeeDesc}</ThemedText>
                </View>
                <ThemedText style={{ marginRight: 10 }}>Rs. {feeObj?.clubAdhocFeePaymentAmount}</ThemedText>
            </View>
            <View style={{ flexDirection: "row",  alignItems: "center", width: "80%", alignSelf: "center" }}>
                <ThemedIcon name='MaterialIcons:warning' size={25} color={colors.warning}/>
                <ThemedText style={{marginLeft:10, fontSize: 20}}>Status</ThemedText>                
            </View>
            <ThemedText style={{width: "80%", alignSelf: "center", fontSize: 10}}>Select the member to update payment status</ThemedText>
            <Spacer space={5} />
            <View style={{ height: "70%" }}>
                {isLoading && <LoadingSpinner />}
                {!isLoading &&
                    <FlatList style={{ width: "100%" }}
                        data={feeByMembers}
                        ListFooterComponent={() => <View style={{ height: 50 }} />}
                        initialNumToRender={8}
                        renderItem={({ item }) => (
                            <MemberFeeItem {...item} key={item.clubAdhocFeePaymentId} feeByMembers={feeByMembers} setPaymentStatusUpdates={setPaymentStatusUpdates} />
                        )}
                    />}
            </View>
            <Modal isVisible={isConfirmVisible}>
                <ScrollView>
                    <ThemedView style={{ borderRadius: 5, paddingBottom: 20 }}>
                        <ThemedText style={appStyles.heading}>Confirm Updates</ThemedText>
                        {paymentStatusUpdates.map((item) => {
                            return <PaymentUpdates key={item.clubFeePaymentId} {...item} />
                        })}
                        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                            <ThemedButton title="Update" onPress={() => savePaymentUpdates()} />
                            <ThemedButton title="Cancel" onPress={() => setIsConfirmVisible(false)} />
                        </View>
                    </ThemedView>
                </ScrollView>
            </Modal>
            {clubInfo.role === ROLE_ADMIN && <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-around", alignItems: "center", position: "absolute", bottom: 30}}>
                <ThemedButton title='Update Payment Status' onPress={() => updatePaymentStatus()} />
                <MaterialCommunityIcons name='delete' size={30} onPress={() => deleteCollection()} color={colors.error}/>
            </View>}
        </GestureHandlerRootView>
        </ThemedView>
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
            <ShadowBox style={{ ...appStyles.shadowBox, width: "80%", marginBottom: 5 }}>                
                <ThemedText style={{ width: "70%", fontSize: 15 }}>{props?.firstName}</ThemedText>
                <ThemedText style={{ width: "20%", fontSize: 15, paddingLeft: 15 }}>{props?.clubAdhocFeePaymentAmount}</ThemedText>
                <View style={{ width: "10%", flexDirection: "row", justifyContent:"center" }}>
                    <ThemedCheckBox checked={isSelected}/>
                </View>
            </ShadowBox>
        </TouchableOpacity>
    )
}


const PaymentUpdates = (props: { clubFeePaymentId: number | undefined; firstName?: string | null | undefined; paid: boolean | undefined; }) => {
    return (
        <ShadowBox style={{ ...appStyles.shadowBox, width: "80%", marginBottom: 15, flexWrap: "wrap" }}>
            <ThemedText numberOfLines={1} style={{ width: "80%", fontSize: 15, paddingLeft: 5, textAlign: "left" }}>{props?.firstName}</ThemedText>
            <ThemedCheckBox checked={props?.paid} /> 
        </ShadowBox>
    )
}