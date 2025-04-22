import React, { useContext, useReducer, useRef, useState } from 'react'
import InputText from '@/src/components/InputText'
import ThemedButton from '@/src/components/ThemedButton'
import { Picker } from '@react-native-picker/picker'
import InputSelect from '@/src/components/InputSelect'
import { createClub } from '@/src/helpers/club_helper'
import { AuthContext } from '@/src/context/AuthContext'
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler'

const CreateClub = () => {
  const [periodType, setPeriodType] = useState("MONTHLY")
  const [clubName, setClubName] = useState("")
  const [feeAmount, setFeeAmount] = useState("0")
  const { userInfo } = useContext(AuthContext)
  const inputRef = useRef<any>()

  const submitCreateClub = () => {
    const payLoad = {name: clubName, admin: userInfo.name, periodType, feeAmount}
   // createClub(payLoad)
    console.log(inputRef.current)

  }
  return (
    <GestureHandlerRootView style={{width: "100%", alignItems:"center"}}>
      <InputText placeholder='Enter Club Name' label='Club Name' onChangeText={(text: string) => setClubName(text)} />
      <InputSelect label = "Fee Period"
          selectedValue={periodType}
          onValueChange={(itemValue: string, itemIndex: any) => setPeriodType(itemValue)}>
          <Picker.Item label="Monthly" value="MONTHLY" />
          <Picker.Item label="Quaterly" value="QUATERLY" />
          <Picker.Item label="Yearly" value="YEARLY" />
      </InputSelect>      
      <InputText placeholder='Fee Amount' label='Fee' onChangeText={(text: string) => setFeeAmount(text)}/>
      <ThemedButton title="Create" onPress={submitCreateClub} />
    </GestureHandlerRootView>
  )
}

export default CreateClub