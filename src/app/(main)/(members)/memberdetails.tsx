import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'expo-router/build/hooks';
import { MaterialIcons } from '@expo/vector-icons';
import { getMemberDetails, Member } from '@/src/helpers/member_helper';
import KeyValueUI from '@/src/components/KeyValueUI';

const Profile = () => {
  const params = useSearchParams()
  const [memberDetails, setMemberDetails] = useState<Member>()
  useEffect(() => {
    const member = getMemberDetails(Number(params.get("id")));
    setMemberDetails(member);
  }, [])

  return (
    <View>
      <View style={styles.photoContainer}>
        <MaterialIcons name={"account-circle"} size={100} />
      </View>

      <Text style={styles.title}>{memberDetails?.firstName} {memberDetails?.lastName}</Text>

      <KeyValueUI data={memberDetails} hideKeys={["id"]}/>
      
    </View>
  )
}

export default Profile


const styles = StyleSheet.create({
  photoContainer: {
    minHeight: 150,
    margin: 5,
    padding: 10,
    flex: 1,
    width: 150,
    borderRadius: 100,
    borderColor: "#eee",
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