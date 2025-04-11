import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import KeyValueUI from '@/src/components/KeyValueUI'
import { appStyles } from '@/src/utils/styles'
import { useSearchParams } from 'expo-router/build/hooks'
import { getFeeStructure, getFeeExemptions, getAdhocFees } from '@/src/helpers/fee_helper'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import FloatingMenu from '@/src/components/FloatingMenu'
import { router } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'

const Fees = () => {
  const [isLoadingCurrent, setIsLoadingCurrent] = useState(false);
  const [isLoadingExemptions, setIsLoadingExemptions] = useState(false);
  const [isLoadingAdhoc, setIsLoadingAdhoc] = useState(false);
  const [currentFeeStructure, serCurrentFeeStructure] = useState<{}>()
  const [feeExemptions, setFeeExemptions] = useState<{}>()
  const [adhocFees, setAdhocFees] = useState<{}>()
  const params = useSearchParams()

  useEffect(() => {
    setIsLoadingCurrent(true)
    setIsLoadingExemptions(true)
    setIsLoadingAdhoc(true)
    getFeeStructure(Number(params.get("clubId")))
      .then(data => { serCurrentFeeStructure(data); setIsLoadingCurrent(false) })
      .catch(error => console.error(error))
      .finally(() => setIsLoadingCurrent(false));

    getFeeExemptions(Number(params.get("clubId")))
      .then(data => { setFeeExemptions(data); setIsLoadingExemptions(false) })
      .catch(error => console.error(error))
      .finally(() => setIsLoadingExemptions(false));

    getAdhocFees(Number(params.get("clubId")))
      .then(data => { setAdhocFees(data); setIsLoadingAdhoc(false) })
      .catch(error => console.error(error))
      .finally(() => setIsLoadingAdhoc(false));

  }, [])

  const gotoFeeCollection =  () => router.push(`/(main)/(clubs)/(fees)/startcollection?clubId=${params.get("clubId")}&clubName=${params.get("clubName")}`)

  return (
    <GestureHandlerRootView>
      <ScrollView>
        <Text style={appStyles.title}>{params.get("clubName")}</Text>
        <Text style={appStyles.heading}>Current Fee</Text>
        {isLoadingCurrent && <LoadingSpinner />}
        {!isLoadingCurrent && <KeyValueUI data={currentFeeStructure} />}
        <Text style={appStyles.heading}>Exemptions</Text>
        {isLoadingExemptions && <LoadingSpinner />}
        {!isLoadingExemptions && <KeyValueUI data={feeExemptions} />}
        <View style={{ marginBottom: 20 }} />
        
        <Text style={appStyles.heading}>Adhoc Fees</Text>
        {isLoadingAdhoc && <LoadingSpinner />}
        {!isLoadingAdhoc && <KeyValueUI data={adhocFees} />}
        <View style={{ marginBottom: 20 }} />
      </ScrollView>
      <FloatingMenu onPressMain={() => gotoFeeCollection()} 
        icon={<MaterialIcons name={"add"} size={32} color={"white"} />}
      />
    </GestureHandlerRootView>
  )
}

export default Fees