import ThemedView from "@/src/components/themed-components/ThemedView";
import { FlatList, GestureHandlerRootView, RefreshControl } from "react-native-gesture-handler";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import ThemedText from "@/src/components/themed-components/ThemedText";
import { TouchableOpacity, View } from "react-native";
import Spacer from "@/src/components/Spacer";

import { useGetMembersQuery } from "@/src/services/memberApi";
import usePaginatedQuery from "@/src/hooks/usePaginatedQuery";
import UserInfoView from "../../(clubs)/(members)/UserInfoView";
import { router } from "expo-router";
import Animated, { FadeInUp } from "react-native-reanimated";

const limit = 20;

const users = () => {
  const { items, isLoading, loadMore, isFetching, refreshing, onRefresh } = usePaginatedQuery(
    useGetMembersQuery,
    {},
    limit
  );

  const handleUserEdit = (user: any) => {
    router.push(`/(main)/(profile)/(superuser)/superuser-editmember?memberId=${user.memberId}`);
  };

  return (
    <GestureHandlerRootView>
      <ThemedView style={{ flex: 1 }}>
        <Spacer space={5} />
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
            ListFooterComponent={() => (isFetching && <LoadingSpinner />) || <View style={{ marginVertical: 30 }} />}
            data={items}
            ListEmptyComponent={() => <ThemedText style={{ textAlign: "center" }}>No transactions found!</ThemedText>}
            initialNumToRender={limit}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            onRefresh={onRefresh}
            refreshing={refreshing}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => handleUserEdit(item)}>
                <Animated.View entering={FadeInUp.duration(380).delay(index * 40)} style={{ overflow: "hidden", margin: 0 }}>
                  <UserInfoView {...item} />
                </Animated.View>
              </TouchableOpacity>
            )}
          />
        )}
      </ThemedView>
    </GestureHandlerRootView>
  );
};

export default users;
