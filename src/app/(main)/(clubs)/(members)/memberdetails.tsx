import { View, Image, StyleSheet } from "react-native";
import React, { useContext, useState } from "react";
import { useSearchParams } from "expo-router/build/hooks";
import KeyValueUI from "@/src/components/KeyValueUI";
import ThemedView from "@/src/components/themed-components/ThemedView";
import ThemedText from "@/src/components/themed-components/ThemedText";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import ThemedIcon from "@/src/components/themed-components/ThemedIcon";
import Spacer from "@/src/components/Spacer";
import ThemedButton from "@/src/components/ThemedButton";
import { router } from "expo-router";
import { useTheme } from "@/src/hooks/use-theme";
import { ClubContext } from "@/src/context/ClubContext";
import { UserContext } from "@/src/context/UserContext";
import { ROLE_ADMIN } from "@/src/utils/constants";
import Alert, { AlertProps } from "@/src/components/Alert";
import { ClubMemberAttribute } from "@/src/types/member";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import Divider from "@/src/components/Divider";
import { appStyles } from "@/src/utils/styles";
import {
  useGetClubMemberAttributesQuery,
  useGetClubMembersQuery,
  useRemoveMemberMutation,
} from "@/src/services/clubApi";

const Profile = () => {
  const params = useSearchParams();
  const [alertConfig, setAlertConfig] = useState<AlertProps>();
  const { colors } = useTheme();
  const [isRemoving, setIsRemoving] = useState(false);
  const { clubInfo } = useContext(ClubContext);
  const { userInfo } = useContext(UserContext);

  const { data: memberDetails, isLoading: isMemberLoading } = useGetClubMembersQuery({
    clubId: clubInfo.clubId,
    memberId: Number(params.get("memberId")),
  });

  const [removeMember] = useRemoveMemberMutation();
  const handleRemove = () => {
    setAlertConfig({
      visible: true,
      title: "Are you sure!",
      message: "Clck 'OK' to remove the member from the club.",
      buttons: [
        {
          text: "OK",
          onPress: async () => {
            setAlertConfig({ visible: false });
            setIsRemoving(true);
            try {
              await removeMember({
                clubId: clubInfo.clubId,
                memberId: Number(params.get("memberId")),
                email: userInfo.email,
              }).unwrap();
              router.back();
            } finally {
              setIsRemoving(false);
            }
          },
        },
        { text: "Cancel", onPress: () => setAlertConfig({ visible: false }) },
      ],
    });
  };

  const { data: cmaList, isLoading: isLoadingCMA } = useGetClubMemberAttributesQuery({
    clubId: clubInfo.clubId,
    memberId: Number(params.get("memberId")),
    getClubMemberAttributeValues: true,
  });

  return (
    <ThemedView style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <ScrollView>
          {isMemberLoading && <LoadingSpinner />}
          {!isMemberLoading && memberDetails && (
            <>
              <ThemedView style={styles.photoContainer}>
                {memberDetails?.photo ? (
                  <Image
                    source={{ uri: memberDetails?.photo }}
                    style={{ width: 100, height: 100, borderRadius: 100 }}
                  />
                ) : (
                  <ThemedIcon name={"MaterialIcons:account-circle"} size={100} />
                )}
              </ThemedView>
              <ThemedText style={appStyles.heading}>
                {memberDetails?.firstName} {memberDetails?.lastName}
              </ThemedText>
              <KeyValueUI data={memberDetails} hideKeys={["photo", "firstName", "lastName", "isRegistered"]} />
            </>
          )}
          <Spacer space={10} />
          <ThemedText style={appStyles.heading}>Club level attributes</ThemedText>
          {isLoadingCMA && <LoadingSpinner />}
          {!isLoadingCMA &&
            cmaList &&
            cmaList.length > 0 &&
            cmaList.map((cma: ClubMemberAttribute, index: number) => (
              <Divider key={index} style={styles.detailsTable}>
                <ThemedText>{cma.attribute}</ThemedText>
                <ThemedText>{cma.attributeValue}</ThemedText>
              </Divider>
            ))}
          <Spacer space={10} />
          {isRemoving && <LoadingSpinner />}
          {clubInfo.role === ROLE_ADMIN && !isRemoving && (
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
              <ThemedButton
                title="    Edit    "
                onPress={() => router.push(`/(main)/(members)/editmember?memberId=${params.get("memberId")}`)}
              />
              <Spacer space={10} />
              <ThemedButton title="Remove" onPress={() => handleRemove()} style={{ backgroundColor: colors.error }} />
            </View>
          )}
          <Spacer space={10} />
          {alertConfig?.visible && <Alert {...alertConfig} />}
        </ScrollView>
      </GestureHandlerRootView>
    </ThemedView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  photoContainer: {
    minHeight: 120,
    marginTop: 20,
    width: 120,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
  title: {
    margin: 20,
    fontWeight: "bold",
    fontSize: 25,
    width: "80%",
    alignSelf: "center",
  },
  detailsTable: {
    width: "85%",
    alignSelf: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
});
