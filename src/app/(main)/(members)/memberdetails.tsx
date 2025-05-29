import { View, Image, StyleSheet, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'expo-router/build/hooks';
import { MaterialIcons } from '@expo/vector-icons';
import { getMemberDetails, Member } from '@/src/helpers/member_helper';
import KeyValueUI from '@/src/components/KeyValueUI';
import ThemedView from '@/src/components/themed-components/ThemedView';
import ThemedText from '@/src/components/themed-components/ThemedText';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import ThemedIcon from '@/src/components/themed-components/ThemedIcon';
import Spacer from '@/src/components/Spacer';
import ThemedButton from '@/src/components/ThemedButton';
import { router } from 'expo-router';
import { useTheme } from '@/src/hooks/use-theme';
import { removeMember } from '@/src/helpers/club_helper';
import { ClubContext } from '@/src/context/ClubContext';
import { AuthContext } from '@/src/context/AuthContext';

const Profile = () => {
  const params = useSearchParams()
  const [isMemberLoading, setIsMemberLoading] = useState(false)
  const [memberDetails, setMemberDetails] = useState<Member>()
  const { colors } = useTheme()
  const { clubInfo } = useContext(ClubContext)
  const { userInfo } = useContext(AuthContext)

  useEffect(() => {
    setIsMemberLoading(true);
    getMemberDetails(Number(params.get("memberId")))
      .then(response => { console.log(response.data); setMemberDetails(response.data) })
      .catch(error => alert(error?.response?.data?.error || "Error fetching member details"))
      .finally(() => setIsMemberLoading(false));
  }, [])


  const handleRemove = () => {
    Alert.alert(
      'Are you sure!',
      "Clck 'OK' to remove the member.",
      [
        {
          text: 'OK', onPress: () => {
            setIsMemberLoading(true)
            removeMember(clubInfo.clubId, Number(params.get("memberId")), userInfo.email)
              .then(response => { Alert.alert("Success", response.data.message); router.back() })
              .catch(error => alert(error?.response?.data?.error || "Error fetching member details"))
              .finally(() => setIsMemberLoading(false));
          }
        },
        { text: 'cancel', onPress: () => null },
      ],
      { cancelable: true },
    );

  }

  return (
    <ThemedView style={{ flex: 1 }}>
      {isMemberLoading && <LoadingSpinner />}
      {!isMemberLoading && memberDetails && <>
        <ThemedView style={styles.photoContainer}>
          {memberDetails?.photo ? <Image source={{ uri: memberDetails?.photo }} style={{ width: 100, height: 100, borderRadius: 100 }} />
            : <ThemedIcon name={"MaterialIcons:account-circle"} size={100} />}
        </ThemedView>
        <ThemedText style={styles.title}>{memberDetails?.firstName} {memberDetails?.lastName}</ThemedText>
        <KeyValueUI data={memberDetails} hideKeys={["photo", "firstName", "lastName"]} />
      </>}
      <Spacer space={10} />
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <ThemedButton title="    Edit    " onPress={() => router.push(`/(main)/(members)/editmember?memberId=${params.get("memberId")}`)} />
        <Spacer space={10} />
        <ThemedButton title="Remove" onPress={() => handleRemove()} style={{ backgroundColor: colors.error }} />
      </View>
    </ThemedView>
  )
}

export default Profile


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
    width: "80%",
    alignSelf: "center",
    alignItems: "stretch",
    flexDirection: "row",
    flexWrap: "wrap",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
  label: {
    width: "30%",
    padding: 10,
  },
  value: {
    width: "70%",
    padding: 10,
  },
  divider: {
    borderBottomColor: 'rgba(136, 136, 136, 0.2)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: "100%"
  }
});