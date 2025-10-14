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
import Card from "@/src/components/Card";
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
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {isMemberLoading && <LoadingSpinner />}
          {!isMemberLoading && memberDetails && (
            <View style={styles.mainCard}>
              {/* Profile Section */}
              <Card style={styles.profileSection}>
                {memberDetails?.photo ? (
                  <Image
                    source={{ uri: memberDetails?.photo }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={{ ...styles.placeholderPhoto, backgroundColor: colors.secondary }}>
                    <ThemedIcon name="MaterialIcons:account-circle" size={50} color={colors.text} />
                  </View>
                )}
                
                <View style={styles.profileInfo}>
                  <ThemedText style={{ ...styles.memberName, color: colors.info }}>
                    {memberDetails?.firstName} {memberDetails?.lastName}
                  </ThemedText>

                  <View style={{ ...styles.statusBadge, backgroundColor: memberDetails?.isRegistered ? colors.success : colors.warning }}>
                    <ThemedText style={styles.statusText}>
                      {memberDetails?.isRegistered ? 'REGISTERED' : 'REGISTRATION PENDING'}
                    </ThemedText>
                  </View>
                </View>
              </Card>

              {/* Member Information */}
              <Card>
              <KeyValueUI 
                data={memberDetails} 
                hideKeys={["photo", "firstName", "lastName", "isRegistered", "isActive"]} 
              />

              {/* Club Attributes */}
              {(!isLoadingCMA && cmaList && cmaList.length > 0) && (
                <>
                  <Divider style={styles.sectionDivider} />
                  <ThemedText style={{ ...styles.sectionTitle, color: colors.heading }}>
                    Club Attributes
                  </ThemedText>
                  
                  {cmaList.map((cma: ClubMemberAttribute, index: number) => (
                    <View key={index} style={styles.attributeItem}>
                      <ThemedText style={{ ...styles.attributeLabel, color: colors.subText }}>
                        {cma.attribute}
                      </ThemedText>
                      <ThemedText style={{ ...styles.attributeValue, color: colors.text }}>
                        {cma.attributeValue}
                      </ThemedText>
                    </View>
                  ))}
                </>
              )}
              </Card>
              {/* Admin Actions */}
              {clubInfo.role === ROLE_ADMIN && (
                <>
                <Spacer space={5} />
                  {isRemoving ? (
                    <LoadingSpinner />
                  ) : (
                    <View style={styles.buttonContainer}>
                      <ThemedButton
                        title="Edit"
                        onPress={() => router.push(`/(main)/(members)/editmember?memberId=${params.get("memberId")}`)}
                        style={{ backgroundColor: colors.button }}
                      />
                      
                      <ThemedButton 
                        title="Remove" 
                        onPress={() => handleRemove()} 
                        style={{ backgroundColor: colors.error }}
                      />
                    </View>
                  )}
                </>
              )}
            </View>
          )}

          {isLoadingCMA && <LoadingSpinner />}
        </ScrollView>
      </GestureHandlerRootView>
      
      {alertConfig?.visible && <Alert {...alertConfig} />}
    </ThemedView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 40,
  },
  mainCard: {
    padding: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  placeholderPhoto: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  sectionDivider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  attributeItem: {
    paddingVertical: 6,
  },
  attributeLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  attributeValue: {
    fontSize: 15,
    fontWeight: '400',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  // Legacy styles for compatibility
  detailsTable: {
    width: "85%",
    alignSelf: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
});
