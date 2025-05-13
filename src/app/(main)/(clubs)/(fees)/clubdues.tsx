import { Text, StyleSheet, TouchableOpacity, View, FlatList, Alert } from 'react-native';
import React, { useContext, useEffect, useState } from 'react'
import { appStyles } from '@/src/utils/styles';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ThemedButton from '@/src/components/ThemedButton';
import Checkbox from 'expo-checkbox';
import { getClubDues } from '@/src/helpers/club_helper';
import { ClubContext } from '@/src/context/ClubContext';

const ClubDues = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [duesByMembers, setDuesByMembers] = useState<any[] | undefined>(undefined);

  const { clubInfo } = useContext(ClubContext)

  const fetchClubDues = () => {
    setIsLoading(true);
    getClubDues(clubInfo.clubId)
      .then(response => { console.log(response.data); setDuesByMembers(response.data) })
      .catch(error => Alert.alert("Error", error.response.data.message))
      .finally(() => setIsLoading(false));
  }
  useEffect(() => {
    fetchClubDues();
  }, [])

  return (
    <GestureHandlerRootView>
        {isLoading && <LoadingSpinner />}
        <View style={{ ...appStyles.shadowBox, width: "90%", marginVertical: 15 }}>
          {!isLoading && <FlatList
            data={duesByMembers}
            keyExtractor={(item) => item.memberId.toString()}
            renderItem={({ item }) => <MemberDue key={item.memberId} member={item} />}
          />}
        </View>
        <ThemedButton title='Mark as paid' onPress={() => null} />
    </GestureHandlerRootView>
  )
}

const MemberDue = (props: { member: any }) => {
  const [isShown, setIsShown] = useState(false);
  const showMemberDues = () => {
    setIsShown(!isShown)
  }
  return (
    <View style={{ width: "100%" }}>
      <TouchableOpacity onPress={showMemberDues} style={{
        flexDirection: "row", width: "100%", margin: 5, paddingVertical: 5,
        justifyContent: "space-between", alignItems: "center", flexWrap: "wrap",
        flexBasis: "auto"
      }}>
        <MaterialCommunityIcons size={20} name={isShown ? 'chevron-down-circle' : 'chevron-right-circle'} />
        <Text style={{ width: "65%", fontSize: 15, paddingLeft: 5 }}>{props?.member.firstName} {props?.member.lastName}</Text>
        <Text style={{ width: "25%", fontWeight: "bold", fontSize: 15 }}> Rs. {props?.member.totalDue} </Text>
      </TouchableOpacity>
      {isShown &&
        props?.member.dues.map((item: { paymentId: number; fee: string; feeType: string, feeDesc: string, amount: number; }) =>
          <MemberFeeItem {...item} key={item.paymentId.toString() + item.feeType} />
        )
      }
    </View>
  )
}

export default ClubDues

const MemberFeeItem = (props: { paymentId: number; fee: string; feeType: string, feeDesc: string, amount: number; }) => {
  return (
    <TouchableOpacity onPress={undefined}>
      <View style={{
        ...appStyles.shadowBox, width: "90%", marginBottom: 15, flexWrap: "wrap"
      }}>
        <View style={{ width: "5%" }}><Checkbox value={false} color={"black"} /></View>
        <Text style={{ width: "70%", paddingLeft: 15 }}>{props?.fee} {props?.feeDesc}</Text>
        <Text style={{ width: "25%", fontSize: 15, textAlign: "right" }}>{props?.amount}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  item: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between"
  },
  label: {
    padding: 10,
  },
  date: {
    padding: 10,
  },
  amount: {
    padding: 10,
  },
  divider: {
    borderBottomColor: 'rgba(136, 136, 136, 0.2)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: "100%"
  }
});