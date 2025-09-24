import ThemedView from "@/src/components/themed-components/ThemedView";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import ThemedText from "@/src/components/themed-components/ThemedText";
import { TouchableOpacity, View } from "react-native";
import Spacer from "@/src/components/Spacer";
import Animated, { FadeInUp } from "react-native-reanimated";

import { useGetClubQuery } from "@/src/services/clubApi";
import usePaginatedQuery from "@/src/hooks/usePaginatedQuery";
import { router } from "expo-router";
import { useTheme } from "@/src/hooks/use-theme";
import Divider from "@/src/components/Divider";

const limit = 20;

const Clubs = () => {
    const { colors } = useTheme();
    const { items, isLoading, loadMore, isFetching, refreshing, onRefresh } = usePaginatedQuery(
        useGetClubQuery,
        {},
        limit
    );

  const handleClubPress = (club: any) => {
    //router.push(`/(main)/(profile)/(superuser)/superuser-editclub?clubId=${club.clubId}`);
  };

  const ClubRow = ({ club }: { club: any }) => (
    <TouchableOpacity onPress={() => handleClubPress(club)}>
      <Animated.View entering={FadeInUp.duration(380).delay(0)} style={{ overflow: "hidden", paddingVertical: 8 }}>
        <View
          style={{
            width: "85%",
            alignSelf: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <ThemedText style={{ fontSize: 16 }}>{club.clubName}</ThemedText>
            <ThemedText style={{ fontSize: 14, color: colors.subText }}>{club.createdBy}</ThemedText>
          </View>
          <ThemedText style={{ fontSize: 12, color: "grey" }}>
            {club.createdTs ? new Date(club.createdTs).toLocaleDateString() : ""}
          </ThemedText>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView>
      <ThemedView style={{ flex: 1 }}>
        <Spacer space={5} />
        {isLoading && !items ? (
          <LoadingSpinner />
        ) : (
          <FlatList
            style={{ width: "100%" }}
            ItemSeparatorComponent={() => <Divider />}
            ListFooterComponent={() => (isFetching && <LoadingSpinner />) || <View style={{ marginVertical: 30 }} />}
            data={items}
            ListEmptyComponent={() => <ThemedText style={{ textAlign: "center" }}>No clubs found!</ThemedText>}
            initialNumToRender={limit}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            onRefresh={onRefresh}
            refreshing={refreshing}
            renderItem={({ item, index }) => <ClubRow club={item} />}
          />
        )}
      </ThemedView>
    </GestureHandlerRootView>
  );
};

export default Clubs;
