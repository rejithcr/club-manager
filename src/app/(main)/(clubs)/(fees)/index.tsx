import { View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { appStyles } from '@/src/utils/styles'
import { getFeeStructure, getAdhocFee } from '@/src/helpers/fee_helper'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import { router, useFocusEffect } from 'expo-router'
import TouchableCard from '@/src/components/TouchableCard'
import { ClubContext } from '@/src/context/ClubContext'
import { ROLE_ADMIN } from '@/src/utils/constants'
import ThemedText from '@/src/components/themed-components/ThemedText'
import ThemedView from '@/src/components/themed-components/ThemedView'
import ThemedIcon from '@/src/components/themed-components/ThemedIcon'
import Spacer from '@/src/components/Spacer'
import { useTheme } from '@/src/hooks/use-theme'
import Alert, { AlertProps } from '@/src/components/Alert'

const Fees = () => {
  const [isLoadingCurrent, setIsLoadingCurrent] = useState(false);
  const [currentFeeStructure, setCurrentFeeStructure] = useState<any>([])
  const [alertConfig, setAlertConfig] = useState<AlertProps>();
  const { clubInfo } = useContext(ClubContext)
  const { colors } = useTheme();

  useFocusEffect(
    useCallback(() => {
      showFees()
      return () => { console.log('Screen is unfocused'); };
    }, [])
  );

  const showFees = () => {
    setIsLoadingCurrent(true)
    getFeeStructure(Number(clubInfo.clubId))
      .then(response => setCurrentFeeStructure(response.data))
      .catch(error => setAlertConfig({
                    visible: true, title: 'Error', message: error.response.data.error,
                    buttons: [{ text: 'OK', onPress: () => setAlertConfig({ visible: false }) }]
                }))
      .finally(() => setIsLoadingCurrent(false));
  }

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
          flexDirection: "row", alignItems: "center", width: "80%",
          justifyContent: "space-between", alignSelf: "center",
        }}>
          <ThemedText style={{ ...appStyles.heading, marginLeft: 0, width: "80%" }}>Recurring Fees</ThemedText>
          {clubInfo.role == ROLE_ADMIN && <TouchableOpacity style={{ width: "10%" }}
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
      {alertConfig?.visible && <Alert {...alertConfig}/>}
    </GestureHandlerRootView>
    </ThemedView>
  )
}

export default Fees
