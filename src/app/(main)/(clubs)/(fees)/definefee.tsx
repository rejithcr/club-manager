import { View } from 'react-native'
import React, { useContext, useState } from 'react'
import InputText from '@/src/components/InputText'
import { Picker } from '@react-native-picker/picker'
import ThemedButton from '@/src/components/ThemedButton'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { addRegularFee } from '@/src/helpers/fee_helper'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import { router } from 'expo-router'
import { isCurrency, isValidLength } from '@/src/utils/validators'
import { AuthContext } from '@/src/context/AuthContext'
import { ClubContext } from '@/src/context/ClubContext'
import ThemedView from '@/src/components/themed-components/ThemedView'
import ThemedText from '@/src/components/themed-components/ThemedText'
import Alert, { AlertProps } from '@/src/components/Alert'

const DefineFee = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [alertConfig, setAlertConfig] = useState<AlertProps>();
    const [feeType, setFeeType] = useState("");
    const [feeTypeInterval, setFeeTypeInterval] = useState("MONTHLY");
    const [feeAmount, setFeeAmount] = useState("");
    const { userInfo } = useContext(AuthContext)
    const { clubInfo } = useContext(ClubContext)

    const handleAddFee = () => {
        if (validate(feeType, feeAmount)) {
            setIsLoading(true)
            addRegularFee(clubInfo.clubId, feeType, feeTypeInterval, feeAmount, userInfo.email)
                .then((response) => {
                    setAlertConfig({visible: true, title: 'Success', message: response.data.message, 
                                    buttons: [{ text: 'OK', onPress: () => setAlertConfig({visible: false}) }]});
                    router.dismissTo(`/(main)/(clubs)`)
                })
                .catch(error => setAlertConfig({visible: true, title: 'Error', message: error.response.data.error, 
                                                buttons: [{ text: 'OK', onPress: () => setAlertConfig({visible: false}) }]}))
                .finally(() => setIsLoading(false))
        }
    }
    return (
        <ThemedView style={{ flex: 1 }}>
        <GestureHandlerRootView>
            <ScrollView>
                {isLoading && <LoadingSpinner />}
                {!isLoading &&
                    <View style={{ alignItems: "center" }}>
                        <InputText
                            onChangeText={(text: string) => setFeeType(text)}
                            label={`Fee Type`}
                            defaultValue={feeType}
                        />
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "80%" }}>
                            <ThemedText style={{ width: "40%" }}>Select Interval</ThemedText>
                            <Picker style={{ width: "60%", textAlign: "right" }}
                                selectedValue={feeTypeInterval}
                                onValueChange={(itemValue, _itemIndex) => setFeeTypeInterval(itemValue)}>
                                <Picker.Item label="MONTHLY" value="MONTHLY" />
                                <Picker.Item label="QUARTERLY" value="QUARTERLY" />
                                <Picker.Item label="YEARLY" value="YEARLY" />
                            </Picker>
                        </View>
                        <InputText
                            onChangeText={(text: string) => setFeeAmount(text)}
                            label={`Fee Amount`}
                            keyboardType={'numeric'}
                            defaultValue={feeAmount}
                        />
                        <View style={{ marginBottom: 40 }} />
                        <ThemedButton title='Add Fee' onPress={handleAddFee} />
                    </View>
                }
            </ScrollView>            
            {alertConfig?.visible && <Alert {...alertConfig}/>}
        </GestureHandlerRootView>
        </ThemedView>
    )
}

export default DefineFee

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