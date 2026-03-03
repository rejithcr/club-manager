import { RefreshControl, ScrollView, View } from "react-native";
import { useRouter } from "expo-router/build/hooks";
import FloatingMenu from "@/src/components/FloatingMenu";
import FeeSummary from "./dues";
import { useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useGlobalSearchParams } from "expo-router";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import ThemedView from "@/src/components/themed-components/ThemedView";
import Spacer from "@/src/components/Spacer";
import ThemedHeading from "@/src/components/themed-components/ThemedHeading";
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
    await setClubInfo({ clubId: club.clubId, clubName: club.clubName, role: club.roleName, logo: club.logo });
    router.push(`/(main)/(clubs)`);
  };

  // Filter dues based on selected club
  const filteredDues = selectedClubId === -1
    ? duesByMember
    : duesByMember?.filter((due: any) => due.clubId === selectedClubId);

  return (
    <ThemedView style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <ScrollView refreshControl={<RefreshControl refreshing={isFetchingClubs || isFetchingMemberDues || isFetchingBirthdays || isFetchingEvents} onRefresh={onRefresh} />}>
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
            <>
              <ThemedHeading>My Clubs</ThemedHeading>
              <View
                style={{ width: '85%', alignSelf: 'center' }}
              >
                <View style={{ flexDirection: 'row', gap: 15, flexWrap: 'wrap', }}>
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
            </>
          )}

          {/* {!isLoadingMyClubs && <MyClubs clubs={clubs} />} */}
          <Spacer space={10} />
          {clubs?.length > 0 && <ThemedHeading>My Dues</ThemedHeading>}
          {isLoadingMemberDues && <LoadingSpinner />}
          {!isLoadingMemberDues && clubs?.length > 0 && (
            <FeeSummary
              duesByMember={filteredDues}
              isAllSelected={selectedClubId === -1}
            />
          )}

          {/* Unified Events and Birthdays Feed */}
          {(isLoadingEvents || isBirthdaysLoading) && (
            <>
              <Spacer space={10} />
              <LoadingSpinner />
            </>
          )}
          <Spacer space={10} />
          {events && events.length > 0 && (
            <>
              <ThemedHeading>Upcoming Events</ThemedHeading>
              <UnifiedFeed
                events={events}
                birthdays={[]}
                clubs={clubs || []}
              />
            </>
          )}
          <Spacer space={10} />
          {upcomingBirthdays && upcomingBirthdays.length > 0 && (
            <>
              <ThemedHeading>Upcoming Birthdays</ThemedHeading>
              <UnifiedFeed
                events={[]}
                birthdays={upcomingBirthdays}
                clubs={clubs || []}
              />
            </>
          )}
          {/*<UpcomingMatches memberEmail={userInfo?.email} />*/}
          <Spacer space={50} />
        </ScrollView>
      </GestureHandlerRootView>
      <FloatingMenu
        actions={actions}
        position={"left"}
        color="black"
        icon={<MaterialIcons name={"menu"} size={32} color={"white"} />}
        onPressItem={(name: string | undefined) => handleMenuPress(name, handleLogout)}
      />
    </ThemedView>
  );
};

export default Main;

const handleMenuPress = (name: string | undefined, handleLogout: { (): void }) => {
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
  },
  {
    color: "black",
    text: "Cricket",
    icon: <MaterialCommunityIcons name={"face-man-profile"} size={15} color={"white"} />,
    name: "cricket",
    position: 1,
  },
];
