import { Text, StyleSheet, TouchableOpacity, View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react'
import { appStyles } from '@/src/utils/styles';
import { Dues, Fee, getDuesGroupByMember } from '@/src/helpers/fee_helper';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { useSearchParams } from 'expo-router/build/hooks';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ThemedButton from '@/src/components/ThemedButton';
import Checkbox from 'expo-checkbox';

const ClubDues = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [duesByMembers, setDuesByMembers] = useState<Dues[] | undefined>(undefined);


  const params = useSearchParams()

  useEffect(() => {
    getDuesGroupByMember(Number(params.get("clubId")))
      .then(data => { setDuesByMembers(data); setIsLoading(false) })
      .catch(error => console.error(error))
      .finally(() => setIsLoading(false));
  }, [])

  return (
    <GestureHandlerRootView>
      <ScrollView>
        {isLoading && <LoadingSpinner />}
        <View style={{ ...appStyles.shadowBox, width: "90%", marginVertical: 15 }}>

          {!isLoading && duesByMembers?.map(member =>
            <MemberDue key={member.memberId} member={member} />
          )}
        </View>
        <ThemedButton title='Mark as paid' onPress={() => null} />
      </ScrollView>
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
        <Text style={{ width: "65%", fontSize: 15, paddingLeft: 5 }}>{props?.member.name}</Text>
        <Text style={{ width: "25%", fontWeight: "bold", fontSize: 15 }}> Rs. {props?.member.total} </Text>
      </TouchableOpacity>
      {isShown &&
        props?.member.dues.map((item: { id: number; type: string; amount: number; }) =>
          <MemberFeeItem {...item} key={item.id} />
        )
      }
      <View style={styles.divider} />
    </View>
  )
}

export default ClubDues

const MemberFeeItem = (props: {
  id: number;
  type: string;
  amount: number;
}) => {

  return (
    <TouchableOpacity onPress={undefined}>
      <View style={{
        ...appStyles.shadowBox, width: "90%", marginBottom: 15, flexWrap: "wrap",
        flexBasis: "auto"
      }}>
        <View style={{ width: "5%" }}><Checkbox value={false} color={"black"} /></View>
        <Text style={{ width: "70%", fontSize: 15, paddingLeft: 15 }}>{props?.type}</Text>
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