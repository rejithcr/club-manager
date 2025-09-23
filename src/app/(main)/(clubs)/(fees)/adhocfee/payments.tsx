import { View, FlatList, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import { useSearchParams } from 'expo-router/build/hooks';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { appStyles, colors } from '@/src/utils/styles';
import ThemedButton from '@/src/components/ThemedButton';
import Modal from 'react-native-modal';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UserContext } from '@/src/context/UserContext';
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
import Alert, { AlertProps } from '@/src/components/Alert';
import CircularProgress from '@/src/components/charts/CircularProgress';
import InputText from '@/src/components/InputText';
import DatePicker from '@/src/components/DatePicker';
import { useDeleteFeesAdhocMutation, useGetFeesAdhocQuery, useSaveFeesAdhocMutation } from '@/src/services/feeApi';
import RoundedContainer from '@/src/components/RoundedContainer';

const Payments = () => {
    const [isConfirmVisible, setIsConfirmVisible] = useState(false)
    const [paymentStatusUpdates, setpaymentStatusUpdates] = useState<{
        clubFeePaymentId: number;
        paid: boolean;
        firstName?: string;
        paymentDate: Date
    }[]>([])
    const [alertConfig, setAlertConfig] = useState<AlertProps>();
    const { userInfo } = useContext(UserContext)
    const { clubInfo } = useContext(ClubContext)
    const { colors } = useTheme()

    const params = useSearchParams()
    const feeObj = JSON.parse(params.get('adhocFee') || "")

    const { data, isLoading } = useGetFeesAdhocQuery({ adhocFeeId: feeObj?.clubAdhocFeeId });

    const updatePaymentStatus = () => {
        if (paymentStatusUpdates.length == 0) {
            alert("No updates selected")
        } else {
            setIsConfirmVisible(true)
        }
    }

    const [saveAdhocFee, { isLoading: isSaving }] = useSaveFeesAdhocMutation();

    const savePaymentUpdates = async () => {
      try {
        setIsConfirmVisible(false);
        await saveAdhocFee({
          paymentStatusUpdates,
          clubId: clubInfo.clubId,
          updatePaymentStatus: "true",
          email: userInfo.email,
        }).unwrap();
        router.back();
      } catch (error) {
        console.log("Error", error);
      } 
    };

    const [deleteAdhocFeeCollection, {isLoading: isDeleting}] = useDeleteFeesAdhocMutation();

    const deleteCollection = () => {
        setAlertConfig({
            visible: true,
            title: 'Are you sure!',
            message: 'This will delete the transcations of this collecton. This cannot be recovered.',
            buttons: [{
                text: 'OK', onPress: () => {
                    setAlertConfig({ visible: false });
                    try {
                        deleteAdhocFeeCollection({ clubAdhocFeeId: feeObj?.clubAdhocFeeId, email: userInfo.email }).unwrap();
                        router.dismissTo('/(main)/(clubs)/(fees)/adhocfee');
                    } catch (error) {
                        console.log("Error", error);
                    }
                }
            }, { text: 'Cancel', onPress: () => setAlertConfig({ visible: false }) }]
        });
    }
    const getIsLoading = () => isLoading || isSaving || isDeleting;

    const [isEditVisible, setIsEditVisible] = useState(false)
    const [feeName, setFeeName] = useState(feeObj?.clubAdhocFeeName)
    const [feeDescription, setFeeDescription] = useState(feeObj?.clubAdhocFeeDesc)
    const [feeDate, setFeeDate] = useState(new Date(feeObj?.clubAdhocFeeDate))

    const handleEdit = async () => {
      try {
        setIsEditVisible(false);
        await saveAdhocFee({
          clubAdhocFeeId: feeObj?.clubAdhocFeeId,
          updateFee: "true",
          adhocFeeName: feeName,
          adhocFeeDesc: feeDescription,
          adhocFeeDate: feeDate,
          email: userInfo.email,
        }).unwrap();
      } catch (error) {
        console.log("Error", error);
      }
    };

    return (
        <ThemedView style={{ flex: 1 }}>
            <GestureHandlerRootView>
                <Spacer space={5} />
                <View style={{
                    flexDirection: "row", width: "85%", alignItems: "center",
                    justifyContent: "space-between", alignSelf: "center"
                }}>
                    <View>
                        <TouchableOpacity style={{ flexDirection: "row"}} onPress={() => setIsEditVisible(true)}>
                            <ThemedText style={{ fontSize: 18, fontWeight: "bold" }}>{feeName}</ThemedText>
                            <Spacer hspace={2} />
                            <ThemedIcon name='MaterialCommunityIcons:square-edit-outline' size={12}/>                   
                        </TouchableOpacity>    
                        <ThemedText style={{ fontSize: 10, marginTop: 5 }}>{feeDescription}</ThemedText>
                    </View>
                    <View>
                        <ThemedText style={{ textAlign: "right" }}>Rs. {feeObj?.clubAdhocFeePaymentAmount}</ThemedText>
                        <ThemedText style={{ fontSize: 10, marginTop: 5 }}>{feeDate.toDateString()}</ThemedText>
                    </View>
                </View>
                <Spacer space={5} />
                <View style={{ flexDirection: "row", alignItems: "center", width: "85%", alignSelf: "center" }}>
                    <CircularProgress value={Math.round(feeObj?.completionPercentage)} strokeWidth={8} size={50} />
                    <Spacer hspace={4} />
                    <ThemedText style={{ fontSize: 10 }}>Select the member to update payment status</ThemedText>
                </View>
                <Spacer space={5} />
                <View style={{ height: "90%" }}>
                    {getIsLoading() && <LoadingSpinner />}
                    {!getIsLoading() &&
                        <FlatList style={{ width: "100%" }}
                            data={data?.memberAdhocFees}
                            ListFooterComponent={() => <Spacer space={60} />}
                            ItemSeparatorComponent={() => <Spacer space={4} />}
                            initialNumToRender={8}
                            renderItem={({ item }) => (
                                <MemberFeeItem {...item} key={item.clubAdhocFeePaymentId} feeByMembers={data?.memberAdhocFees} setpaymentStatusUpdates={setpaymentStatusUpdates} />
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
                <Modal isVisible={isEditVisible}>
                    <ThemedView style={{ borderRadius: 5, paddingBottom: 20 }}>
                        <ThemedText style={appStyles.heading}>Update Split Details</ThemedText>
                        <InputText
                            onChangeText={(text: string) => setFeeName(text)}
                            label={`Fee Name`}
                            defaultValue={feeName}
                        />
                        <InputText
                            onChangeText={(text: string) => setFeeDescription(text)}
                            label={`Description`}
                            defaultValue={feeDescription}
                        />
                        <DatePicker date={feeDate} setDate={setFeeDate} label='Date'/>
                        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                            <ThemedButton title="Update" onPress={() => handleEdit()} />
                            <ThemedButton title="Cancel" onPress={() => setIsEditVisible(false)} />
                        </View>
                    </ThemedView>
                </Modal>
                {clubInfo.role === ROLE_ADMIN && <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-around", alignItems: "center", position: "absolute", bottom: 40 }}>
                    <ThemedButton title='Update Payment Status' onPress={() => updatePaymentStatus()} />
                    <MaterialCommunityIcons name='delete' size={30} onPress={() => deleteCollection()} color={colors.error} />
                </View>}
                {alertConfig?.visible && <Alert {...alertConfig} />}
            </GestureHandlerRootView>
        </ThemedView>
    )
}

export default Payments

const MemberFeeItem = (props: {
    clubAdhocFeePaymentId: number; firstName: string | undefined; lastName: string | undefined; paymentDate: Date
    paid: number; clubAdhocFeePaymentAmount: number; setpaymentStatusUpdates: any;
    feeByMembers: any | undefined
}) => {
    const [isSelected, setIsSelected] = useState(props?.paid != 0)

    const selectItem = () => {
        setIsSelected(prev => !prev)

        props.setpaymentStatusUpdates((prev: ({ clubAdhocFeePaymentId: number; paid: Boolean; firstName?: string | undefined; lastName: string | undefined; clubAdhocFeePaymentAmount: number; paymentDate: Date })[]) => {

            let item = prev.find(item => item.clubAdhocFeePaymentId == props.clubAdhocFeePaymentId)
            const initialPaymentStatus = props.feeByMembers?.find((item: { clubAdhocFeePaymentId: number; }) => item.clubAdhocFeePaymentId == props.clubAdhocFeePaymentId)
            if (item) {
                item.paid = !isSelected
            } else {
                item = { clubAdhocFeePaymentId: props.clubAdhocFeePaymentId, paid: !isSelected, firstName: props.firstName, lastName: props.lastName, clubAdhocFeePaymentAmount: props.clubAdhocFeePaymentAmount, paymentDate: new Date() }
                prev.push(item)
            }
            if (initialPaymentStatus?.paid == !isSelected) {
                return prev.filter(item => item.clubAdhocFeePaymentId != initialPaymentStatus.clubAdhocFeePaymentId)
            }
            return prev
        })
    }

    return (
        <RoundedContainer>
        <TouchableOpacity onPress={selectItem}>
            <ShadowBox style={{ justifyContent:"space-between" }}>
                <ThemedText style={{ fontSize: 15 }}>{props?.firstName} {props?.lastName}</ThemedText>                
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <ThemedText style={{ fontSize: 15, paddingLeft: 15 }}>{props?.clubAdhocFeePaymentAmount}</ThemedText>
                    <Spacer hspace={3}/>
                    <ThemedCheckBox checked={isSelected} />
                </View>
            </ShadowBox>
        </TouchableOpacity>
        </RoundedContainer>
    )
}


const PaymentUpdates = (props: { clubFeePaymentId: number | undefined; firstName?: string | null | undefined; lastName?: string | null | undefined; paid: boolean | undefined; }) => {
    return (
         <ShadowBox style={{ ...appStyles.shadowBox, width: "85%", marginBottom: 15, flexWrap: "wrap", justifyContent: "space-between" }}>
            <ThemedText numberOfLines={1} style={{ fontSize: 15, paddingLeft: 5, textAlign: "left" }}>{props?.firstName} {props?.lastName}</ThemedText>
            <ThemedCheckBox checked={props?.paid} />
        </ShadowBox>
    )
}