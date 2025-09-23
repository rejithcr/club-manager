import { View, GestureResponderEvent, TouchableOpacity, RefreshControl } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "expo-router/build/hooks";
import { FlatList, GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { MaterialCommunityIcons, MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { ClubContext } from "@/src/context/ClubContext";
import ThemedView from "@/src/components/themed-components/ThemedView";
import ThemedText from "@/src/components/themed-components/ThemedText";
import ThemedIcon from "@/src/components/themed-components/ThemedIcon";
import Spacer from "@/src/components/Spacer";
import TouchableCard from "@/src/components/TouchableCard";
import { ROLE_ADMIN } from "@/src/utils/constants";
import { useTheme } from "@/src/hooks/use-theme";
import ThemedHeading from "@/src/components/themed-components/ThemedHeading";
import Card from "@/src/components/Card";
import CircularProgress from "@/src/components/charts/CircularProgress";
import FloatingMenu from "@/src/components/FloatingMenu";
import { EventCard } from "../upcoming_events";
import { router } from "expo-router";
import { useGetClubEventsQuery } from "@/src/services/clubApi";
import {
  useGetFeesAdhocQuery,
  useGetFeesQuery,
  useGetFundBalanceQuery,
  useGetTotalDueQuery,
} from "@/src/services/feeApi";
import Animated, { FadeInLeft, FadeInRight, FadeInUp } from "react-native-reanimated";
import RoundedContainer from "@/src/components/RoundedContainer";
import Divider from "@/src/components/Divider";
import Banner from "@/src/components/Banner";

const ClubHome = () => {
  const router = useRouter();
  const params = useSearchParams();
  const { setClubInfo } = useContext(ClubContext);

  const { colors } = useTheme();

  const {
    data: events,
    isLoading: isLoadingEvents,
    isFetching: isFetchingEvents,
    refetch: fetchEvents,
  } = useGetClubEventsQuery({ clubId: params.get("clubId"), limit: 5, offset: 0 });

  const {
    data: fbr,
    isLoading: isFundBalanceLoading,
    isFetching: isFetchingFundBalance,
    refetch: fetchFundBalance,
  } = useGetFundBalanceQuery({ clubId: params.get("clubId"), fundBalance: "true" });

  const {
    data: expenseSplits,
    isLoading: isLoadingSplits,
    isFetching: isFetchingSplits,
    refetch: fetchSplits,
  } = useGetFeesAdhocQuery({ clubId: Number(params.get("clubId")), limit: 5, offset: 0 });

  const {
    data: clubDue,
    isLoading: isTotalDueLoading,
    isFetching: isFetchingTotalDue,
    refetch: fetchTotalDue,
  } = useGetTotalDueQuery({ clubId: params.get("clubId"), totalDue: "true" });

  const {
    data: currentFeeStructure,
    isLoading: isLoadingCurrent,
    isFetching: isFetchingCurrent,
    refetch: fetchFees,
  } = useGetFeesQuery({ clubId: params.get("clubId") });

  const showFeeTypeDetails = (fee: any) => {
    router.push({
      pathname: "/(main)/(clubs)/(fees)/feetypedetails",
      params: { fee: JSON.stringify(fee) },
    });
  };

  useEffect(() => {
    setClubInfo({ clubId: params.get("clubId"), clubName: params.get("clubName"), role: params.get("role") });
  }, []);

  const showClubDues = (_: GestureResponderEvent): void => {
    router.push(`/(main)/(clubs)/(fees)/clubdues`);
  };

  const onRefresh = () => {
    fetchFundBalance();
    fetchTotalDue();
    fetchFees();
    fetchSplits();
    fetchEvents();
  };

  const showAdhocFeeDetails = (adhocFee: any) => {
    router.push({
      pathname: "/(main)/(clubs)/(fees)/adhocfee/payments",
      params: { adhocFee: JSON.stringify(adhocFee) },
    });
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <GestureHandlerRootView>
      <Spacer space={10} />
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={
                isFetchingCurrent || isFetchingFundBalance || isFetchingTotalDue || isFetchingEvents || isFetchingSplits
              }
              onRefresh={onRefresh}
            />
          }
        >          
        <Banner backgroundColor={fbr?.fundBalance < 1 ? colors.error : colors.success}>
          <View>
            <ThemedText style={{ fontSize: 16, color: colors.background }}>Fund Balance</ThemedText>
            {isFundBalanceLoading ? <LoadingSpinner /> : 
              <ThemedText style={{ fontSize: 30, fontWeight: "bold", color: colors.background }}>
                Rs. {fbr?.fundBalance || 0}
              </ThemedText>
            }
          </View>
          <ThemedIcon name="MaterialCommunityIcons:wallet" size={50} color={colors.background} />
        </Banner>
        <Spacer space={10} />
          <RoundedContainer>
            <TouchableCard
              onPress={showClubDues}
              rightComponent={isTotalDueLoading ? <LoadingSpinner /> : <ThemedText>Rs. {clubDue?.totalDue}</ThemedText>}
            >
              <ThemedText style={{ fontSize: 16 }}>Dues</ThemedText>
            </TouchableCard>
            <Spacer space={2} />
            <Divider />
            <Spacer space={2} />
            <TouchableCard onPress={() => router.push(`/(main)/(clubs)/(transactions)`)}>
              <ThemedText style={{ fontSize: 16 }}>Transactions</ThemedText>
            </TouchableCard>
            <Spacer space={2} />
            <Divider />
            <Spacer space={2} />
            <TouchableCard onPress={() => router.push(`/(main)/(clubs)/(members)`)}>
              <ThemedText style={{ fontSize: 16 }}>Members</ThemedText>
            </TouchableCard>
          </RoundedContainer>
          <Spacer space={4} />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "90%",
              justifyContent: "space-between",
              alignSelf: "center",
            }}
          >
            <ThemedHeading style={{ width: 200 }}>Fees</ThemedHeading>
            <View style={{ width: "20%", flexDirection: "row", justifyContent: "flex-end" }}>
              {params.get("role") == ROLE_ADMIN && (
                <TouchableOpacity onPress={() => router.push(`/(main)/(clubs)/(fees)/definefee`)}>
                  <ThemedIcon size={25} name={"MaterialCommunityIcons:plus-circle"} color={colors.add} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          {isLoadingCurrent && <LoadingSpinner />}
          {!isLoadingCurrent && currentFeeStructure?.length == 0 && (
            <ThemedText style={{ alignSelf: "center", width: "80%", color: colors.subText }}>
              No fees defined. To define a fee type (eg. Membership fee), press the + icon.
            </ThemedText>
          )}
          {!isLoadingCurrent &&
            currentFeeStructure?.map((fee: any, idx: number) => {
              return (
                <View key={fee.clubFeeTypeId}>
                  <RoundedContainer>
                    <Animated.View entering={FadeInUp.duration(380).delay(idx * 80)} style={{ overflow: "hidden" }}>
                      <TouchableCard
                        onPress={showFeeTypeDetails}
                        id={fee}
                        rightComponent={<ThemedText>Rs. {fee.clubFeeAmount}</ThemedText>}
                      >
                        <View>
                          <ThemedText style={{ fontSize: 17, fontWeight: "bold" }}>{fee.clubFeeType}</ThemedText>
                          <ThemedText style={{ fontSize: 10, marginTop: 5, color: colors.disabled }}>
                            {fee.clubFeeTypeInterval}
                          </ThemedText>
                        </View>
                      </TouchableCard>
                      <Spacer space={2} />
                    </Animated.View>
                  </RoundedContainer>
                  <Spacer space={6} />
                </View>
              );
            })}
          {/* <Spacer space={4} />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "90%",
              justifyContent: "space-between",
              alignSelf: "center",
            }}
          >
            <ThemedHeading style={{ width: 200 }}>Events</ThemedHeading>
            <View style={{ width: "20%", flexDirection: "row", justifyContent: "flex-end" }}>
              {params.get("role") == ROLE_ADMIN && (
                <TouchableOpacity onPress={() => router.push(`/(main)/(clubs)/(events)/addevent`)}>
                  <ThemedIcon size={25} name={"MaterialCommunityIcons:plus-circle"} color={colors.add} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          {isLoadingEvents && <LoadingSpinner />}
          {!isLoadingEvents && events?.length === 0 && (
            <ThemedText style={{ alignSelf: "center", width: "80%", color: colors.subText }}>
              No events defined. To create an event, press the + icon.
            </ThemedText>
          )}
          {!isLoadingEvents && events?.length > 0 && (
            <View style={{ width: "85%", alignSelf: "center", flexDirection: "row" }}>
              <FlatList
                data={events}
                onEndReachedThreshold={0.2}
                ItemSeparatorComponent={() => <Spacer hspace={4} />}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => router.push(`/(main)/(clubs)/(events)/eventdetails?event=${JSON.stringify(item)}`)}
                  >
                    <Animated.View
                      entering={FadeInRight.duration(380).delay(index * 80)}
                      style={{ overflow: "hidden" }}
                    >
                      <EventCard event={item} />
                      <Spacer hspace={0} />
                    </Animated.View>
                  </TouchableOpacity>
                )}
                ListFooterComponent={() => (
                  <View style={{ width: 100, height: 100, alignItems: "center", justifyContent: "center" }}>
                    <TouchableOpacity onPress={() => router.push("/(main)/(clubs)/(events)")}>
                      <ThemedIcon size={25} name={"MaterialCommunityIcons:chevron-right-circle"} />
                    </TouchableOpacity>
                  </View>
                )}
                horizontal
              />
            </View>
          )} */}

          <Spacer space={4} />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "90%",
              justifyContent: "space-between",
              alignSelf: "center",
            }}
          >
            <ThemedHeading style={{ width: 200 }}>Expense Splits</ThemedHeading>
            <View style={{ width: "20%", flexDirection: "row", justifyContent: "flex-end" }}>
              {params.get("role") == ROLE_ADMIN && (
                <TouchableOpacity onPress={() => router.push(`/(main)/(clubs)/(fees)/adhocfee/definefee`)}>
                  <ThemedIcon size={25} name={"MaterialCommunityIcons:plus-circle"} color={colors.add} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          {isLoadingSplits && <LoadingSpinner />}
          {!isLoadingSplits && expenseSplits?.length === 0 && (
            <ThemedText style={{ alignSelf: "center", width: "80%", color: colors.subText }}>
              No splits defined. To split an expense, press the + icon.
            </ThemedText>
          )}
          {!isLoadingSplits && expenseSplits?.length > 0 && (
            <View style={{ width: "85%", alignSelf: "center", flexDirection: "row" }}>
              <FlatList
                data={expenseSplits}
                onEndReachedThreshold={0.2}
                ItemSeparatorComponent={() => <Spacer hspace={6} />}
                renderItem={({ item, index }) => (
                  <TouchableOpacity onPress={() => showAdhocFeeDetails(item)}>
                    <Animated.View
                      entering={FadeInRight.duration(380).delay(index * 80)}
                      style={{ overflow: "hidden" }}
                    >
                      <Card style={{ height: 180, paddingHorizontal: 30 }}>
                        <ThemedText style={{ fontSize: 15, fontWeight: "bold", alignSelf: "center"  }}>{item.clubAdhocFeeName}</ThemedText>
                        <ThemedText style={{ fontSize: 12, alignSelf: "center", color: colors.subText }}>{item.clubAdhocFeeDesc}</ThemedText>
                         <Spacer hspace={10} />
                         <CircularProgress value={Math.round(item.completionPercentage)} strokeWidth={6} size={50} />
                         <Spacer hspace={10} />
                          <View style={{ alignSelf: "center" }}>
                            <ThemedText style={{ fontSize: 15, textAlign: "center", fontWeight: "bold" }}>
                              Rs. {item.clubAdhocFeePaymentAmount}
                            </ThemedText>
                            <ThemedText style={{ fontSize: 12, textAlign: "center", color: colors.subText }}>
                              {item.clubAdhocFeeDate}
                            </ThemedText>
                          </View>
                      </Card>
                      <Spacer hspace={0} />
                    </Animated.View>
                  </TouchableOpacity>
                )}
                ListFooterComponent={() => (
                  <View style={{marginLeft: 20, height: 180,  alignItems: "center", alignSelf: "center", justifyContent: "center" }}>
                    <TouchableOpacity onPress={() => router.push(`/(main)/(clubs)/(fees)/adhocfee`)}>
                      <ThemedIcon size={25} name={"MaterialCommunityIcons:chevron-right-circle"} />
                    </TouchableOpacity>
                  </View>
                )}
                horizontal
              />
            </View>
          )}
          <Spacer space={50} />
        </ScrollView>
      </GestureHandlerRootView>
      <FloatingMenu
        actions={actions.filter((action) => (params.get("role") != ROLE_ADMIN ? action.role != ROLE_ADMIN : true))}
        position={"left"}
        color="black"
        icon={<MaterialIcons name={"menu"} size={32} color={"white"} />}
        onPressItem={(name: string | undefined) => handleMenuPress(name, params.get("clubId") || "")}
      />
    </ThemedView>
  );
};

const handleMenuPress = (name: string | undefined, clubId: string) => {
  if (name == "edit") {
    router.push(`/(main)/(clubs)/edit-club?clubId=${clubId}`);
  } else if (name == "events") {
    router.push(`/(main)/(clubs)/(events)`);
  } else if (name == "expensesplits") {
    router.push(`/(main)/(clubs)/(fees)/adhocfee`);
  } else {
    throw "Error";
  }
};

const actions = [
  {
    color: "black",
    text: "Events",
    icon: <SimpleLineIcons name={"event"} size={15} color={"white"} />,
    name: "events",
    position: 3,
  },
  {
    color: "black",
    text: "Expense Splits",
    icon: <MaterialIcons name={"attach-money"} size={15} color={"white"} />,
    name: "expensesplits",
    position: 3,
  },
  {
    color: "black",
    text: "Edit Club",
    icon: <MaterialCommunityIcons name={"square-edit-outline"} size={15} color={"white"} />,
    name: "edit",
    position: 4,
    role: ROLE_ADMIN,
  },
];

export default ClubHome;
