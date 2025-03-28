import InputText from '@/src/components/InputText'
import ThemedButton from '@/src/components/ThemedButton'
import { useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StyleSheet, View } from 'react-native';
import DatePicker from '@/src/components/DatePicker';
import { getMemberByPhone, Member } from '@/src/helpers/member_helper';
import MemberItem from '@/src/components/MemberItem';

const AddMember = () => {
    const [showExistingPlayer, setShowExistingPlayer] = useState<boolean>(false);
    const [showNewMemberForm, setShowNewMemberForm] = useState<boolean>(false);
    const [searchNumber, setSearchNumber] = useState<number>(0);
    const [date, setDate] = useState<Date>(new Date());
    const [memberDetails, setMemberDetails] = useState<Member>()
  
    const addMember = () => {
        console.log("add player")
    }

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
            <InputText placeholder='Enter phone number' onChangeText={searchMemberChangeText}/>
            <ThemedButton title="Search" opnPress={searchMember} />  
            <View style={{ marginTop: 25 }} />
            {showExistingPlayer && <>
            <MemberItem firstName={memberDetails?.firstName} dateOfBirth={memberDetails?.dateOfBirth} lastName={memberDetails?.lastName} id={0} />
            <View style={{ marginTop: 25 }} />
            <ThemedButton title="Add Member" opnPress={addMember} />   
            </>}      
        {showNewMemberForm && <>
            <InputText placeholder='First Name'/>
            <InputText placeholder='Last Name'/>
            <InputText placeholder='Phone Number' />
            <DatePicker date={date} setDate={setDate}/>
            <InputText placeholder='Jersey Name' />
            <InputText placeholder='Jersey Number' />
            <View style={{ marginTop: 25 }} />
            <ThemedButton title="Add Member" opnPress={addMember} />   
            </>}        
        </GestureHandlerRootView>
    )
}

export default AddMember

const styles = StyleSheet.create({

})