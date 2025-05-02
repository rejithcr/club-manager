import React, { useContext, useReducer, useRef, useState } from 'react'
import InputText from '@/src/components/InputText'
import ThemedButton from '@/src/components/ThemedButton'
import { Picker } from '@react-native-picker/picker'
import InputSelect from '@/src/components/InputSelect'
import { createClub } from '@/src/helpers/club_helper'
import { AuthContext } from '@/src/context/AuthContext'
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler'
import { router } from 'expo-router'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import { View } from 'react-native'

const CreateClub = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [clubName, setClubName] = useState("")
  const { userInfo } = useContext(AuthContext)

  const submitCreateClub = () => {
    setIsLoading(true)
    createClub(clubName, userInfo.memberId, userInfo.email)
      .then(response => router.replace(`/(main)/(clubs)/clubdetails?clubId=${response.data.clubId}&role=ADMIN`))
      .catch(err => alert(err))
      .finally(() => setIsLoading(false))
  }
  return (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading &&
        <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
          <InputText placeholder='Enter Club Name' label='Club Name' onChangeText={(text: string) => setClubName(text)} />
          <ThemedButton title="Create" onPress={submitCreateClub} />
        </View>}
    </>
  )
}

export default CreateClub