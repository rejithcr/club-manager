import { View, TouchableOpacity, FlatList, RefreshControl } from "react-native";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { getAdhocFee } from "@/src/helpers/fee_helper";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { router, useFocusEffect } from "expo-router";
import TouchableCard from "@/src/components/TouchableCard";
import { ClubContext } from "@/src/context/ClubContext";
import { ROLE_ADMIN } from "@/src/utils/constants";
import ThemedText from "@/src/components/themed-components/ThemedText";
import ThemedView from "@/src/components/themed-components/ThemedView";
import ThemedIcon from "@/src/components/themed-components/ThemedIcon";
import Spacer from "@/src/components/Spacer";
import { useTheme } from "@/src/hooks/use-theme";
import ThemedHeading from "@/src/components/themed-components/ThemedHeading";
import ProgressBar from "@/src/components/charts/ProgressBar";
import { useGetFeesAdhocQuery } from "@/src/services/feeApi";
import usePaginatedQuery from "@/src/hooks/usePaginatedQuery";

const limit = 20;

const AdocFeesHome = () => {
  const { clubInfo } = useContext(ClubContext);
  const { colors } = useTheme();

  const { items, isLoading, isFetching, refreshing, onRefresh, loadMore } = usePaginatedQuery(
    useGetFeesAdhocQuery,
    { clubId: clubInfo.clubId },
    limit
  );

  const showAdhocFeeDetails = (adhocFee: any) => {
    router.push({
      pathname: "/(main)/(clubs)/(fees)/adhocfee/payments",
      params: { adhocFee: JSON.stringify(adhocFee) },
    });
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "90%",
            justifyContent: "space-between",
            alignSelf: "center",
            marginTop: 10,
          }}
        >
          <ThemedHeading style={{ width: 200 }}>Expense Splits</ThemedHeading>
          <View style={{ width: "20%", flexDirection: "row", justifyContent: "flex-end" }}>
            {clubInfo.role == ROLE_ADMIN && (
              <TouchableOpacity onPress={() => router.push(`/(main)/(clubs)/(fees)/adhocfee/definefee`)}>
                <ThemedIcon size={25} name={"MaterialCommunityIcons:plus-circle"} color={colors.add} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <FlatList
            style={{ flex: 1 }}
            ItemSeparatorComponent={() => <Spacer space={10} />}
            ListFooterComponent={() =>
              (isFetching && (
                <>
                  <Spacer space={10} />
                  <LoadingSpinner />
                </>
              )) || <Spacer space={4} />
            }
            data={items}
            initialNumToRender={limit}
            ListEmptyComponent={() => (
              <ThemedText style={{ alignSelf: "center", width: "80%" }}>
                No splits defined. This will be a one time collection from selected members. For eg. splitting expense
                among members who participated in an event. Press the + icon to define collection
              </ThemedText>
            )}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            onRefresh={onRefresh}
            refreshing={refreshing}
            renderItem={({ item }) => (
              <TouchableCard onPress={showAdhocFeeDetails} id={item}>
                <View
                  style={{
                    flexDirection: "row",
                    width: "90%",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <View style={{ width: "75%" }}>
                    <ThemedText style={{ fontWeight: "bold" }}>{item.clubAdhocFeeName}</ThemedText>
                    <ThemedText style={{ fontSize: 10, marginTop: 5 }}>
                      {item.clubAdhocFeeDate} {item.clubAdhocFeeDesc}
                    </ThemedText>
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
        )}
      </GestureHandlerRootView>
    </ThemedView>
  );
};

export default AdocFeesHome;
