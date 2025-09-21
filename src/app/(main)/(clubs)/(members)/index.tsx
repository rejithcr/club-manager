import { useContext } from "react";
import { View, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { router, useRouter } from "expo-router";
import FloatingMenu from "@/src/components/FloatingMenu";
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { ROLE_ADMIN } from "@/src/utils/constants";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { ClubContext } from "@/src/context/ClubContext";
import ThemedView from "@/src/components/themed-components/ThemedView";
import Spacer from "@/src/components/Spacer";
import UserInfoView from "./UserInfoView";
import { useGetClubMembersQuery } from "@/src/services/clubApi";
import usePaginatedQuery from "@/src/hooks/usePaginatedQuery";
import ThemedText from "@/src/components/themed-components/ThemedText";
import Animated, { FadeInUp } from "react-native-reanimated";

const limit = 20;

export default function Home() {
  const { clubInfo } = useContext(ClubContext);
  const router = useRouter();

  const { items, isLoading, loadMore, isFetching, refreshing, onRefresh } = usePaginatedQuery(
    useGetClubMembersQuery,
    { clubId: clubInfo.clubId },
    limit
  );

  const showDetails = (memberId: number) => router.push(`/(main)/(clubs)/(members)/memberdetails?memberId=${memberId}`);

  return (
    <ThemedView style={{ flex: 1 }}>
      <Spacer space={10} />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          style={{ width: "100%" }}
          ItemSeparatorComponent={() => (
            <View
              style={{
                marginVertical: 7,
                borderBottomWidth: 0.3,
                borderBottomColor: "grey",
                width: "85%",
                alignSelf: "center",
              }}
            />
          )}
          ListFooterComponent={() =>
            (isFetching && (
              <>
                <Spacer space={10} />
                <LoadingSpinner />
              </>
            )) || (
              <ThemedText style={{ alignSelf: "center", paddingBottom: 60, paddingTop: 10 }}>
                No more members
              </ThemedText>
            )
          }
          data={items}
          ListEmptyComponent={() => <ThemedText style={{ textAlign: "center" }}>No members found!</ThemedText>}
          initialNumToRender={limit}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          onRefresh={onRefresh}
          refreshing={refreshing}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInUp.duration(380).delay(index * 40)} style={{ overflow: "hidden", margin: 0 }}>
              <TouchableOpacity onPress={() => showDetails(item.memberId)}>
                <UserInfoView {...item} />
              </TouchableOpacity>
            </Animated.View>
          )}
        />
      )}
      {clubInfo.role == ROLE_ADMIN && (
        <FloatingMenu
          actions={actions}
          onPressItem={(name: string | undefined) => handleMenuPress(name)}
          icon={<MaterialIcons name={"menu"} size={32} color={"white"} />}
        />
      )}
    </ThemedView>
  );
}

const handleMenuPress = (name: string | undefined) => {
  if (name == "attributes") {
    router.push(`/(main)/(clubs)/(members)/memberattributes`);
  } else if (name == "add") {
    router.push(`/(main)/(clubs)/(members)/addmember`);
  } else if (name == "requests") {
    router.push(`/(main)/(clubs)/membershiprequests`);
  } else {
    throw "Error";
  }
};

const actions = [
  {
    color: "black",
    text: "Member Attributes",
    icon: <MaterialCommunityIcons name={"account-details"} size={15} color={"white"} />,
    name: "attributes",
    position: 1,
  },
  {
    color: "black",
    text: "Membership Requests",
    icon: <MaterialCommunityIcons name={"account-details"} size={15} color={"white"} />,
    name: "requests",
    position: 1,
  },
  {
    color: "black",
    text: "Add Memeber",
    icon: <AntDesign name={"user-add"} size={15} color={"white"} />,
    name: "add",
    position: 1,
  },
];
