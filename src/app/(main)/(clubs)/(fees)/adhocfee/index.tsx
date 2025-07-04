import { View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { appStyles } from '@/src/utils/styles'
import { getAdhocFee } from '@/src/helpers/fee_helper'
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
import ThemedHeading from '@/src/components/themed-components/ThemedHeading'

const AdocFeesHome = () => {
  const [isLoadingAdhoc, setIsLoadingAdhoc] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertProps>();
  const [adhocFees, setAdhocFees] = useState<any[]>([])
  const { clubInfo } = useContext(ClubContext)
  const { colors } = useTheme();

  useFocusEffect(
    useCallback(() => {
      showFees()
      return () => { console.log('Screen is unfocused'); };
    }, [])
  );

  const showFees = () => {
    setIsLoadingAdhoc(true)
    getAdhocFee(Number(clubInfo.clubId))
      .then(response => setAdhocFees(response.data))
      .catch(error => setAlertConfig({visible: true, title: 'Error', message: error.response.data.error, 
                                                buttons: [{ text: 'OK', onPress: () => setAlertConfig({visible: false}) }]}))
      .finally(() => setIsLoadingAdhoc(false));
  }

  const showAdhocFeeDetails = (adhocFee: any) => {
    router.push({
      pathname: "/(main)/(clubs)/(fees)/adhocfee/payments",
      params: { adhocFee: JSON.stringify(adhocFee) }
    })
  }
  return (
    <ThemedView style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <ScrollView>
          <View style={{
            flexDirection: "row", alignItems: "center", width: "90%",
            justifyContent: "space-between", alignSelf: "center", marginTop: 10
          }}>
            <ThemedHeading style={{width: 200}}>Expense Splits</ThemedHeading>

            <View style={{ width: "20%", flexDirection: "row", justifyContent: "flex-end" }}>
              {clubInfo.role == ROLE_ADMIN && <TouchableOpacity
                onPress={() => router.push(`/(main)/(clubs)/(fees)/adhocfee/definefee`)}>
                <ThemedIcon size={25} name={'MaterialCommunityIcons:plus-circle'} color={colors.add} />
              </TouchableOpacity>}</View>
          </View>
          {isLoadingAdhoc && <LoadingSpinner />}
          {!isLoadingAdhoc && adhocFees?.length == 0 &&
            <ThemedText style={{ alignSelf: "center", width: "80%" }}>No splits defined.
              This will be a one time collection from selected members.
              For eg. splitting expense among members who participated in an event. Press the + icon to define collection</ThemedText>}
          {!isLoadingAdhoc && adhocFees?.map(fee => <View key={fee.clubAdhocFeeId}>
            <TouchableCard onPress={showAdhocFeeDetails} id={fee}>
              <View style={{
                flexDirection: "row", width: "90%",
                justifyContent: "space-between", alignItems: "center", flexWrap: "wrap"
              }}>
                <View>
                  <ThemedText style={{ fontWeight: "bold" }}>{fee.clubAdhocFeeName}</ThemedText>
                  <ThemedText style={{ fontSize: 10, marginTop: 5 }}>{fee.clubAdhocFeeDesc}</ThemedText>
                </View>
                <View >
                  <ThemedText style={{ textAlign: "right" }}>Rs. {fee.clubAdhocFeePaymentAmount}</ThemedText>
                  <ThemedText style={{ fontSize: 10, marginTop: 5, textAlign: "right" }}>Completed {Math.round(fee.completionPercentage)}%</ThemedText>
                </View>
              </View>
            </TouchableCard>
            <Spacer space={4} />
          </View>
          )}
        </ScrollView>
        {alertConfig?.visible && <Alert {...alertConfig}/>}
      </GestureHandlerRootView>
    </ThemedView>
  )
}

export default AdocFeesHome
