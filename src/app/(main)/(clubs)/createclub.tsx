import React, { useContext, useState } from 'react'
import InputText from '@/src/components/InputText'
import ThemedButton from '@/src/components/ThemedButton'
import { UserContext } from '@/src/context/UserContext'
import { router } from 'expo-router'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import { View } from 'react-native'
import { isValidLength } from '@/src/utils/validators'
import ThemedView from '@/src/components/themed-components/ThemedView'
import { useAddClubMutation } from '@/src/services/clubApi'
import { showSnackbar } from '@/src/components/snackbar/snackbarService'
import ThemedText from '@/src/components/themed-components/ThemedText'
import Spacer from '@/src/components/Spacer'

const CreateClub = () => {
  const [clubName, setClubName] = useState("")
  const [clubDescription, setClubDescription] = useState("")
  const [location, setLocation] = useState("")
  const [upiId, setUpiId] = useState("")
  const { userInfo } = useContext(UserContext)

  const [addClub, {isLoading}] = useAddClubMutation();
  
  const submitCreateClub = async () => {
    if (validate(clubName.trim())) {
      try {
        const response = await addClub({
          clubName: clubName.trim(),
          clubDescription,
          location,
          memberId: userInfo.memberId,
          email: userInfo.email,
          upiId,
        }).unwrap();
        router.replace(`/(main)/(clubs)?clubId=${response.data.clubId}&clubName=${clubName.trim()}&role=ADMIN`);
      } catch (error) {
        console.log(error);
      }
    }
  };
  
  const validate = (clubName: string | null | undefined) => {
    if (!isValidLength(clubName?.trim(), 2)) {
      showSnackbar("Enter atleast 2 characters for club name", 'error');
      return false
    }
    return true
  }
  return (
    <ThemedView style={{ flex: 1 }}>
      {isLoading && <LoadingSpinner />}
      {!isLoading &&
        <View style={{ alignItems: "center", marginTop:20}}>
          <InputText placeholder='Enter Club Name' label='Club Name *' onChangeText={(text: string) => setClubName(text)} />
          <InputText placeholder='Enter Club Description' label='Club Description' onChangeText={(text: string) => setClubDescription(text)} />
          <InputText placeholder='Enter Location' label='Location' onChangeText={(text: string) => setLocation(text)} />
          <InputText placeholder='Fee Collection UPI id' label='UPI Id' onChangeText={(text: string) => setUpiId(text)} />
          <ThemedText style={{ width: "80%", fontSize: 12, color: 'gray', textAlign: 'center' }}>This will be only used for redirecting the payment. Automatic tracking of payment is not yet supported.</ThemedText>
          <Spacer space={20} />
          <ThemedButton title="Create" onPress={submitCreateClub} />
        </View>
      }
    </ThemedView>
  )
}

export default CreateClub
