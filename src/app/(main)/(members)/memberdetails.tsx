import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'expo-router/build/hooks';
import { MaterialIcons } from '@expo/vector-icons';
import { getMemberDetails, Member } from '@/src/helpers/member_helper';
import KeyValueUI from '@/src/components/KeyValueUI';
import ThemedView from '@/src/components/themed-components/ThemedView';
import ThemedText from '@/src/components/themed-components/ThemedText';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import ThemedIcon from '@/src/components/themed-components/ThemedIcon';

const Profile = () => {
  const params = useSearchParams()
  const [isMemberLoading, setIsMemberLoading] = useState(false)
  const [memberDetails, setMemberDetails] = useState<Member>()
  useEffect(() => {
    setIsMemberLoading(true);
    getMemberDetails(Number(params.get("memberId")))
    .then(response => {console.log(response.data);setMemberDetails(response.data)})
    .catch(error => alert(error?.response?.data?.error || "Error fetching member details"))
    .finally(() => setIsMemberLoading(false));
  }, [])

  return (
    <ThemedView style={{ flex: 1 }}>
      {isMemberLoading && <LoadingSpinner />}
      {!isMemberLoading && memberDetails && <>
      <ThemedView style={styles.photoContainer}>
        <ThemedIcon name={"MaterialIcons:account-circle"} size={100} />
      </ThemedView>
      <ThemedText style={styles.title}>{memberDetails?.firstName} {memberDetails?.lastName}</ThemedText>
      <KeyValueUI data={memberDetails} hideKeys={["memberId", "firstName", "lastName"]}/>     
      </>} 
    </ThemedView>
  )
}

export default Profile


const styles = StyleSheet.create({
  photoContainer: {
    minHeight: 150,
    margin: 5,
    padding: 10,
    width: 150,
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