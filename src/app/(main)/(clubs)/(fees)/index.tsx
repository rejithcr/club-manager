import { View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import { router } from 'expo-router'
import TouchableCard from '@/src/components/TouchableCard'
import { ClubContext } from '@/src/context/ClubContext'
import { ROLE_ADMIN } from '@/src/utils/constants'
import ThemedText from '@/src/components/themed-components/ThemedText'
import ThemedView from '@/src/components/themed-components/ThemedView'
import ThemedIcon from '@/src/components/themed-components/ThemedIcon'
import Spacer from '@/src/components/Spacer'
import { useTheme } from '@/src/hooks/use-theme'
import ThemedHeading from '@/src/components/themed-components/ThemedHeading'
import { useGetFeesQuery } from '@/src/services/feeApi'

const Fees = () => {
  const { clubInfo } = useContext(ClubContext)
  const { colors } = useTheme();

  const {data: currentFeeStructure, isLoading: isLoadingCurrent} = useGetFeesQuery({ clubId: clubInfo.clubId });
 
  const showFeeTypeDetails = (fee: any) => {
    router.push({
      pathname: "/(main)/(clubs)/(fees)/feetypedetails",
      params: { fee: JSON.stringify(fee) }
    })
  }
  
  return (
    <ThemedView style={{flex: 1}}>
    <GestureHandlerRootView>
      <ScrollView>
        <View style={{
          flexDirection: "row", alignItems: "center",  width: "90%",
          justifyContent: "space-between", alignSelf: "center",
        }}>
          <ThemedHeading style={{width: 200}}>Recurring Fees</ThemedHeading>
          {clubInfo.role == ROLE_ADMIN && <TouchableOpacity 
            onPress={() => router.push(`/(main)/(clubs)/(fees)/definefee`)}>
            <ThemedIcon size={25} name={'MaterialCommunityIcons:plus-circle'} color={colors.add}/>
          </TouchableOpacity> }
        </View>
        {isLoadingCurrent && <LoadingSpinner />}
        {!isLoadingCurrent && currentFeeStructure?.length == 0 && <ThemedText style={{ alignSelf: "center", width: "80%"}}>No fees defined. To define a fee type (eg. Membership fee), press the + icon.</ThemedText>}
        {!isLoadingCurrent && currentFeeStructure?.map((fee: any) => {
          return <View key={fee.clubFeeTypeId}><TouchableCard onPress={showFeeTypeDetails} id={fee}>
            <View style={{
              flexDirection: "row", width: "90%",
              justifyContent: "space-between", alignItems: "center", flexWrap: "wrap"
            }}>
              <View>
                <ThemedText style={{ fontWeight: "bold" }}>{fee.clubFeeType}</ThemedText>
                <ThemedText style={{ fontSize: 10, marginTop: 5 }}>{fee.clubFeeTypeInterval}</ThemedText>
              </View>
                <ThemedText style={{ marginRight: 10 }}>Rs. {fee.clubFeeAmount}</ThemedText>
            </View>
          </TouchableCard>
          <Spacer space={4}/> 
          </View>
        })}
      </ScrollView>
    </GestureHandlerRootView>
    </ThemedView>
  )
}

export default Fees
