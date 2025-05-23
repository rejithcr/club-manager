import { StyleSheet, TouchableOpacity, View, FlatList, Alert } from 'react-native';
import React, { useContext, useEffect, useState } from 'react'
import { appStyles } from '@/src/utils/styles';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { getClubDues } from '@/src/helpers/club_helper';
import { ClubContext } from '@/src/context/ClubContext';
import ThemedView from '@/src/components/themed-components/ThemedView';
import ThemedText from '@/src/components/themed-components/ThemedText';
import ShadowBox from '@/src/components/ShadowBox';
import ThemedIcon from '@/src/components/themed-components/ThemedIcon';
import { useTheme } from '@/src/hooks/use-theme';
import Spacer from '@/src/components/Spacer';

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
    <ThemedView style={{flex: 1 }}>
    <GestureHandlerRootView>
        <Spacer space={5}/>
        {isLoading && <LoadingSpinner />}
        <View style={{ width: "90%", alignSelf:"center" }}>
          {!isLoading && <FlatList
            data={duesByMembers}
            keyExtractor={(item) => item.memberId.toString()}
            renderItem={({ item }) => <MemberDue key={item.memberId} member={item} />}
          />}
        </View>
        {/* <ThemedButton style={{bottom: 30, position: "absolute", alignSelf: "center"}} title='Mark as paid' onPress={() => null} /> */}
    </GestureHandlerRootView>
    </ThemedView>
  )
}

const MemberDue = (props: { member: any }) => {
  const [isShown, setIsShown] = useState(false);
  const { colors } = useTheme();
  const showMemberDues = () => {
    setIsShown(!isShown)
  }
  return (
    <View style={{ width: "100%"}}>
      <TouchableOpacity onPress={showMemberDues} style={{
        flexDirection: "row", width: "100%", margin: 5, paddingVertical: 5,
        justifyContent: "space-between", alignItems: "center", flexWrap: "wrap",
        flexBasis: "auto"
      }}>
        <ThemedIcon size={20} name={isShown ? 'MaterialCommunityIcons:chevron-down-circle' : 'MaterialCommunityIcons:chevron-right-circle'} color={colors.nav}/>
        <ThemedText style={{ width: "65%", fontSize: 15, paddingLeft: 5 }}>{props?.member.firstName} {props?.member.lastName}</ThemedText>
        <ThemedText style={{ width: "25%", fontWeight: "bold", fontSize: 15, textAlign: "right" }}> Rs. {props?.member.totalDue} </ThemedText>
      </TouchableOpacity>
      {isShown &&
        <FlatList
          data={props?.member.dues}
          renderItem={({item}) => <MemberFeeItem {...item} key={item.paymentId.toString() + item.feeType} />}
          ItemSeparatorComponent={() => <View style={{ marginVertical: 5, borderBottomWidth: .5, borderBottomColor: "grey", width: "90%", alignSelf: "center" }} />}
          />
      }
    </View>
  )
}

export default ClubDues

const MemberFeeItem = (props: { paymentId: number; fee: string; feeType: string, feeDesc: string, amount: number; }) => {
  return (
      <ThemedView style={{width: "90%", flexDirection: "row", justifyContent: "space-between", alignSelf: "center"}}>
        <ThemedText style={{ width: "75%"}}>{props?.fee} {props?.feeDesc}</ThemedText>
        <ThemedText style={{ width: "25%", fontSize: 15, textAlign: "right" }}>{props?.amount}</ThemedText>
      </ThemedView>
  )
}
