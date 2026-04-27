import { RefreshControl, ScrollView, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router/build/hooks";
import FloatingMenu from "@/src/components/FloatingMenu";
import { useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalSearchParams } from "expo-router";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import ThemedView from "@/src/components/themed-components/ThemedView";
import Spacer from "@/src/components/Spacer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import UnifiedFeed from "./unified_feed";
import { clearTokens } from "@/src/helpers/auth_helper";
import {
  useGetClubEventsQuery,
  useGetClubMembersQuery,
  useGetClubQuery,
} from "@/src/services/clubApi";
import { useGetUpcomingBirthdaysQuery } from "@/src/services/memberApi";
import { useTheme } from "@/src/hooks/use-theme";
import { ClubContext } from "@/src/context/ClubContext";
import MultiButton from "@/src/components/MultiButton";
import { useAsyncStorage } from "@/src/hooks/use-async-storage";
import ThemedText from "@/src/components/themed-components/ThemedText";
import ThemedIcon from "@/src/components/themed-components/ThemedIcon";
import CardList from "@/src/components/CardList";
import Animated, { FadeInUp } from "react-native-reanimated";
import ExpandableCard from "@/src/components/ExpandableCard";
import Divider from "@/src/components/Divider";
import { makeUpiPayment } from "@/src/utils/payment";
import ThemedButton from "@/src/components/ThemedButton";

const Main = () => {
  const router = useRouter();
  const searchParams = useGlobalSearchParams();
  const { userInfo } = useContext(UserContext);
  const { colors } = useTheme();
  const { setClubInfo } = useContext(ClubContext);
  const [selectedClubId, setSelectedClubId] = useAsyncStorage<number>("selectedClubId", -1); // -1 means "All"

  const {
    data: clubs,
    isLoading: isLoadingMyClubs,
    refetch: refetchClubs,
    isFetching: isFetchingClubs,
    error: clubsError,
  } = useGetClubQuery({ memberId: userInfo?.memberId });

  const {
    data: duesByMember,
    isLoading: isLoadingMemberDues,
    isFetching: isFetchingMemberDues,
    refetch: refetchMemberDues,
  } = useGetClubMembersQuery({ clubId: "-1", memberId: userInfo?.memberId, duesByMember: "true" });

  const {
    data: upcomingBirthdays,
    isLoading: isBirthdaysLoading,
    isFetching: isFetchingBirthdays,
    refetch: refetchBirthdays,
  } = useGetUpcomingBirthdaysQuery({
    memberId: userInfo?.memberId,
    clubId: selectedClubId // Filter by selected club
  });

  const { data: events, isLoading: isLoadingEvents, isFetching: isFetchingEvents, refetch: refetchEvents
  } = useGetClubEventsQuery({
    memberId: userInfo?.memberId,
    clubId: selectedClubId // Filter by selected club
  });

  const onRefresh = () => {
    refetchMemberDues();
    refetchClubs();
    refetchBirthdays();
    refetchEvents();
  };
  const handleLogout = async () => {
    await AsyncStorage.removeItem("userInfo");
    await clearTokens();
    router.replace("/(auth)");
  };

  useEffect(() => {
    if (searchParams.showClubDues) {
      router.push(`/(main)/(profile)/duesbyclub?clubId=${searchParams.showClubDues}&memberId=${userInfo?.memberId}`);
    }
  }, [searchParams.showClubDues, userInfo?.memberId]);

  const handleClubSelect = (clubId: number) => {
    setSelectedClubId(clubId);
  };

  const handleGoToClubHome = async (club: any) => {
    await setClubInfo({ clubId: club.clubId, clubName: club.clubName, logo: club.logo });
    router.push(`/(main)/(clubs)`);
  };

  // Filter dues based on selected club
  const filteredDues = selectedClubId === -1
    ? duesByMember
    : duesByMember?.filter((due: any) => due.clubId === selectedClubId);

  return (
    <ThemedView style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isFetchingClubs || isFetchingMemberDues || isFetchingBirthdays || isFetchingEvents}
              onRefresh={onRefresh}
            />
          }
        >
          {isLoadingMyClubs && <LoadingSpinner />}
          {clubs?.length == 0 && (
            <ThemedView style={{ alignSelf: "center", width: "80%", justifyContent: "center", alignItems: "center" }}>
              <ThemedText style={{ marginTop: 20 }}>Request to join a club</ThemedText>
              <ThemedIcon
                name="MaterialIcons:add-home"
                size={50}
                onPress={() => router.push(`/(main)/(members)/joinclub`)}
              />
              <ThemedText style={{ marginTop: 20 }}>Create a new club</ThemedText>
              <ThemedIcon name="MaterialIcons:add-circle" size={50} onPress={() => router.push(`/(main)/createclub`)} />
            </ThemedView>
          )}

          {/* Club Filter Selector */}
          {clubs && clubs.length > 0 && (
            <CardList
              headerTitle="My Clubs"
              headerIcon="MaterialIcons:groups"
              headerRight={
                <TouchableOpacity
                  onPress={() => router.push(`/(main)/(members)/joinclub`)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                >
                  <ThemedIcon name="MaterialIcons:add-circle-outline" size={18} color={colors.button} />
                  <ThemedText style={{ fontSize: 16, fontWeight: '600', color: colors.button }}>Join</ThemedText>
                </TouchableOpacity>
              }
            >
              <View style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
                  {/* All Clubs Option */}
                  <MultiButton
                    label="All"
                    icon="MaterialIcons:select-all"
                    isSelected={selectedClubId === -1}
                    onSelect={() => handleClubSelect(-1)}
                    colors={colors}
                  />

                  {/* Individual Club Options */}
                  {clubs.map((club: any) => (
                    <MultiButton
                      key={club.clubId}
                      club={club}
                      isSelected={selectedClubId === club.clubId}
                      onSelect={() => handleClubSelect(club.clubId)}
                      onGoToHome={() => handleGoToClubHome(club)}
                      colors={colors}
                    />
                  ))}
                </View>
              </View>
            </CardList>
          )}

          <Spacer space={10} />
          {clubs && clubs.length > 0 && (
            <CardList
              headerTitle="My Dues"
              headerIcon="MaterialIcons:payments"
              headerRight={
                <ThemedText style={{ fontSize: 15, fontWeight: '500', color: colors.text }}>
                  ₹ {Math.round(filteredDues?.reduce((sum: number, club: any) => sum + club.dueAmount, 0) || 0)}
                </ThemedText>
              }
            >
              {isLoadingMemberDues && <LoadingSpinner />}

              {!isLoadingMemberDues && (!filteredDues || filteredDues.length === 0) && (
                <View style={{ padding: 24, alignItems: 'center' }}>
                  <ThemedIcon name="MaterialIcons:check-circle" size={40} color="#4CAF50" />
                  <Spacer space={8} />
                  <ThemedText style={{ fontWeight: '600' }}>All Clear! 🎉</ThemedText>
                  <ThemedText style={{ fontSize: 13, color: colors.subText }}>No pending dues</ThemedText>
                </View>
              )}

              {filteredDues?.map((clubDue: any, idx: number) => (
                <Animated.View
                  key={clubDue.clubId}
                  entering={FadeInUp.duration(380).delay(idx * 50)}
                >
                  <ExpandableCard
                    title={clubDue.clubName}
                    subtitle={`₹ ${clubDue.dueAmount.toFixed(2)} • ${clubDue.dues.length} items`}
                    statusIconName="MaterialIcons:account-balance-wallet"
                    statusIconColor={colors.warning}
                    isExpandable={true}
                  >
                    <View style={{ gap: 8 }}>
                      {clubDue.dues.map((due: any, dueIdx: number) => (
                        <View key={due.paymentId + due.feeType}>
                          {dueIdx > 0 && <Divider style={{ marginVertical: 8 }} />}
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1, paddingRight: 8 }}>
                              <ThemedText style={{ fontSize: 14, fontWeight: '500' }}>{due.fee}</ThemedText>
                              {due.feeDesc && (
                                <ThemedText style={{ fontSize: 12, color: colors.subText }}>{due.feeDesc}</ThemedText>
                              )}
                            </View>
                            <ThemedText style={{ fontSize: 14, fontWeight: '600' }}>₹ {due.amount.toFixed(2)}</ThemedText>
                          </View>
                        </View>
                      ))}

                      {clubDue.upiId && (
                        <>
                          <Spacer space={8} />
                          <ThemedButton
                            onPress={() => makeUpiPayment(clubDue.dueAmount, clubDue.clubName, clubDue.upiId)}
                            title="Pay Now"
                            icon="MaterialIcons:payment"
                            style={{ paddingVertical: 8 }}
                          />
                        </>
                      )}
                    </View>
                  </ExpandableCard>
                </Animated.View>
              ))}
            </CardList>
          )}

          <Spacer space={10} />
          {/* Unified Events and Birthdays Feed */}
          {(isLoadingEvents || isBirthdaysLoading) && (
            <>
              <LoadingSpinner />
              <Spacer space={10} />
            </>
          )}

          {events && events.length > 0 && (
            <UnifiedFeed
              events={events}
              birthdays={[]}
              clubs={clubs || []}
            />
          )}

          <Spacer space={10} />
          {upcomingBirthdays && (
            <UnifiedFeed
              events={[]}
              birthdays={upcomingBirthdays}
              clubs={clubs || []}
              hideIfEmpty={false}
            />
          )}

          <Spacer space={50} />
        </ScrollView>
      </GestureHandlerRootView>
      <FloatingMenu
        actions={actions}
        position={"left"}
        color="black"
        icon={<MaterialIcons name={"menu"} size={32} color={"white"} />}
        onPressItem={(name: string | undefined) => handleMenuPress(name, handleLogout, router)}
      />
    </ThemedView>
  );
};

export default Main;

const handleMenuPress = (name: string | undefined, handleLogout: () => void, router: any) => {
  if (name == "createclub") {
    router.push(`/(main)/createclub`);
  } else if (name == "logout") {
    handleLogout();
  } else if (name == "profile") {
    router.push(`/(main)/(profile)`);
  } else if (name == "joinclub") {
    router.push(`/(main)/(members)/joinclub`);
  } else {
    throw "Error";
  }
};

const actions = [
  {
    color: "black",
    text: "Logout",
    icon: <MaterialIcons name={"logout"} size={15} color={"white"} />,
    name: "logout",
    position: 1,
  },
  {
    color: "black",
    text: "Create Club",
    icon: <MaterialIcons name={"add"} size={15} color={"white"} />,
    name: "createclub",
    position: 1,
  },
  {
    color: "black",
    text: "Join Club",
    icon: <MaterialIcons name={"join-inner"} size={15} color={"white"} />,
    name: "joinclub",
    position: 1,
  },
  {
    color: "black",
    text: "Profile",
    icon: <MaterialCommunityIcons name={"face-man-profile"} size={15} color={"white"} />,
    name: "profile",
    position: 1,
  }
];
