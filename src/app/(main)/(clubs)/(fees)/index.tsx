import { View, Text, ScrollView, GestureResponderEvent } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import KeyValueUI from '@/src/components/KeyValueUI'
import { appStyles } from '@/src/utils/styles'
import { useSearchParams } from 'expo-router/build/hooks'
import { getFeeStructure, getFeeExemptions, getAdhocFees } from '@/src/helpers/fee_helper'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import FloatingMenu from '@/src/components/FloatingMenu'
import { router, useFocusEffect } from 'expo-router'
import { FontAwesome6, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import ClubFeeSummary from './ClubFeeSummary'
import TouchableCard from '@/src/components/TouchableCard'

const Fees = () => {
  const [isLoadingCurrent, setIsLoadingCurrent] = useState(false);
  const [isLoadingAdhoc, setIsLoadingAdhoc] = useState(false);
  const [currentFeeStructure, setCurrentFeeStructure] = useState<any>([])
  const [adhocFees, setAdhocFees] = useState<{}>()
  const params = useSearchParams()

  useFocusEffect(
    useCallback(() => {
      showFees()
      return () => { console.log('Screen is unfocused'); };
    }, [])
  );

  const showFees = () => {
    setIsLoadingCurrent(true)
    setIsLoadingAdhoc(true)
    
    getFeeStructure(Number(params.get("clubId")))
      .then(response => { setCurrentFeeStructure(response.data); setIsLoadingCurrent(false) })
      .catch(error => console.error(error))
      .finally(() => setIsLoadingCurrent(false));

    getAdhocFees(Number(params.get("clubId")))
      .then(data => { setAdhocFees(data); setIsLoadingAdhoc(false) })
      .catch(error => console.error(error))
      .finally(() => setIsLoadingAdhoc(false));
  }
  useEffect(() => {
    showFees()
  }, [])

  const showClubDues = (_: GestureResponderEvent): void => {
    router.push(`/(main)/(clubs)/(fees)/clubdues?clubId=${params.get("clubId")}&clubName=${params.get("clubName")}`)
  }
  const showFeeByMember = (_: GestureResponderEvent): void => {
    router.push(`/(main)/(clubs)/(fees)/payments?clubId=${params.get("clubId")}&clubName=${params.get("clubName")}`)
  }
  const showFeeTypeDetails = (fee: any) => {
    router.push({
      pathname: "/(main)/(clubs)/(fees)/feetypedetails",
      params: { fee: JSON.stringify(fee), clubId: params.get("clubId"), clubName: params.get("clubName") }
    })
  }
  return (
    <GestureHandlerRootView>
      <ScrollView>
        <Text style={appStyles.heading}>Summary</Text>
        <ClubFeeSummary clubId={Number(params.get("clubId"))} clubName={params.get("clubName")}
          showClubDues={showClubDues} showFeeByMember={showFeeByMember} />

        <Text style={appStyles.heading}>Active Fees</Text>
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
          // <KeyValueUI data={fee} hideKeys={["clubId","clubFeeTypeId","clubFeeIsActive", "clubFeeTypeDesc"]}/>
        })}

        <Text style={appStyles.heading}>Adhoc Fees</Text>
        {isLoadingAdhoc && <LoadingSpinner />}
        {!isLoadingAdhoc && <KeyValueUI data={adhocFees} />}
        <View style={{ marginBottom: 20 }} />
      </ScrollView>
      <FloatingMenu actions={actions} position={"left"} color='black'
        icon={<MaterialIcons name={"menu"} size={32} color={"white"} />}
        onPressItem={(name: string | undefined) => handleMenuPress(name, params.get("clubId"), params.get("clubName"), params.get("role"))}
      />
    </GestureHandlerRootView>
  )
}

export default Fees


const handleMenuPress = (name: string | undefined, clubId: string | null, clubName: string | null, role: string | null) => {
  if (name == "definefee") {
    router.push(`/(main)/(clubs)/(fees)/definefee?clubId=${clubId}&clubName=${clubName}`)
  } else {
    throw ("Error")
  }
}

const actions = [
  {
    color: "black",
    text: "Define Fee",
    icon: <FontAwesome6 name={"cash-register"} size={15} color={"white"} />,
    name: "definefee",
    position: 1
  }
]