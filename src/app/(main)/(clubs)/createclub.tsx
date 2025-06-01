import React, { useContext, useState } from 'react'
import InputText from '@/src/components/InputText'
import ThemedButton from '@/src/components/ThemedButton'
import { createClub } from '@/src/helpers/club_helper'
import { AuthContext } from '@/src/context/AuthContext'
import { router } from 'expo-router'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import { View } from 'react-native'
import { isValidLength } from '@/src/utils/validators'
import ThemedView from '@/src/components/themed-components/ThemedView'
import Alert, { AlertProps } from '@/src/components/Alert'

const CreateClub = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [clubName, setClubName] = useState("")
  const [alertConfig, setAlertConfig] = useState<AlertProps>();
  const { userInfo } = useContext(AuthContext)

  const submitCreateClub = () => {
    if (validate(clubName.trim())) {
      setIsLoading(true)
      createClub(clubName.trim(), userInfo.memberId, userInfo.email)
        .then(response => router.replace(`/(main)/(clubs)?clubId=${response.data.clubId}&clubName=${clubName.trim()}&role=ADMIN`))
        .catch(error => setAlertConfig({visible: true, title: 'Error', message: error.response.data.error, 
                                        buttons: [{ text: 'OK', onPress: () => setAlertConfig({visible: false}) }]}))
        .finally(() => setIsLoading(false))
    }
  }
  
  const validate = (clubName: string | null | undefined) => {
    if (!isValidLength(clubName?.trim(), 2)) {
      setAlertConfig({visible: true, title: 'Error', message: "Enter atleast 2 characters for club name", buttons: [{ text: 'OK', onPress: () => setAlertConfig({visible: false}) }]})
      return false
    }
    return true
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
      {alertConfig?.visible && <Alert {...alertConfig}/>}
    </ThemedView>
  )
}

export default CreateClub
