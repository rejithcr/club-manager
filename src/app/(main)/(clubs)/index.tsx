import { View, GestureResponderEvent, TouchableOpacity, RefreshControl } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "expo-router/build/hooks";
import { deleteClub, getClubCounts, getTotalDue, updateClub } from "@/src/helpers/club_helper";
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
import { getFeeStructure } from "@/src/helpers/fee_helper";
import Alert, { AlertProps } from "@/src/components/Alert";
import ThemedHeading from "@/src/components/themed-components/ThemedHeading";
import { useHttpGet } from "@/src/hooks/use-http";
import Card from "@/src/components/Card";
import CircularProgress from "@/src/components/charts/CircularProgress";
import FloatingMenu from "@/src/components/FloatingMenu";
import Modal from "react-native-modal";
import InputText from "@/src/components/InputText";
import ThemedButton from "@/src/components/ThemedButton";
import { UserContext } from "@/src/context/UserContext";
import { EventCard } from "../upcoming_events";
import { router } from "expo-router";

const ClubHome = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [alertConfig, setAlertConfig] = useState<AlertProps>();
  const { setClubInfo } = useContext(ClubContext);

  const { colors } = useTheme();

  const [isTotalDueLoading, setIsTotalDueLoading] = useState(false);
  const [isClubCountsLoading, setIsClubCountsLoading] = useState(false);
  const [totalDue, setTotalDue] = useState<number | undefined>(0);
  const [clubCounts, setClubCounts] = useState<any[]>([]);

  const [currentFeeStructure, setCurrentFeeStructure] = useState<any>([]);
  const [isLoadingCurrent, setIsLoadingCurrent] = useState(false);

  /* events */
  const { data: events, isLoading: isLoadingEvents } = useHttpGet("/club/event", {
    clubId: params.get("clubId"),
    limit: 5,
    offset: 0,
  });

  const {
    data: fbr,
    isLoading: isFundBalanceLoading,
    refetch: fetchFundBalance,
  } = useHttpGet("/club", { clubId: params.get("clubId"), fundBalance: "true" });

  const {
    data: expenseSplits,
    isLoading: isLoadingSplits,
    refetch: fetchSplits,
  } = useHttpGet("/fee/adhoc", { clubId: Number(params.get("clubId")), limit: 5, offset: 0 });

  const fetchTotalDue = () => {
    setIsTotalDueLoading(true);
    getTotalDue(params.get("clubId"))
      .then((response) => setTotalDue(response.data.totalDue))
      .catch((error) =>
        setAlertConfig({
          visible: true,
          title: "Error",
          message: error.response.data.error,
          buttons: [{ text: "OK", onPress: () => setAlertConfig({ visible: false }) }],
        })
      )
      .finally(() => setIsTotalDueLoading(false));
  };
  const fetchClubCounts = () => {
    setIsClubCountsLoading(true);
    getClubCounts(params.get("clubId"))
      .then((response) => {
        setClubCounts(response.data);
      })
      .catch((error) =>
        setAlertConfig({
          visible: true,
          title: "Error",
          message: error.response.data.error,
          buttons: [{ text: "OK", onPress: () => setAlertConfig({ visible: false }) }],
        })
      )
      .finally(() => setIsClubCountsLoading(false));
  };
  const showFeeTypeDetails = (fee: any) => {
    router.push({
      pathname: "/(main)/(clubs)/(fees)/feetypedetails",
      params: { fee: JSON.stringify(fee) },
    });
  };

  const fetchFees = () => {
    setIsLoadingCurrent(true);
    getFeeStructure(Number(params.get("clubId")))
      .then((response) => setCurrentFeeStructure(response.data))
      .catch((error) =>
        setAlertConfig({
          visible: true,
          title: "Error",
          message: error.response.data.error,
          buttons: [{ text: "OK", onPress: () => setAlertConfig({ visible: false }) }],
        })
      )
      .finally(() => setIsLoadingCurrent(false));
  };

  useEffect(() => {
    setClubInfo({ clubId: params.get("clubId"), clubName: params.get("clubName"), role: params.get("role") });
    fetchFundBalance();
    fetchTotalDue();
    fetchFees();
    fetchClubCounts();
  }, []);

  const showClubDues = (_: GestureResponderEvent): void => {
    router.push(`/(main)/(clubs)/(fees)/clubdues`);
  };

  const onRefresh = () => {
    fetchFundBalance();
    fetchTotalDue();
    fetchFees();
  };

  const showAdhocFeeDetails = (adhocFee: any) => {
    router.push({
      pathname: "/(main)/(clubs)/(fees)/adhocfee/payments",
      params: { adhocFee: JSON.stringify(adhocFee) },
    });
  };

  const [isEditClubVisible, setIsEditClubVisible] = useState(false);
  const handleEditClub = () => {
    setIsEditClubVisible(true);
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
        <ScrollView refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}>
          <TouchableCard onPress={Number(totalDue) > 0 ? showClubDues : null}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
              <ThemedText style={{ fontSize: 15 }}>Total Due</ThemedText>
              {isTotalDueLoading && <LoadingSpinner />}
              {!isTotalDueLoading && (
                <ThemedText
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                    position: "absolute",
                    right: Number(totalDue) > 0 ? 30 : 5,
                  }}
                >
                  {" "}
                  Rs. {totalDue}
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
                    {params.get("role") == ROLE_ADMIN && (
                      <TouchableOpacity onPress={() => router.push(`/(main)/(clubs)/(fees)/adhocfee`)}>
                        <ThemedIcon size={25} name={"MaterialCommunityIcons:chevron-right-circle"} />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                horizontal
              />
            </View>
          )}
          <Spacer space={50} />
        </ScrollView>

        {isEditClubVisible && (
          <EditClubModal
            clubId={params.get("clubId")}
            clubName={params.get("clubName")}
            clubDesc={params.get("clubDesc")}
            clubLocation={params.get("clubLocation")}
            isVisible={isEditClubVisible}
            onCancel={() => setIsEditClubVisible(false)}
          />
        )}
        {alertConfig?.visible && <Alert {...alertConfig} />}
      </GestureHandlerRootView>
      <FloatingMenu
        actions={actions}
        position={"left"}
        color="black"
        icon={<MaterialIcons name={"menu"} size={32} color={"white"} />}
        onPressItem={(name: string | undefined) => handleMenuPress(name, handleEditClub)}
      />
    </ThemedView>
  );
};

const handleMenuPress = (name: string | undefined, handleEditClub: any) => {
  if (name == "edit") {
    handleEditClub();
  } else if (name == "events") {
    router.push(`/(main)/(clubs)/(events)`)
  } else if (name == "expensesplits") {
    router.push(`/(main)/(clubs)/(fees)/adhocfee`)
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
      position: 3
  },{
      color: "black",
      text: "Expense Splits",
      icon: <MaterialIcons name={"attach-money"} size={15} color={"white"} />,
      name: "expensesplits",
      position: 3
  },{
    color: "black",
    text: "Edit Club",
    icon: <MaterialCommunityIcons name={"square-edit-outline"} size={15} color={"white"} />,
    name: "edit",
    position: 4,
  },
];

export default ClubHome;

const EditClubModal = ({
  isVisible,
  onCancel,
  clubId,
  clubName,
  clubDesc,
  clubLocation,
}: {
  isVisible: boolean;
  onCancel: (value: boolean) => void;
  clubId: string | null;
  clubName: string | null;
  clubDesc: string | null;
  clubLocation: string | null;
}) => {
  const [name, setClubName] = useState<string | null>(clubName);
  const [desc, setClubDesc] = useState<string | null>(clubDesc);
  const [location, setClubLocation] = useState<string | null>(clubLocation);
  const { colors } = useTheme();
  const { userInfo } = useContext(UserContext);
  const [alertConfig, setAlertConfig] = useState<AlertProps>();
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const handleUpdate = () => {
    setIsUpdating(true);
    updateClub(clubId, name, desc, location, userInfo.email)
      .then((response) => {
        setAlertConfig({
          visible: true,
          title: "Success",
          message: response.data.message,
          buttons: [
            {
              text: "OK",
              onPress: () => {
                onCancel(false);
                setAlertConfig({ visible: false });
              },
            },
          ],
        });
      })
      .catch((error) => {
        setAlertConfig({
          visible: true,
          title: "Error",
          message: error.response.data.error,
          buttons: [{ text: "OK", onPress: () => setAlertConfig({ visible: false }) }],
        });
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };
  const handleDelete = () => {
    setAlertConfig({
      visible: true,
      title: "Are you sure!",
      message: "This will delete the club. This cannot be recovered.",
      buttons: [
        {
          text: "OK",
          onPress: () => {
            setAlertConfig({ visible: false });
            setIsUpdating(true);
            deleteClub(Number(clubId), userInfo.email)
              .then((response) => {
                router.dismissTo(`/(main)`);
                setAlertConfig({
                  visible: true,
                  title: "Success",
                  message: response.data.message,
                  buttons: [
                    {
                      text: "OK",
                      onPress: () => {
                        onCancel(false);
                        setAlertConfig({ visible: false });
                      },
                    },
                  ],
                });
              })
              .catch((error) => {
                setAlertConfig({
                  visible: true,
                  title: "Error",
                  message: error.response.data.error,
                  buttons: [{ text: "OK", onPress: () => setAlertConfig({ visible: false }) }],
                });
              })
              .finally(() => {
                setIsUpdating(false);
              });
          },
        },
        { text: "Cancel", onPress: () => setAlertConfig({ visible: false }) },
      ],
    });
  };
  return (
    <Modal isVisible={isVisible}>
      {isUpdating && <LoadingSpinner />}
      {!isUpdating && (
        <ThemedView style={{ padding: 20, borderRadius: 5 }}>
          <ThemedHeading>Edit Club</ThemedHeading>
          <InputText label="Club Name" value={name} onChangeText={setClubName} />
          <InputText label="Description" value={desc} onChangeText={setClubDesc} />
          <InputText label="Location" value={location} onChangeText={setClubLocation} />
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
            <ThemedButton title="Save" onPress={() => handleUpdate()} />
            <ThemedButton title="Cancel" onPress={() => onCancel(false)} />
            <ThemedIcon
              name="MaterialCommunityIcons:delete"
              size={30}
              onPress={() => handleDelete()}
              color={colors.error}
            />
          </View>
        </ThemedView>
      )}
      {alertConfig?.visible && <Alert {...alertConfig} />}
    </Modal>
  );
};
