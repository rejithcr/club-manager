import { View, TouchableOpacity, FlatList} from "react-native";
import React, { useContext } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { router } from "expo-router";
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
import RoundedContainer from "@/src/components/RoundedContainer";

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
        <Spacer space={7} />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <FlatList
            style={{ flex: 1 }}
            ItemSeparatorComponent={() => <Spacer space={7} />}
            ListFooterComponent={() =>
              (isFetching && (
                <>
                  <Spacer space={10} />
                  <LoadingSpinner />
                </>
              )) || <ThemedText style={{ alignSelf: "center", paddingVertical: 10 }}>No more items</ThemedText>
            }
            data={items}
            initialNumToRender={limit}
            ListEmptyComponent={() => (
              <ThemedText style={{ alignSelf: "center", width: "80%", color: colors.subText }}>
                No splits defined. This will be a one time collection from selected members. For eg. splitting expense
                among members who participated in an event. Press the + icon to define collection
              </ThemedText>
            )}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            onRefresh={onRefresh}
            refreshing={refreshing}
            renderItem={({ item }) => (
              <RoundedContainer>
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
                      <ThemedText style={{ fontSize: 16, fontWeight: "bold" }}>{item.clubAdhocFeeName}</ThemedText>
                      <ThemedText style={{ fontSize: 12, color: colors.subText}}>{item.clubAdhocFeeDesc}</ThemedText>
                      <ThemedText style={{ fontSize: 10, marginTop: 5 }}>
                        {item.clubAdhocFeeDate} 
                      </ThemedText>
                    </View>
                    <View style={{ width: "25%" }}>
                      <ThemedText style={{ textAlign: "right" }}>Rs. {item.clubAdhocFeePaymentAmount}</ThemedText>
                      <Spacer space={2} />
                      <ProgressBar height={8} value={Math.round(item.completionPercentage)} />
                    </View>
                  </View>
                </TouchableCard>
              </RoundedContainer>
            )}
          />
        )}
      </GestureHandlerRootView>
    </ThemedView>
  );
};

export default AdocFeesHome;
