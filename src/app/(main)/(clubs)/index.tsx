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
import { useGetFeesAdhocQuery, useGetFeesQuery, useGetFundBalanceQuery, useGetTotalDueQuery } from "@/src/services/feeApi";

const ClubHome = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const { setClubInfo } = useContext(ClubContext);

  const { colors } = useTheme();
  
  const {
    data: events,
    isLoading: isLoadingEvents,
    refetch: fetchEvents,
  } = useGetClubEventsQuery({ clubId: params.get("clubId"), limit: 5, offset: 0 });

  const {
    data: fbr,
    isLoading: isFundBalanceLoading,
    refetch: fetchFundBalance,
  } = useGetFundBalanceQuery({ clubId: params.get("clubId"), fundBalance: "true" });

  const {
    data: expenseSplits,
    isLoading: isLoadingSplits,
    refetch: fetchSplits,
  } = useGetFeesAdhocQuery({ clubId: Number(params.get("clubId")), limit: 5, offset: 0 });

  const {
    data: clubDue,
    isLoading: isTotalDueLoading,
    refetch: fetchTotalDue,
  } = useGetTotalDueQuery({ clubId: params.get("clubId"), totalDue: "true" });

  const {
    data: currentFeeStructure,
    isLoading: isLoadingCurrent,
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
    setRefreshing(true);
    fetchFundBalance();
    fetchTotalDue();
    fetchFees();
    fetchSplits();
    fetchEvents();
    setRefreshing(false);
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
        <Spacer space={5} />
        <View
          style={{
            flexDirection: "row",
            width: "90%",
            alignSelf: "center",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ThemedHeading style={{ width: 200 }}>Fund Balance</ThemedHeading>
          {isFundBalanceLoading && <LoadingSpinner />}
          {!isFundBalanceLoading && (
            <ThemedText
              style={{ fontWeight: "bold", fontSize: 16, color: fbr?.fundBalance > 0 ? colors.success : colors.error }}
            >
              Rs. {fbr?.fundBalance || 0}
            </ThemedText>
          )}
        </View>
        <Spacer space={5} />
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <TouchableCard onPress={Number(clubDue?.totalDue) > 0 ? showClubDues : null}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
              <ThemedText style={{ fontSize: 15 }}>Total Due</ThemedText>
              {isTotalDueLoading && <LoadingSpinner />}
              {!isTotalDueLoading && (
                <ThemedText
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                    position: "absolute",
                    right: Number(clubDue?.totalDue) > 0 ? 30 : 5,
                  }}
                >
                  {" "}
                  Rs. {clubDue?.totalDue}
                </ThemedText>
              )}
            </View>
          </TouchableCard>
          <Spacer space={4} />
          <TouchableCard onPress={() => router.push(`/(main)/(clubs)/(transactions)`)}>
            <ThemedText>Transactions</ThemedText>
          </TouchableCard>
          <Spacer space={4} />
          <TouchableCard onPress={() => router.push(`/(main)/(clubs)/(members)`)}>
            <ThemedText>Members</ThemedText>
          </TouchableCard>
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
            <ThemedText style={{ alignSelf: "center", width: "80%" }}>
              No fees defined. To define a fee type (eg. Membership fee), press the + icon.
            </ThemedText>
          )}
          {!isLoadingCurrent &&
            currentFeeStructure?.map((fee: any) => {
              return (
                <View key={fee.clubFeeTypeId}>
                  <TouchableCard onPress={showFeeTypeDetails} id={fee}>
                    <View
                      style={{
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <View>
                        <ThemedText style={{ fontWeight: "bold" }}>{fee.clubFeeType}</ThemedText>
                        <ThemedText style={{ fontSize: 10, marginTop: 5 }}>{fee.clubFeeTypeInterval}</ThemedText>
                      </View>
                      <ThemedText style={{ fontWeight: "bold", fontSize: 15, position: "absolute", right: 30 }}>
                        Rs. {fee.clubFeeAmount}
                      </ThemedText>
                    </View>
                  </TouchableCard>
                  <Spacer space={4} />
                </View>
              );
            })}
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
            <ThemedText style={{ alignSelf: "center", width: "80%" }}>
              No events defined. To create an event, press the + icon.
            </ThemedText>
          )}
          {!isLoadingEvents && events?.length > 0 && (
            <View style={{ width: "85%", alignSelf: "center", flexDirection: "row" }}>
              <FlatList
                data={events}
                onEndReachedThreshold={0.2}
                ItemSeparatorComponent={() => <Spacer hspace={4} />}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => router.push(`/(main)/(clubs)/(events)/eventdetails?event=${JSON.stringify(item)}`)}
                  >
                    <EventCard event={item} />
                    <Spacer hspace={0} />
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
          )}

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
            <ThemedText style={{ alignSelf: "center", width: "80%" }}>
              No splits defined. To split an expense, press the + icon.
            </ThemedText>
          )}
          {!isLoadingSplits && expenseSplits?.length > 0 && (
            <View style={{ width: "85%", alignSelf: "center", flexDirection: "row" }}>
              <FlatList
                data={expenseSplits}
                onEndReachedThreshold={0.2}
                ItemSeparatorComponent={() => <Spacer hspace={4} />}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => showAdhocFeeDetails(item)}>
                    <Card style={{ minHeight: 100 }}>
                      <ThemedText style={{ fontWeight: "bold" }}>{item.clubAdhocFeeName}</ThemedText>
                      <ThemedText style={{ fontSize: 10 }}>{item.clubAdhocFeeDesc}</ThemedText>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginTop: 10,
                          alignItems: "center",
                          minWidth: 100,
                        }}
                      >
                        <CircularProgress value={Math.round(item.completionPercentage)} strokeWidth={6} size={35} />
                        <View>
                          <ThemedText style={{ fontSize: 12, textAlign: "right", fontWeight: "bold" }}>
                            Rs. {item.clubAdhocFeePaymentAmount}
                          </ThemedText>
                          <ThemedText style={{ fontSize: 10, textAlign: "right" }}>{item.clubAdhocFeeDate}</ThemedText>
                        </View>
                      </View>
                    </Card>
                    <Spacer hspace={0} />
                  </TouchableOpacity>
                )}
                ListFooterComponent={() => (
                  <View style={{ width: 100, height: 100, alignItems: "center", justifyContent: "center" }}>                    
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
        actions={actions.filter((action) => params.get("role") != ROLE_ADMIN ? action.role != ROLE_ADMIN : true)}
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
    role: ROLE_ADMIN
  },
];

export default ClubHome;