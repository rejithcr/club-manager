import { FlatList, TouchableOpacity, View, RefreshControl } from "react-native";
import React, { useContext, useState } from "react";
import { ClubContext } from "@/src/context/ClubContext";
import ThemedText from "@/src/components/themed-components/ThemedText";
import ThemedView from "@/src/components/themed-components/ThemedView";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import ThemedButton from "@/src/components/ThemedButton";
import InputText from "@/src/components/InputText";
import ThemedIcon from "@/src/components/themed-components/ThemedIcon";
import { appStyles } from "@/src/utils/styles";
import Spacer from "@/src/components/Spacer";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { UserContext } from "@/src/context/UserContext";
import { useTheme } from "@/src/hooks/use-theme";
import { isValidLength } from "@/src/utils/validators";
import { ROLE_ADMIN } from "@/src/utils/constants";
import { useGetClubQuery, useUpdateClubMutation } from "@/src/services/clubApi";
import Divider from "@/src/components/Divider";
import usePaginatedQuery from "@/src/hooks/usePaginatedQuery";

const limit = 50;

const MembershipRequests = () => {
  const { colors } = useTheme();
  const { clubInfo } = useContext(ClubContext);
  const { userInfo } = useContext(UserContext);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [comments, setComments] = useState("");
  const [statusChangeRequest, setStatusChangeRequest] = useState({
    clubId: 0,
    memberId: 0,
    phone: "",
    email: "",
    firstName: "",
    lastName: "",
  });

  const { items, isLoading: isPaginationLoading, loadMore, isFetching, refreshing, onRefresh } = usePaginatedQuery(
    useGetClubQuery,
    { clubId: clubInfo.clubId, membershipRequests: "true" },
    limit
  );
  const [updateMembershipRequest] = useUpdateClubMutation();

  const handleStatusChange = async (status: string) => {
    if (validate(comments)) {
      setIsModalVisible(false);
      setIsUpdating(true);
      await updateMembershipRequest({
        clubId: statusChangeRequest.clubId,
        memberId: statusChangeRequest.memberId,
        status,
        comments,
        email: userInfo.email,
      }).unwrap();
      onRefresh();
      setIsUpdating(false);
    }
  };
  const showApproveModal = (memberId: any, clubId: any, phone: any, email: any, firstName: any, lastName: any) => {
    setStatusChangeRequest({ clubId, memberId, phone, email, firstName, lastName });
    setIsModalVisible(true);
  };

  return (
    <GestureHandlerRootView>
      <ThemedView style={{ flex: 1 }}>
        <Spacer space={5} />
        <ThemedText style={{ fontSize: 12, width: "80%", alignSelf: "center" , color: colors.subText}}>
          Press the item to approve or reject
        </ThemedText>
        <Spacer space={10} />
        {(isPaginationLoading || isUpdating) && <LoadingSpinner />}
        {!(isPaginationLoading || isUpdating) && (
          <FlatList
            data={items}
            keyExtractor={(item) => item.clubId + "_" + item.memberId}
            ListEmptyComponent={() => <ThemedText style={{ alignSelf: "center" }}>No requests found.</ThemedText>}
            ItemSeparatorComponent={() => <><Spacer hspace={2} /><Divider style={{ width: "80%" }} /><Spacer hspace={2} /></>}
            ListFooterComponent={() => (
              (isFetching && (
                <>
                  <Spacer space={10} />
                  <LoadingSpinner />
                </>
              )) || (
                <ThemedText style={{ alignSelf: "center", paddingBottom: 20, paddingTop: 10, fontSize: 12, color: colors.subText }}>
                  {items.length > 0 ? "No more requests" : ""}
                </ThemedText>
              )
            )}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ alignSelf: "center", width: "80%" }}
                onPress={() => showApproveModal(item.memberId, item.clubId, item.phone, item.email, item.firstName, item.lastName)}
              >
                <View style={{ flexDirection: "row", alignItems: "center", width: "100%"}}>
                  <View style={{ marginRight: 10 }}>
                    <ThemedIcon
                      size={25}
                      name={
                        item.status === "APPROVED"
                          ? "MaterialIcons:check-circle"
                          : item.status === "REJECTED"
                          ? "MaterialIcons:cancel"
                          : "FontAwesome:question-circle"
                      }
                      color={
                        item.status === "APPROVED"
                          ? colors.success
                          : item.status === "REJECTED"
                          ? colors.error
                          : colors.warning
                      }
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <ThemedText>
                      {item.firstName} {item.lastName}
                    </ThemedText>
                    <ThemedText style={{ fontSize: 10 }}>{item.comments}</ThemedText>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </ThemedView>
      {clubInfo.role === ROLE_ADMIN && (
        <Modal isVisible={isModalVisible}>
          <ThemedView style={{ borderRadius: 25, paddingBottom: 20 }}>
            <ThemedText style={{ ...appStyles.heading }}>Approve Request?</ThemedText>
            <View style={{ width: "80%", alignSelf: "center" }}>
              <ThemedIcon name="AntDesign:user" size={20} text={`${statusChangeRequest.firstName} ${statusChangeRequest.lastName}`} />
              <ThemedIcon name="MaterialIcons:email" size={20} text={statusChangeRequest.email} />
              <ThemedIcon name="AntDesign:phone" size={20} text={statusChangeRequest.phone} />
            </View>
            <InputText label="Comments" onChangeText={(value: string) => setComments(value)} />
            <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20, alignItems: "center" }}>
              <ThemedButton title="Approve" onPress={() => handleStatusChange("APPROVED")} />
              <ThemedButton
                style={{ backgroundColor: colors.error }}
                title="Reject"
                onPress={() => handleStatusChange("REJECTED")}
              />
              <ThemedButton title="Cancel" onPress={() => setIsModalVisible(false)} />
            </View>
          </ThemedView>
        </Modal>
      )}
    </GestureHandlerRootView>
  );
};

export default MembershipRequests;

const validate = (comments: string) => {
  if (!isValidLength(comments, 2)) {
    alert("Enter atleast 2 characters for comments");
    return false;
  }
  return true;
};
