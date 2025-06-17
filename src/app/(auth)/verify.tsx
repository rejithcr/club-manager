import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import InputText from '@/src/components/InputText'
import ThemedButton from '@/src/components/ThemedButton'
import ThemedView from '@/src/components/themed-components/ThemedView'
import { useSearchParams } from 'expo-router/build/hooks'
import ThemedText from '@/src/components/themed-components/ThemedText'
import { Member, verifyMemberAndUpdate } from '@/src/helpers/member_helper'
import Alert, { AlertProps } from '@/src/components/Alert'
import { isValidPhoneNumber } from '@/src/utils/validators'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import Spacer from '@/src/components/Spacer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import DatePicker from '@/src/components/DatePicker'

const Register = () => {
    const [memberInfo, setMemberInfo] = useState<Member | null>(null)
    const [memberSaving, setMemberSaving] = useState(false)
    const [alertConfig, setAlertConfig] = useState<AlertProps>();
    const params = useSearchParams()

    useEffect(() => {
        const memberInfoFromParams = JSON.parse(params.get('memberInfo') || '');
        memberInfoFromParams.dateOfBirth || (memberInfoFromParams.dateOfBirth = new Date());
        setMemberInfo(memberInfoFromParams)
    }, [])

    const handleVerify = () => {
        setMemberSaving(true)
        if (validate()) {
            verifyMemberAndUpdate(memberInfo)
                .then(() => setAlertConfig({
                    visible: true, title: 'Success', message: "Verified",
                    buttons: [{ text: 'OK', onPress: () => { setAlertConfig({ visible: false }); router.replace('/(auth)') } }]
                }))
                .catch(error => setAlertConfig({
                    visible: true, title: 'Error', message: error?.response?.data?.error || "Error fetching member details",
                    buttons: [{ text: 'OK', onPress: () => setAlertConfig({ visible: false }) }]
                }))
                .finally(() => setMemberSaving(false));
        } else {
            setMemberSaving(false)
        }
    }
    const handleCancel = () => {
        AsyncStorage.removeItem("userInfo")
            .then(() => router.dismissTo("/(auth)"));
    }

    const validate = () => {
        if (!isValidPhoneNumber(memberInfo?.phone?.toString())) {
            alert("Invalid Phone number")
            return false
        }
        if (!memberInfo?.firstName || (memberInfo?.firstName && memberInfo?.firstName?.length < 2)) {
            alert("Please enter name with atleast 2 characters")
            return false
        }
        if (!memberInfo?.lastName || (memberInfo?.lastName && memberInfo?.lastName?.length < 1)) {
            alert("Please enter last name")
            return false
        }
        return true
    }

    const handleFirstNameChange = (text: string) => {
        setMemberInfo(prev => prev ? { ...prev, firstName: text } : null);
    }
    const handleLastNameChange = (text: string) => {
        setMemberInfo(prev => prev ? { ...prev, lastName: text } : null);
    }
    const handlePhoneChange = (text: string) => {
        setMemberInfo(prev => prev && Number(text) ? { ...prev, phone: Number(text) } : null);
    }
    const setDateOfBirth = (date: Date) => {
        setMemberInfo(prev => prev ? { ...prev, dateOfBirth: date } : null);
    }
    return (
        <ThemedView style={{ flex: 1 }}>
            {memberSaving && <LoadingSpinner />}
            {!memberSaving && <>
                <ThemedText style={{ width: "80%", alignSelf: "center", marginVertical: 20 }}>Your email has been arleadey added by a club admin. Please verify and update(if required) the information</ThemedText>
                <InputText placeholder='First Name' defaultValue={memberInfo?.firstName} onChangeText={handleFirstNameChange} />
                <InputText placeholder='Last Name' defaultValue={memberInfo?.lastName} onChangeText={handleLastNameChange} />
                <InputText placeholder='Phone' defaultValue={memberInfo?.phone} onChangeText={handlePhoneChange} />
                <InputText placeholder='Email' defaultValue={memberInfo?.email} editable={false} />
                <DatePicker label={"Date of Birth"} date={memberInfo?.dateOfBirth ? new Date(memberInfo?.dateOfBirth) : new Date()} setDate={setDateOfBirth} />
                <View style={{ marginTop: 25 }} />
                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                    <ThemedButton title="Verify" onPress={handleVerify} />
                    <Spacer space={10} />
                    <ThemedButton title="Cancel" onPress={handleCancel} />
                </View>
            </>}
            {alertConfig?.visible && <Alert {...alertConfig} />}
        </ThemedView>
    )
}

export default Register