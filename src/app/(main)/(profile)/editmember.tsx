import { View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import InputText from '@/src/components/InputText'
import Spacer from '@/src/components/Spacer'
import ThemedButton from '@/src/components/ThemedButton'
import { Member, getMemberDetails, regirsterMember, saveMemberDetails } from '@/src/helpers/member_helper'
import { useSearchParams } from 'expo-router/build/hooks'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import ThemedView from '@/src/components/themed-components/ThemedView'
import { router } from 'expo-router'
import ThemedText from '@/src/components/themed-components/ThemedText'
import { useTheme } from '@/src/hooks/use-theme'
import { isValidPhoneNumber } from '@/src/utils/validators'
import Alert, { AlertProps } from '@/src/components/Alert'
import { AuthContext } from '@/src/context/AuthContext'

const Editmember = () => {
    const params = useSearchParams()
    const [isMemberLoading, setIsMemberLoading] = useState(false)
    const [firstName, setFirstName] = useState<string|undefined>();
    const [lastName, setLastName] = useState<string|undefined>();
    const [updatedBy, setUpdatedBy] = useState<string|undefined>();
    const [phone, setPhone] = useState<number|undefined>();    
    const [email, setEmail] = useState<string|undefined>();
    const [alertConfig, setAlertConfig] = useState<AlertProps>();
    const {colors} = useTheme();
    
    const setDetails = (memberDetails: Member) => {
        setFirstName(memberDetails?.firstName)
        setLastName(memberDetails?.lastName)
        setPhone(memberDetails?.phone)
        setEmail(memberDetails?.email)
        setUpdatedBy(memberDetails?.updatedBy)
    }
    useEffect(() => {
        setIsMemberLoading(true);
        getMemberDetails(Number(params.get("memberId")))
            .then(response => { console.log(response.data); setDetails(response.data) })
            .catch(error => alert(error?.response?.data?.error || "Error fetching member details"))
            .finally(() => setIsMemberLoading(false));
    }, [])

    const handleSave = () => {
        setIsMemberLoading(true)
        if(validate()){
         saveMemberDetails(Number(params.get("memberId")), firstName, lastName, phone, email, email)
            .then(response => setAlertConfig({
                    visible: true, title: 'Success', message: response.data.message,
                    buttons: [{ text: 'OK', onPress: () => setAlertConfig({ visible: false }) }]
                }))
            .catch(error => setAlertConfig({
                    visible: true, title: 'Error', message: error?.response?.data?.error || "Error fetching member details",
                    buttons: [{ text: 'OK', onPress: () => setAlertConfig({ visible: false }) }]
                }))
            .finally(() => setIsMemberLoading(false));
        } else {
            setIsMemberLoading(false)
        }
    }

    const validate = () => {
        console.log(phone)
        if (!isValidPhoneNumber(phone?.toString())) {
            alert("Invalid Phone number")
            return false
        }
        if (!firstName || (firstName && firstName?.length < 2)) {
            alert("Please enter name with atleast 2 characters")
            return false
        }
        if (!lastName || (lastName && lastName?.length < 1)) {
            alert("Please enter last name")
            return false
        }
        return true
    }

    return (
        <ThemedView style={{ flex: 1 }}>
            {isMemberLoading && <LoadingSpinner />}
            {!isMemberLoading &&
                <View>
                    <InputText label="First Name" onChangeText={setFirstName} defaultValue={firstName} />
                    <InputText label="Last Name" onChangeText={setLastName} defaultValue={lastName} />
                    <InputText label="Phone" onChangeText={setPhone} defaultValue={phone} keyboardType={"numeric"} />
                    <InputText label="Email" defaultValue={email} keyboardType={"email-address"} editable={false} />
                    { updatedBy !== email &&
                    <ThemedText style={{alignSelf:"center", color:colors.warning}}>Last updated by: {updatedBy} </ThemedText> }
                    <Spacer space={10} />
                    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        <ThemedButton title="Save" onPress={handleSave} />
                        <Spacer space={10} />
                        <ThemedButton title="Cancel" onPress={() => router.dismissTo('/(main)/(profile)')} />
                    </View>
                </View>}
            {alertConfig?.visible && <Alert {...alertConfig} />}
        </ThemedView>
    )
}

export default Editmember

