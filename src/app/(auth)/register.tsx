import { View, Text } from 'react-native'
import React, { useState } from 'react'
import InputText from '@/src/components/InputText'
import DatePicker from '@/src/components/DatePicker'
import ThemedButton from '@/src/components/ThemedButton'

const Register = () => {
    const [date, setDate] = useState<Date>(new Date());
    const addMember = () => {
        console.log("add player")
    }
    return (
        <View>
            <InputText placeholder='First Name' />
            <InputText placeholder='Last Name' />
            <InputText placeholder='Phone Number' />
            <DatePicker date={date} setDate={setDate} />
            <InputText placeholder='Jersey Name' />
            <InputText placeholder='Jersey Number' />
            <View style={{ marginTop: 25 }} />
            <ThemedButton title="Register" onPress={addMember} />
        </View>
    )
}

export default Register