import React, { useEffect, useState } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import ThemedView from "@/src/components/themed-components/ThemedView";
import ThemedText from "@/src/components/themed-components/ThemedText";
import ThemedHeading from "@/src/components/themed-components/ThemedHeading";
import { router, useLocalSearchParams } from "expo-router";
import { useGetClubDuesQuery } from "@/src/services/feeApi";
import Banner from "@/src/components/Banner";
import RoundedContainer from "@/src/components/RoundedContainer";
import Spacer from "@/src/components/Spacer";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import Divider from "@/src/components/Divider";
import { useTheme } from "@/src/hooks/use-theme";
import ThemedIcon from "@/src/components/themed-components/ThemedIcon";
import ThemedButton from "@/src/components/ThemedButton";
import { makeUpiPayment } from "@/src/utils/payment";

const DuesByClub = () => {
  const params = useLocalSearchParams();
  const clubId = params?.clubId as string | undefined;
  const memberId = params?.memberId as string | undefined;
  const { colors } = useTheme();
  const {
    data: duesByMembers,
    isLoading,
    isFetching,
    refetch,
  } = useGetClubDuesQuery({ clubId, memberId, duesByMember: "true" }, { skip: !clubId });
  const [clubDues, setClubDues] = useState<any>();

  useEffect(() => {
    if (duesByMembers?.length > 0) {
      setClubDues(duesByMembers[0]);
    }
  }, [duesByMembers]);

  return (
    <ThemedView style={{ flex: 1 }}>
      <Spacer space={8} />
      <ThemedHeading>{clubDues?.clubName}</ThemedHeading>
      <Spacer space={8} />
      <Banner backgroundColor={clubDues?.dueAmount === 0 ? colors.success : colors.info}>
        <View>
          <ThemedText style={{ fontSize: 14, color: colors.background }}>Total Due</ThemedText>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <ThemedText style={{ fontSize: 28, fontWeight: "700", color: colors.background }}>
              Rs. {clubDues?.dueAmount || "0"}
            </ThemedText>
          )}
        </View>
        <ThemedIcon name="MaterialCommunityIcons:account-cash" size={50} color={colors.background} />
      </Banner>

      <Spacer space={10} />

      <ScrollView refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}>
        {isLoading ? (
          <LoadingSpinner />
        ) : clubDues && clubDues.dues.length > 0 ? (
          <View>
            <RoundedContainer>
              {clubDues.dues.map((d: any, idx: number) => (
                <>
                  {idx > 0 && <Divider />}
                  <View
                    key={d.paymentId?.toString() + d.feeType}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                    }}
                  >
                    <View>
                      <ThemedText style={{ fontSize: 16 }}>{d.fee}</ThemedText>
                      <ThemedText style={{ color: colors.subText, fontSize: 12 }}>{d.feeDesc}</ThemedText>
                    </View>
                    <ThemedText>Rs. {d.amount}</ThemedText>
                  </View>
                </>
              ))}
            </RoundedContainer>
            <Spacer space={20} />
            <ThemedButton
              title={"Pay Now"}
              onPress={() => makeUpiPayment(clubDues.dueAmount, clubDues.clubName, clubDues.upiId)}
            />
          </View>
        ) : (
          <>
            <ThemedText style={{ textAlign: "center", marginTop: 12 }}>Yay!! you don't have any outstanding dues with the club 👏</ThemedText>
            <Spacer space={10} />
            <ThemedButton
              title={"Home"}
              onPress={() => router.back()}
            />
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
};

export default DuesByClub;
