import InputText from '@/src/components/InputText'
import ThemedButton from '@/src/components/ThemedButton'
import React, { useRef, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DatePicker from '@/src/components/DatePicker';

const AddMember = () => {
          
    const [date, setDate] = useState<Date>(new Date());

    const addMember = () => {
        console.log("add player")
    }

    return (
        <GestureHandlerRootView>
            <InputText placeholder='First Name'/>
            <InputText placeholder='Last Name'/>
            <InputText placeholder='Phone Number' />
            <DatePicker date={date} setDate={setDate}/>
            <InputText placeholder='Jersey Name' />
            <InputText placeholder='Jersey Number' />
            <ThemedButton title="Add Member" opnPress={addMember} />           
        </GestureHandlerRootView>
    )
}

export default AddMember

const styles = StyleSheet.create({

})