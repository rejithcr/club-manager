import { View, ScrollView, TouchableOpacity, FlatList, RefreshControl } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
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
      onRefresh()
      return () => { console.log('Screen is unfocused'); };
    }, [])
  );


  const offset = useRef(0)
  const limit = 20
  const [hasMoreData, setHasMoreData] = useState(false)
  const [isFectching, setIsFetching] = useState(false)

  const onRefresh = () => {
    setIsLoadingAdhoc(true)
    offset.current = 0
    getAdhocFee(clubInfo.clubId, limit, offset.current)
      .then(response => {
        setHasMoreData(response.data?.length > 0);
        setAdhocFees(response.data)
      })
      .catch(error => setAlertConfig({
        visible: true, title: 'Error', message: error.response.data.error,
        buttons: [{ text: 'OK', onPress: () => setAlertConfig({ visible: false }) }]
      }))
      .finally(() => setIsLoadingAdhoc(false))
  }

  const fetchNextPage = () => {
    if (hasMoreData && !isFectching) {
      setIsFetching(true)
      offset.current = offset.current + limit
      getAdhocFee(clubInfo.clubId, limit, offset.current)
        .then(response => {
          setHasMoreData(response.data?.length > 0);
          setAdhocFees((prev: any) => [...prev, ...response.data])
        })
        .catch(error => setAlertConfig({
          visible: true, title: 'Error', message: error.response.data.error,
          buttons: [{ text: 'OK', onPress: () => setAlertConfig({ visible: false }) }]
        }))
        .finally(() => setIsFetching(false))
    }
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
        <View style={{
          flexDirection: "row", alignItems: "center", width: "90%",
          justifyContent: "space-between", alignSelf: "center", marginTop: 10
        }}>
          <ThemedHeading style={{ width: 200 }}>Expense Splits</ThemedHeading>

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
        {!isLoadingAdhoc && adhocFees?.length > 0 &&
          <FlatList style={{ flex: 1 }}
            ItemSeparatorComponent={() => <Spacer space={4} />}
            ListFooterComponent={() => isFectching && <><Spacer space={10} /><LoadingSpinner /></> || <Spacer space={4} />}
            data={adhocFees}
            initialNumToRender={20}
            onEndReached={fetchNextPage}
            onEndReachedThreshold={0.2}
            refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
            renderItem={({ item }) => (
              <TouchableCard onPress={showAdhocFeeDetails} id={item}>
                <View style={{
                  flexDirection: "row", width: "90%",
                  justifyContent: "space-between", alignItems: "center", flexWrap: "wrap"
                }}>
                  <View>
                    <ThemedText style={{ fontWeight: "bold" }}>{item.clubAdhocFeeName}</ThemedText>
                    <ThemedText style={{ fontSize: 10, marginTop: 5 }}>{item.clubAdhocFeeDate} {item.clubAdhocFeeDesc}</ThemedText>
                  </View>
                  <View >
                    <ThemedText style={{ textAlign: "right" }}>Rs. {item.clubAdhocFeePaymentAmount}</ThemedText>
                    <ThemedText style={{ fontSize: 10, marginTop: 5, textAlign: "right" }}>Completed {Math.round(item.completionPercentage)}%</ThemedText>
                  </View>
                </View>
              </TouchableCard>
            )}
          />
        }
        {alertConfig?.visible && <Alert {...alertConfig} />}
      </GestureHandlerRootView>
    </ThemedView>
  )
}

export default AdocFeesHome
