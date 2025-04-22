import InputText from '@/src/components/InputText'
import ThemedButton from '@/src/components/ThemedButton'
import { useContext, useEffect, useState } from 'react'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { StyleSheet, View } from 'react-native';
import DatePicker from '@/src/components/DatePicker';
import { addMember, getMemberByPhone, Member } from '@/src/helpers/member_helper';
import MemberItem from '@/src/components/MemberItem';
import { useSearchParams } from 'expo-router/build/hooks';
import { AuthContext } from '@/src/context/AuthContext';
import { router } from 'expo-router';
import { isValidPhoneNumber } from '@/src/utils/validators';

const AddMember = () => {
    const [showExistingPlayer, setShowExistingPlayer] = useState<boolean>(false);
    const [showNewMemberForm, setShowNewMemberForm] = useState<boolean>(false);
    const [showPhoneSearch, setShowPhoneSearch] = useState<boolean>(true);
    const [searchNumber, setSearchNumber] = useState<number>(0);
    const [date, setDate] = useState<Date>(new Date());
    const [memberDetails, setMemberDetails] = useState<Member>()
    const [firstName, setFirstName] = useState<string|null>("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const { userInfo } = useContext(AuthContext)

    const addMemberToClub = () => {
        console.log("add player")
    }

    const validate = () => {
        console.log(phone)
        if (!isValidPhoneNumber(phone)) {
            alert("Invalid Phone number")
            return false
        }
        if (!firstName || (firstName && firstName?.length <2)) {
            alert("Please enter name with atleast 2 characters")
            return false
        }
        if (lastName.length <1) {
            alert("Please enter last name")
            return false
        }
        return true
    }
    const createMember = () => {
        if (validate()){
            const payload = {
                "firstName": firstName,
                "lastName": lastName,
                "email": userInfo.email,
                "phone": phone
            }
            addMember(payload)
            router.replace('/(auth)')
        }
    }

    const params = useSearchParams()

    useEffect(() => {        
        if (params.get("createMember")){
            setShowNewMemberForm(true)
            setShowPhoneSearch(false)
            setFirstName(params.get("name"))
        }  
    })

    const searchMember = () => {
        const member = getMemberByPhone(searchNumber)
        if (member) {
            setShowExistingPlayer(true);
            setShowNewMemberForm(false)
            setMemberDetails(member)
        } else {
            setShowExistingPlayer(false);
            setShowNewMemberForm(true)
        }
    }

    const searchMemberChangeText = (phoneNumber: number) => {
        setSearchNumber(phoneNumber)
    }

    return (
        <GestureHandlerRootView>
            <ScrollView>
                {showPhoneSearch &&
                    <>
                        <InputText placeholder='Enter phone number' onChangeText={searchMemberChangeText} />
                        <ThemedButton title="Search" onPress={searchMember} />
                        <View style={{ marginTop: 25 }} />
                    </>
                }
                {showExistingPlayer && <>
                    <MemberItem firstName={memberDetails?.firstName} dateOfBirth={memberDetails?.dateOfBirth} lastName={memberDetails?.lastName} memberId={0} />
                    <View style={{ marginTop: 25 }} />
                    <ThemedButton title="Add Member" onPress={addMemberToClub} />
                </>}
                {showNewMemberForm && <>
                    <InputText placeholder='First Name' onChangeText={setFirstName} value={params.get("name")}/>
                    <InputText placeholder='Last Name' onChangeText={setLastName}/>
                    <InputText placeholder='Phone Number' onChangeText={setPhone}/>
                    {/* <DatePicker date={date} setDate={setDate} />
                    <InputText placeholder='Jersey Name' />
                    <InputText placeholder='Jersey Number' /> */}
                    <View style={{ marginTop: 25 }} />
                    <ThemedButton title="Add Member" onPress={createMember} />
                </>}
            </ScrollView>
        </GestureHandlerRootView>
    )
}

export default AddMember

const styles = StyleSheet.create({

})