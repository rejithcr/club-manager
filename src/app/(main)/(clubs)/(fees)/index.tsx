import { View, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { appStyles } from '@/src/utils/styles'
import { getFeeStructure, getAdhocFee } from '@/src/helpers/fee_helper'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import { router, useFocusEffect } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import TouchableCard from '@/src/components/TouchableCard'
import { ClubContext } from '@/src/context/ClubContext'
import { ROLE_ADMIN } from '@/src/utils/constants'
import ThemedText from '@/src/components/themed-components/ThemedText'
import ThemedView from '@/src/components/themed-components/ThemedView'
import ThemedIcon from '@/src/components/themed-components/ThemedIcon'

const Fees = () => {
  const [isLoadingCurrent, setIsLoadingCurrent] = useState(false);
  const [isLoadingAdhoc, setIsLoadingAdhoc] = useState(false);
  const [currentFeeStructure, setCurrentFeeStructure] = useState<any>([])
  const [adhocFees, setAdhocFees] = useState<any[]>([])
  const { clubInfo } = useContext(ClubContext)

  useFocusEffect(
    useCallback(() => {
      showFees()
      return () => { console.log('Screen is unfocused'); };
    }, [])
  );

  const showFees = () => {
    setIsLoadingCurrent(true)
    setIsLoadingAdhoc(true)

    getFeeStructure(Number(clubInfo.clubId))
      .then(response => setCurrentFeeStructure(response.data))
      .catch(error => Alert.alert("Error", error.response.data.error))
      .finally(() => setIsLoadingCurrent(false));

    getAdhocFee(Number(clubInfo.clubId))
      .then(response => setAdhocFees(response.data))
      .catch(error => Alert.alert("Error", error.response.data.error))
      .finally(() => setIsLoadingAdhoc(false));
  }

  const showFeeTypeDetails = (fee: any) => {
    router.push({
      pathname: "/(main)/(clubs)/(fees)/feetypedetails",
      params: { fee: JSON.stringify(fee) }
    })
  }
  const showAdhocFeeDetails = (adhocFee: any) => {
    router.push({
      pathname: "/(main)/(clubs)/(fees)/adhocfee/payments",
      params: { adhocFee: JSON.stringify(adhocFee) }
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
            <ThemedIcon size={25} name={'MaterialCommunityIcons:plus-circle'} />
          </TouchableOpacity> }
        </View>
        {isLoadingCurrent && <LoadingSpinner />}
        {!isLoadingCurrent && currentFeeStructure?.length == 0 && <ThemedText style={{ alignSelf: "center", width: "80%"}}>No fees defined. To define a fee type (eg. Membership fee), press the + icon.</ThemedText>}
        {!isLoadingCurrent && currentFeeStructure?.map((fee: any) => {
          return <TouchableCard key={fee.clubFeeTypeId} onPress={showFeeTypeDetails} id={fee}>
            <View style={{
              flexDirection: "row", width: "100%",
              justifyContent: "space-between", alignItems: "center", flexWrap: "wrap"
            }}>
              <View>
                <ThemedText style={{ fontWeight: "bold" }}>{fee.clubFeeType}</ThemedText>
                <ThemedText style={{ fontSize: 10, marginTop: 5 }}>{fee.clubFeeTypeInterval}</ThemedText>
              </View>
              <View style={{ flexDirection: "row" }}>
                <ThemedText style={{ marginRight: 10 }}>Rs. {fee.clubFeeAmount}</ThemedText>
                <ThemedIcon size={20} name={'MaterialCommunityIcons:chevron-right-circle'} />
              </View>
            </View>
          </TouchableCard>
        })}

        <View style={{
          flexDirection: "row", alignItems: "center", width: "80%",
          justifyContent: "space-between", alignSelf: "center", marginTop: 10
        }}>
          <ThemedText style={{ ...appStyles.heading, marginLeft: 0, width: "80%" }}>Expense Splits</ThemedText>
          {clubInfo.role == ROLE_ADMIN &&<TouchableOpacity style={{ width: "10%" }}
            onPress={() => router.push(`/(main)/(clubs)/(fees)/adhocfee/definefee`)}>
            <ThemedIcon size={25} name={'MaterialCommunityIcons:plus-circle'} />
          </TouchableOpacity>}
        </View>
        {isLoadingAdhoc && <LoadingSpinner />}
        {!isLoadingAdhoc && adhocFees?.length == 0 && 
        <ThemedText style={{ alignSelf: "center", width: "80%" }}>No adhoc fees defined. 
        This will be a on time collection from selected members. 
        For eg. splitting expense amoung members who participated in an event. Press the + icon to define collection</ThemedText>}
        {!isLoadingAdhoc && adhocFees?.map(fee =>
          <TouchableCard key={fee.clubAdhocFeeId} onPress={showAdhocFeeDetails} id={fee}>
            <View style={{
              flexDirection: "row", width: "100%",
              justifyContent: "space-between", alignItems: "center", flexWrap: "wrap"
            }}>
              <View>
                <ThemedText style={{ fontWeight: "bold" }}>{fee.clubAdhocFeeName}</ThemedText>
                <ThemedText style={{ fontSize: 10, marginTop: 5 }}>{fee.clubAdhocFeeDesc}</ThemedText>
              </View>
              <View style={{ flexDirection: "row" }}>
                <ThemedText style={{ marginRight: 10 }}>Rs. {fee.clubAdhocFeePaymentAmount}</ThemedText>
                <ThemedIcon size={20} name={'MaterialCommunityIcons:chevron-right-circle'} />
              </View>
            </View>
          </TouchableCard>
        )}
      </ScrollView>
    </GestureHandlerRootView>
    </ThemedView>
  )
}

export default Fees
