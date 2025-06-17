import { View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import InputText from '@/src/components/InputText'
import Spacer from '@/src/components/Spacer'
import ThemedButton from '@/src/components/ThemedButton'
import { Member } from '@/src/helpers/member_helper'
import { useSearchParams } from 'expo-router/build/hooks'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import ThemedView from '@/src/components/themed-components/ThemedView'
import { router } from 'expo-router'
import ThemedText from '@/src/components/themed-components/ThemedText'
import { useTheme } from '@/src/hooks/use-theme'
import { isValidEmail, isValidPhoneNumber } from '@/src/utils/validators'
import { AuthContext } from '@/src/context/AuthContext'
import { ClubContext } from '@/src/context/ClubContext'
import { getClubMember, saveClubMember } from '@/src/helpers/club_helper'
import { ROLE_ADMIN } from '@/src/utils/constants'
import { Picker } from '@react-native-picker/picker'
import EditClubLevelAttributes from './editclublevelattributes'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { appStyles } from '@/src/utils/styles'
import DatePicker from '@/src/components/DatePicker'

const Editmember = () => {
    const params = useSearchParams()
    const [isMemberLoading, setIsMemberLoading] = useState(false)
    const [firstName, setFirstName] = useState<string | undefined>();
    const [lastName, setLastName] = useState<string | undefined>();
    const [updatedBy, setUpdatedBy] = useState<string | undefined>();
    const [phone, setPhone] = useState<number | undefined>();
    const [email, setEmail] = useState<string | undefined>();
    const [role, setRole] = useState<string | undefined>();
    const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>();
    const [isRegistered, setIsRegistered] = useState<number | undefined>();
    const { colors } = useTheme();
    const { userInfo } = useContext(AuthContext)
    const { clubInfo } = useContext(ClubContext)

    const setDetails = (memberDetails: Member) => {
        setFirstName(memberDetails?.firstName)
        setLastName(memberDetails?.lastName)
        setPhone(memberDetails?.phone)
        setEmail(memberDetails?.email)
        setRole(memberDetails?.role)
        setIsRegistered(memberDetails?.isRegistered)
        setUpdatedBy(memberDetails?.updatedBy)
    }
    
    useEffect(() => {
        setIsMemberLoading(true);
        getClubMember(clubInfo.clubId, Number(params.get("memberId")))
            .then(response => { console.log(response.data); setDetails(response.data) })
            .catch(error => alert(error?.response?.data?.error || "Error fetching member details"))
            .finally(() => setIsMemberLoading(false));
    }, [])

    const handleSave = () => {
        setIsMemberLoading(true)
        if (validate()) {
            saveClubMember(clubInfo.clubId, Number(params.get("memberId")), firstName, lastName, phone, email, role, dateOfBirth, userInfo.email)
                .then(response => {alert(response.data.message); router.back()})
                .catch(error => alert(error?.response?.data?.error || "Error fetching member details"))
                .finally(() => setIsMemberLoading(false));
        } else {
            setIsMemberLoading(false)
        }
    }

    const validate = () => {
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
        if (!isValidEmail(email)) {
            alert("Please enter valid email")
            return false
        }
        return true
    }

    return (
        <ThemedView style={{ flex: 1 }}>
            <GestureHandlerRootView>
            <ScrollView>
            {isMemberLoading && <LoadingSpinner />}
            {!isMemberLoading && 
                <View>                    
                    {isRegistered === 0 ? <>
                    <InputText label="First Name" onChangeText={setFirstName} defaultValue={firstName}/>
                    <InputText label="Last Name" onChangeText={setLastName} defaultValue={lastName} />
                    <InputText label="Phone" onChangeText={setPhone} defaultValue={phone} keyboardType={"numeric"} />
                    <InputText label="Email" onChangeText={setEmail} defaultValue={email} keyboardType={"email-address"} />
                    <DatePicker label={"Date of Birth"} date={dateOfBirth ? new Date(dateOfBirth) : new Date()} setDate={setDateOfBirth} />
                    </> : <ThemedText style={{ width: "80%", alignSelf: "center", marginVertical: 20 }}>
                        Registered member's personal information is not editable. Please contact the member to update
                        </ThemedText>}
                    <Spacer space={4} />
                    <ThemedText style={{ width: "80%", alignSelf:"center", fontSize:10 }}>Role</ThemedText>
                    <Spacer space={5} />
                    <Picker style={{ width: "80%", textAlign: "center", alignSelf:"center" }}
                        selectedValue={role}
                        enabled={userInfo.role !== ROLE_ADMIN}
                        onValueChange={(itemValue, _itemIndex) => setRole(itemValue)}>
                        <Picker.Item label="ADMIN" value="ADMIN" />
                        <Picker.Item label="MEMBER" value="MEMBER" />
                    </Picker>
                    {updatedBy !== userInfo.email &&
                        <ThemedText style={{ alignSelf: "center", color: colors.warning }}>Last updated by: {updatedBy} </ThemedText>}
                    <Spacer space={15} />
                    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        <ThemedButton title="   Save   " onPress={handleSave} />
                        <Spacer space={10} />
                        <ThemedButton title="Cancel" onPress={() => router.back()} />
                    </View>
                </View>}
                <Spacer space={20} />
                <ThemedText style={appStyles.heading}>Club level attributes</ThemedText>
                <EditClubLevelAttributes/>
                <Spacer space={20} />
                </ScrollView>
                </GestureHandlerRootView>
        </ThemedView>
    )
}

export default Editmember

