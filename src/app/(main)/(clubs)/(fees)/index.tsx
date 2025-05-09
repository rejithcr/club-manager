import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { appStyles } from '@/src/utils/styles'
import { getFeeStructure, getAdhocFee } from '@/src/helpers/fee_helper'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import { router, useFocusEffect } from 'expo-router'
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons'
import TouchableCard from '@/src/components/TouchableCard'
import { ClubContext } from '@/src/context/ClubContext'
import { ROLE_ADMIN } from '@/src/utils/constants'

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
    <GestureHandlerRootView>
      <ScrollView>
        <View style={{
          flexDirection: "row", alignItems: "center", width: "80%",
          justifyContent: "space-between", alignSelf: "center",
        }}>
          <Text style={{ ...appStyles.heading, marginLeft: 0, width: "80%" }}>Active Fees</Text>
          {clubInfo.role == ROLE_ADMIN && <TouchableOpacity style={{ width: "10%" }}
            onPress={() => router.push(`/(main)/(clubs)/(fees)/definefee`)}>
            <MaterialCommunityIcons size={25} name={'plus-circle'} />
          </TouchableOpacity> }
        </View>
        {isLoadingCurrent && <LoadingSpinner />}
        {!isLoadingCurrent && currentFeeStructure?.length == 0 && <Text style={{ alignSelf: "center" }}>No fees defined</Text>}
        {!isLoadingCurrent && currentFeeStructure?.map((fee: any) => {
          return <TouchableCard key={fee.clubFeeTypeId} showDetails={showFeeTypeDetails} id={fee}>
            <View style={{
              flexDirection: "row", width: "100%",
              justifyContent: "space-between", alignItems: "center", flexWrap: "wrap"
            }}>
              <View>
                <Text style={{ fontWeight: "bold" }}>{fee.clubFeeType}</Text>
                <Text style={{ fontSize: 10, marginTop: 5 }}>{fee.clubFeeTypeInterval}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ marginRight: 10 }}>Rs. {fee.clubFeeAmount}</Text>
                <MaterialCommunityIcons size={20} name={'chevron-right-circle'} />
              </View>
            </View>
          </TouchableCard>
        })}

        <View style={{
          flexDirection: "row", alignItems: "center", width: "80%",
          justifyContent: "space-between", alignSelf: "center", marginTop: 20
        }}>
          <Text style={{ ...appStyles.heading, marginLeft: 0, width: "80%" }}>Adhoc Collections</Text>
          {clubInfo.role == ROLE_ADMIN &&<TouchableOpacity style={{ width: "10%" }}
            onPress={() => router.push(`/(main)/(clubs)/(fees)/adhocfee/definefee`)}>
            <MaterialCommunityIcons size={25} name={'plus-circle'} />
          </TouchableOpacity>}
        </View>
        {isLoadingAdhoc && <LoadingSpinner />}
        {!isLoadingAdhoc && adhocFees?.length == 0 && <Text style={{ alignSelf: "center" }}>No adhoc fees defined</Text>}
        {!isLoadingAdhoc && adhocFees?.map(fee =>
          <TouchableCard key={fee.clubAdhocFeeId} showDetails={showAdhocFeeDetails} id={fee}>
            <View style={{
              flexDirection: "row", width: "100%",
              justifyContent: "space-between", alignItems: "center", flexWrap: "wrap"
            }}>
              <View>
                <Text style={{ fontWeight: "bold" }}>{fee.clubAdhocFeeName}</Text>
                <Text style={{ fontSize: 10, marginTop: 5 }}>{fee.clubAdhocFeeDesc}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ marginRight: 10 }}>Rs. {fee.clubAdhocFeePaymentAmount}</Text>
                <MaterialCommunityIcons size={20} name={'chevron-right-circle'} />
              </View>
            </View>
          </TouchableCard>
        )}
      </ScrollView>
    </GestureHandlerRootView>
  )
}

export default Fees
