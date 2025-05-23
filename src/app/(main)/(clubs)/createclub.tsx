import React, { useContext, useState } from 'react'
import InputText from '@/src/components/InputText'
import ThemedButton from '@/src/components/ThemedButton'
import { createClub } from '@/src/helpers/club_helper'
import { AuthContext } from '@/src/context/AuthContext'
import { router } from 'expo-router'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import { Alert, View } from 'react-native'
import { isValidLength } from '@/src/utils/validators'
import ThemedView from '@/src/components/themed-components/ThemedView'

const CreateClub = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [clubName, setClubName] = useState("")
  const { userInfo } = useContext(AuthContext)

  const submitCreateClub = () => {
    if (validate(clubName.trim())) {
      setIsLoading(true)
      createClub(clubName.trim(), userInfo.memberId, userInfo.email)
        .then(response => router.replace(`/(main)/(clubs)?clubId=${response.data.clubId}&clubName=${clubName.trim()}&role=ADMIN`))
        .catch(err => Alert.alert(err.response.data.err))
        .finally(() => setIsLoading(false))
    }
  }
  return (
    <ThemedView style={{ flex: 1 }}>
      {isLoading && <LoadingSpinner />}
      {!isLoading &&
        <View style={{ alignItems: "center", marginTop:20}}>
          <InputText placeholder='Enter Club Name' label='Club Name' onChangeText={(text: string) => setClubName(text)} />
          <ThemedButton title="Create" onPress={submitCreateClub} />
        </View>
      }
    </ThemedView>
  )
}

export default CreateClub

const validate = (clubName: string | null | undefined) => {
  if (!isValidLength(clubName?.trim(), 2)) {
    Alert.alert("Error", "Enter atleast 2 characters for club name")
    return false
  }
  return true
}