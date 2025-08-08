import { View, TouchableOpacity, FlatList, RefreshControl } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
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
import ThemedHeading from '@/src/components/themed-components/ThemedHeading'
import ProgressBar from '@/src/components/charts/ProgressBar'
import { useGetFeesAdhocQuery } from '@/src/services/feeApi'

const limit = 20;

const AdocFeesHome = () => {
  const { clubInfo } = useContext(ClubContext)
  const { colors } = useTheme();
  
  const [offset, setOffset] = useState(0);
  const [items, setItems] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: expenseSplits,
    isLoading: isFetching,
    refetch,
  } = useGetFeesAdhocQuery({ clubId: Number(clubInfo.clubId), limit, offset }, { skip: !hasMore });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setOffset(0);
    refetch(); // Optional: triggers revalidation
  }, [refetch]);

  useEffect(() => {
    if (expenseSplits) {
      setItems((prev) => [...prev, ...expenseSplits]);
      if (expenseSplits.length < limit) {
        setHasMore(false);
      }
    }
  }, [expenseSplits]);

  const loadMore = () => {
    if (!isFetching && hasMore) {
      setOffset((prev) => prev + limit);
    }
  };

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
        {isFetching && <LoadingSpinner />}
        {!isFetching && items?.length == 0 &&
          <ThemedText style={{ alignSelf: "center", width: "80%" }}>No splits defined.
            This will be a one time collection from selected members.
            For eg. splitting expense among members who participated in an event. Press the + icon to define collection</ThemedText>}
        {!isFetching && items?.length > 0 &&
          <FlatList style={{ flex: 1 }}
            ItemSeparatorComponent={() => <Spacer space={4} />}
            ListFooterComponent={() => isFetching && !refreshing  && <><Spacer space={10} /><LoadingSpinner /></> || <Spacer space={4} />}
            data={items}
            initialNumToRender={20}
            onEndReached={loadMore}
            onEndReachedThreshold={0.2}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({ item }) => (
              <TouchableCard onPress={showAdhocFeeDetails} id={item}>
                <View style={{
                  flexDirection: "row", width: "90%", 
                  justifyContent: "space-between", alignItems: "center", flexWrap: "wrap"
                }}>
                  <View style={{ width: "75%" }}>
                    <ThemedText style={{ fontWeight: "bold" }}>{item.clubAdhocFeeName}</ThemedText>
                    <ThemedText style={{ fontSize: 10, marginTop: 5 }}>{item.clubAdhocFeeDate} {item.clubAdhocFeeDesc}</ThemedText>
                  </View>
                  <View style={{ width: "25%" }}>
                    <ThemedText style={{ textAlign: "right" }}>Rs. {item.clubAdhocFeePaymentAmount}</ThemedText>         
                    <Spacer space={2} />           
                    <ProgressBar height={8} value={Math.round(item.completionPercentage)} />
                  </View>
                </View>
              </TouchableCard>
            )}
          />
        }
      </GestureHandlerRootView>
    </ThemedView>
  )
}

export default AdocFeesHome
