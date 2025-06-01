import { View, Text } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import InputText from '@/src/components/InputText'
import ThemedButton from '@/src/components/ThemedButton'
import { useSearchParams } from 'expo-router/build/hooks'
import { Picker } from '@react-native-picker/picker'
import { AuthContext } from '@/src/context/AuthContext'
import { deleteFee, editFee } from '@/src/helpers/fee_helper'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import { router } from 'expo-router'
import ThemedView from '@/src/components/themed-components/ThemedView'
import ThemedText from '@/src/components/themed-components/ThemedText'
import { isCurrency, isValidLength } from '@/src/utils/validators'
import Alert, { AlertProps } from '@/src/components/Alert'

const EditFeeType = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isEditable, setIsEditable] = useState<boolean>()
    const [clubFeeType, setClubFeeType] = useState<string | null>()
    const [clubFeeAmount, setClubFeeAmount] = useState<string>("")
    const [clubFeeTypeInterval, setClubFeeTypeInterval] = useState<string | null>()
    const [alertConfig, setAlertConfig] = useState<AlertProps>();
    const { userInfo } = useContext(AuthContext)
    const params = useSearchParams()

    useEffect(() => {
        setClubFeeTypeInterval(params.get("clubFeeTypeInterval"))
        setClubFeeType(params.get("clubFeeType"))
        setClubFeeAmount(params.get("clubFeeAmount") || "")
        setIsEditable(params.get("isEditable") == "true" ? true : false)
    }, [])

    const handleSaveFeeType = () => {
        if (validate(clubFeeType, clubFeeAmount)) {
            setIsLoading(true)
            editFee(params.get("clubFeeTypeId"), clubFeeType, clubFeeTypeInterval, clubFeeAmount, userInfo.email)
                .then(() => router.dismissTo('/(main)/(clubs)'))
                .catch(error => setAlertConfig({
                    visible: true, title: 'Error', message: error.response.data.error,
                    buttons: [{ text: 'OK', onPress: () => setAlertConfig({ visible: false }) }]
                }))
                .finally(() => setIsLoading(false))
        }
    }
    const handleDeleteFeeType = () => {
        setAlertConfig({
            visible: true, 
            title: 'Are you sure!', 
            message: 'This will delete the fee type and all its exception types.',
            buttons: [{
                text: 'OK', onPress: () => {
                    setAlertConfig({visible: false}); 
                    setIsLoading(true);
                    deleteFee(params.get("clubFeeTypeId"), userInfo.email)
                        .then((response) => { alert(response.data.message); router.dismissTo(`/(main)/(clubs)`)})
                        .catch((error) => alert(error.response.data.error))
                        .finally(() => setIsLoading(false))
                }
            },{ text: 'Cancel', onPress: () => setAlertConfig({ visible: false }) }]
        });
    }
    return (
        <ThemedView style={{ flex: 1 }}>
            <InputText label='Fee Type' onChangeText={setClubFeeType} defaultValue={params.get("clubFeeType")} />
            {!isEditable && <Text style={{ alignSelf: "center", fontSize: 10, color: "grey", width: "80%" }}>
                Interval not editable as some collections are already using this value. You can create a new fee type with different interval</Text>}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignSelf: "center", alignItems: "center", width: "80%", marginTop: 20 }}>
                <ThemedText style={{ width: "40%" }}>Select Interval</ThemedText>
                <Picker style={{ width: "60%", textAlign: "right" }}
                    selectedValue={params.get("clubFeeTypeInterval")}
                    enabled={isEditable}
                    onValueChange={(itemValue, _itemIndex) => setClubFeeTypeInterval(itemValue)}>
                    <Picker.Item label="MONTHLY" value="MONTHLY" />
                    <Picker.Item label="QUARTERLY" value="QUARTERLY" />
                    <Picker.Item label="YEARLY" value="YEARLY" />
                </Picker>
            </View>
            <InputText label='Amount' keyboardType={"number-pad"} onChangeText={setClubFeeAmount} defaultValue={params.get("clubFeeAmount")?.toString()} />
            {isLoading && <LoadingSpinner />}
            {!isLoading &&
                <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
                    <ThemedButton title='Update Fee' onPress={handleSaveFeeType} />
                    {isEditable && <ThemedButton title='Delete Fee' onPress={handleDeleteFeeType} />}
                </View>}
            {alertConfig?.visible && <Alert {...alertConfig} />}
        </ThemedView>
    )
}

export default EditFeeType

const validate = (feeType: string | null | undefined, feeAmount: string) => {
    if (!isValidLength(feeType, 2)) {
        alert("Enter atleast 2 characters for fee type")
        return false
    }
    if (!isCurrency(feeAmount)) {
        alert("Enter numeric value for amount")
        return false
    }
    return true
}