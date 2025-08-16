import { FlatList, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { useHttpGet } from '@/src/hooks/use-http'
import { ClubContext } from '@/src/context/ClubContext'
import ThemedText from '@/src/components/themed-components/ThemedText'
import ThemedView from '@/src/components/themed-components/ThemedView'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Modal from 'react-native-modal'
import ThemedButton from '@/src/components/ThemedButton'
import InputText from '@/src/components/InputText'
import ThemedIcon from '@/src/components/themed-components/ThemedIcon'
import TouchableCard from '@/src/components/TouchableCard'
import { appStyles } from '@/src/utils/styles'
import Spacer from '@/src/components/Spacer'
import LoadingSpinner from '@/src/components/LoadingSpinner'
import { UserContext } from '@/src/context/UserContext'
import { useTheme } from '@/src/hooks/use-theme'
import { isValidLength } from '@/src/utils/validators'
import { ROLE_ADMIN } from '@/src/utils/constants'
import Alert, { AlertProps } from '@/src/components/Alert'
import { useUpdateClubMutation } from '@/src/services/clubApi'

const MembershipRequests = () => {
  const { colors } = useTheme()
  const { clubInfo } = useContext(ClubContext);
  const { userInfo } = useContext(UserContext);
  const [isUpdating, setIsUpdating] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [comments, setComments] = useState("")
  const [statusChangeRequest, setStatusChangeRequest] = useState({ clubId: 0, memberId: 0 });

  const { data, isLoading, refetch} = useHttpGet('/club', { clubId: clubInfo.clubId, membershipRequests: "true" })
  const [upadteMembershipRequest] = useUpdateClubMutation();

  const handleStatusChange = async (status: string) => {
    if (validate(comments)) {
      setIsModalVisible(false);
      setIsUpdating(true);
      await upadteMembershipRequest({
        clubId: statusChangeRequest.clubId,
        memberId: statusChangeRequest.memberId,
        status,
        comments,
        email: userInfo.email,
      }).unwrap();
      refetch();
      setIsUpdating(false);
    }
  };
  const showApproveModal = (memberId: any, clubId: any) => {
    setStatusChangeRequest({ clubId, memberId })
    setIsModalVisible(true)
  }

  return (
    <GestureHandlerRootView>
      <ThemedView style={{ flex: 1 }}>
        <Spacer space={5} />
        <ThemedText style={{ ...appStyles.heading, marginBottom: 2 }}>Requests</ThemedText>
        <ThemedText style={{ fontSize: 10, width: "80%", alignSelf: "center" }}>Press the item to approve or reject</ThemedText>
        <Spacer space={5} />
        {(isLoading || isUpdating) && <LoadingSpinner />}
        {!(isLoading || isUpdating) && <FlatList
          data={data}
          keyExtractor={(item) => item.memberId}
          ListEmptyComponent={() => <ThemedText style={{alignSelf: "center"}}>No requests found.</ThemedText>}
          ItemSeparatorComponent={() => <Spacer space={2} />}
          renderItem={({ item }) => <TouchableCard onPress={() => showApproveModal(item.memberId, item.clubId)}>
            <View style={{ flexDirection: "row", alignItems: "center", width: '80%' }}>
              <View style={{ marginRight: 10 }}>
                <ThemedIcon
                  size={25}
                  name={item.status === 'APPROVED' ? 'MaterialIcons:check-circle' : item.status === 'REJECTED' ? 'MaterialIcons:cancel' : 'FontAwesome:question-circle'}
                  color={item.status === 'APPROVED' ? colors.success : item.status === 'REJECTED' ? colors.error : colors.warning} />
              </View>
              <View >
                <ThemedText>{item.firstName} {item.lastName}</ThemedText>
                <ThemedText style={{ fontSize: 10 }}>{item.comments}</ThemedText>
              </View>
            </View>
          </TouchableCard>}
        />}
      </ThemedView>
      {clubInfo.role === ROLE_ADMIN && <Modal isVisible={isModalVisible}>
        <ThemedView style={{ borderRadius: 5, paddingBottom: 20 }}>
          <ThemedText style={{ ...appStyles.heading }}>Approve Request?</ThemedText>
          <InputText label="Comments" onChangeText={(value: string) => setComments(value)} />
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20, alignItems: "center" }}>
            <ThemedButton title="Approve" onPress={() => handleStatusChange("APPROVED")} />
            <ThemedButton style={{ backgroundColor: colors.error }} title="Reject" onPress={() => handleStatusChange("REJECTED")} />
            <ThemedButton title="Cancel" onPress={() => setIsModalVisible(false)} />
          </View>
        </ThemedView>
      </Modal>}
    </GestureHandlerRootView>
  )
}

export default MembershipRequests

const validate = (comments: string) => {
  if (!isValidLength(comments, 2)) {
    alert("Enter atleast 2 characters for comments")
    return false
  }
  return true
}

