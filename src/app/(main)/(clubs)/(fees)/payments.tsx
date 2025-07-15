import { View, FlatList, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'expo-router/build/hooks';
import { deleteFeeCollection, getFeePayments, saveFeePayments } from '@/src/helpers/fee_helper';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { appStyles } from '@/src/utils/styles';
import ThemedButton from '@/src/components/ThemedButton';
import Modal from 'react-native-modal';
import { UserContext } from '@/src/context/UserContext';
import { router } from 'expo-router';
import { ClubContext } from '@/src/context/ClubContext';
import ThemedView from '@/src/components/themed-components/ThemedView';
import ThemedText from '@/src/components/themed-components/ThemedText';
import ShadowBox from '@/src/components/ShadowBox';
import ThemedCheckBox from '@/src/components/themed-components/ThemedCheckBox';
import { useTheme } from '@/src/hooks/use-theme';
import ThemedIcon from '@/src/components/themed-components/ThemedIcon';
import Spacer from '@/src/components/Spacer';
import { ROLE_ADMIN } from '@/src/utils/constants';
import Alert, { AlertProps } from '@/src/components/Alert';
import ThemedHeading from '@/src/components/themed-components/ThemedHeading';
import CircularProgress from '@/src/components/charts/CircularProgress';

const Payments = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false)
    const [alertConfig, setAlertConfig] = useState<AlertProps>();
    const [feeByMembers, setFeeByMembers] = useState<any | undefined>(undefined);
    const [paymentStatusUpdates, setPaymentStatusUpdates] = useState<{
        clubFeePaymentId: number;
        paid: boolean;
        firstName?: string;
        paymentDate?: Date
    }[]>([])
    const { userInfo } = useContext(UserContext)
    const { clubInfo } = useContext(ClubContext)
    const { colors } = useTheme()

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
            .catch(error => setAlertConfig({
                visible: true, title: 'Error', message: error.response.data.error,
                buttons: [{ text: 'OK', onPress: () => setAlertConfig({ visible: false }) }]
            }))
            .finally(() => setIsLoading(false));
    }

    const deleteCollection = () => {
        setAlertConfig({
            visible: true,
            title: 'Are you sure!',
            message: 'This will delete the transcations of this collecton. This cannot be recovered.',
            buttons: [{
                text: 'OK', onPress: () => {
                    setAlertConfig({ visible: false });
                    setIsLoading(true);
                    deleteFeeCollection(params.get("clubFeeCollectionId"), userInfo.email)
                        .then(() => router.back())
                        .catch(error => alert(error.response.data.error))
                        .finally(() => setIsLoading(false));
                }
            }, { text: 'Cancel', onPress: () => setAlertConfig({ visible: false }) }]
        });
    }
    return (
        <ThemedView style={{ flex: 1 }}>
            <GestureHandlerRootView>
                <View style={{
                    flexDirection: "row", alignItems: "center", width: "90%",
                    justifyContent: "space-between", alignSelf: "center",
                }}>
                    <ThemedHeading style={{ width: 200 }}>{params.get("clubFeeTypePeriod")}</ThemedHeading>
                    <ThemedText style={{ textAlign: "right" }}>Rs. {params.get("total")}</ThemedText>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", width: "85%", alignSelf: "center" }}>
                    <CircularProgress value={Math.round(Number(params.get("collected")) / Number(params.get("total")) * 100)} strokeWidth={6} size={35} />
                    <Spacer hspace={4} />
                    <ThemedText style={{ fontSize: 10 }}>Select the member to update payment status</ThemedText>
                </View>
                <Spacer space={5} />
                <View style={{ flex: 1 }}>
                    {isLoading && <LoadingSpinner />}
                    {!isLoading &&
                        <FlatList style={{ width: "100%" }}
                            data={feeByMembers}
                            initialNumToRender={8}
                            ListFooterComponent={() => <Spacer space={40} />}
                            ItemSeparatorComponent={() => <Spacer space={4} />}
                            renderItem={({ item }) => (
                                <MemberFeeItem {...item} key={item.clubFeePaymentId} feeByMembers={feeByMembers} setPaymentStatusUpdates={setPaymentStatusUpdates} />
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
                {clubInfo.role === ROLE_ADMIN && <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-around", alignItems: "center", position: "absolute", bottom: 30 }}>
                    <ThemedButton title='Update Payment Status' onPress={() => updatePaymentStatus()} />
                    <ThemedIcon name='MaterialCommunityIcons:delete' size={30} onPress={() => deleteCollection()} color={colors.error} />
                </View>}
                {alertConfig?.visible && <Alert {...alertConfig} />}
            </GestureHandlerRootView>
        </ThemedView>
    )
}

export default Payments

const MemberFeeItem = (props: {
    clubFeePaymentId: number; firstName: string | undefined; lastName: string | undefined;
    paid: number; amount: number; setPaymentStatusUpdates: any;
    feeByMembers: any | undefined
}) => {
    const [isSelected, setIsSelected] = useState(props?.paid != 0)

    const selectItem = () => {
        setIsSelected(prev => !prev)

        props.setPaymentStatusUpdates((prev: ({ clubFeePaymentId: number; paid: Boolean; firstName?: string | undefined; lastName?: string | undefined; amount: number; paymentDate: Date })[]) => {

            let item = prev.find(item => item.clubFeePaymentId == props.clubFeePaymentId)
            const initialPaymentStatus = props.feeByMembers?.find((item: { clubFeePaymentId: number; }) => item.clubFeePaymentId == props.clubFeePaymentId)
            if (item) {
                item.paid = !isSelected
            } else {
                item = { clubFeePaymentId: props.clubFeePaymentId, paid: !isSelected, firstName: props.firstName, lastName: props.lastName, amount: props.amount, paymentDate: new Date() }
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
            <ShadowBox style={{ ...appStyles.shadowBox, width: "85%", flexWrap: "wrap" }}>
                <ThemedText style={{ width: "70%", fontSize: 15, paddingLeft: 15 }}>{props?.firstName} {props?.lastName}</ThemedText>
                <ThemedText style={{ width: "20%", fontSize: 15, paddingLeft: 15 }}>{props?.amount}</ThemedText>
                <View style={{ width: "10%" }}>
                    <ThemedCheckBox checked={isSelected} />
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