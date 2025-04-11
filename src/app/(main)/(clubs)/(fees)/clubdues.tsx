import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react'
import { appStyles } from '@/src/utils/styles';
import { Dues, getDuesGroupByMember } from '@/src/helpers/fee_helper';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { useSearchParams } from 'expo-router/build/hooks';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
        <Text style={appStyles.title}>{params.get("clubName")}</Text>
        {isLoading && <LoadingSpinner />}
        <View style={{ ...appStyles.shadowBox, width: "90%", marginBottom: 15 }}>

          {!isLoading && duesByMembers?.map(member =>
            <MemberDue key={member.memberId} member={member} />
          )}
        </View>
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
      {isShown && <DueItems dues={props?.member.dues} />}
      <View style={styles.divider} />
    </View>
  )
}

const DueItems = (props: { dues: Dues["dues"] }) => {
  const [duesLocal, setDuesLocal] = useState<Dues["dues"]>()
  useEffect(() => {
    setDuesLocal(props.dues)
  }, [])
  return (
    <>
      {duesLocal?.map((due) => {
        return (
          <View style={appStyles.centerify}>
            <Text style={{ width: "100%" }} key={due.id}>{due.amount}</Text>
          </View>
        )
      })}
    </>
  )
}

export default ClubDues


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