import { TouchableOpacity, View, FlatList, StyleSheet, ScrollView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react'
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { getClubDues } from '@/src/helpers/club_helper';
import { ClubContext } from '@/src/context/ClubContext';
import ThemedView from '@/src/components/themed-components/ThemedView';
import ThemedText from '@/src/components/themed-components/ThemedText';
import ThemedIcon from '@/src/components/themed-components/ThemedIcon';
import { useTheme } from '@/src/hooks/use-theme';
import Spacer from '@/src/components/Spacer';
import ShadowBox from '@/src/components/ShadowBox';
import Alert, { AlertProps } from '@/src/components/Alert';
import Divider from '@/src/components/Divider';

const ClubDues = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [duesByMembers, setDuesByMembers] = useState<any[] | undefined>(undefined);
  const [alertConfig, setAlertConfig] = useState<AlertProps>();

  const { clubInfo } = useContext(ClubContext)

  const fetchClubDues = () => {
    setIsLoading(true);
    getClubDues(clubInfo.clubId)
      .then(response => { setDuesByMembers(response.data) })
      .catch(error => setAlertConfig({ visible: true, title: 'Error', message: error.response.data.error, buttons: [{ text: 'OK', onPress: () => setAlertConfig({ visible: false }) }] }))
      .finally(() => setIsLoading(false));
  }
  useEffect(() => {
    fetchClubDues();
  }, [])

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView>
        <Spacer space={5} />
        {isLoading && <LoadingSpinner />}
        <View style={{ width: "85%", alignSelf: "center" }}>
          {!isLoading && duesByMembers?.map((item: any) => {
            return <View key={item.memberId}><MemberDue key={item.memberId} member={item} /><Spacer space={4} /></View>
          })}
        </View>
      </ScrollView>
      {alertConfig?.visible && <Alert {...alertConfig} />}
      {/* <ThemedButton style={{bottom: 30, position: "absolute", alignSelf: "center"}} title='Mark as paid' onPress={() => null} /> */}
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
    <>
      <ShadowBox style={{ width: "100%" }}>
        <TouchableOpacity onPress={showMemberDues} style={{
          flexDirection: "row", width: "100%",
          justifyContent: "space-between", alignItems: "center"
        }}>
          <View style={{ flexDirection: "row", width: "70%" }}>
            <ThemedIcon size={20} name={isShown ? 'MaterialCommunityIcons:chevron-down-circle' : 'MaterialCommunityIcons:chevron-right-circle'} color={colors.nav} />
            <Spacer hspace={5} />
            <ThemedText style={{ fontSize: 15 }}>{props?.member.firstName} {props?.member.lastName}</ThemedText>
          </View>
          <ThemedText style={{ width: "30%", fontWeight: "bold", fontSize: 15, textAlign: "right" }}> Rs. {props?.member.totalDue} </ThemedText>
        </TouchableOpacity>
      </ShadowBox>
      {isShown && props?.member.dues.map((item: any) => {
        return <View key={item.paymentId.toString() + item.feeType} style={styles.item}>
          <Divider />
          <MemberFeeItem {...item} key={item.paymentId.toString() + item.feeType} />
        </View>
      })
      }
    </>
  )
}

export default ClubDues

const MemberFeeItem = (props: { paymentId: number; fee: string; feeType: string, feeDesc: string, amount: number; }) => {
  return (
    <View key={props.paymentId.toString() + props.feeType} style={styles.item}>
      <View style={{ paddingVertical: 5 }}>
        <ThemedText style={styles.label}>{props?.fee} </ThemedText>
        <ThemedText style={styles.subLabel}>{props?.feeDesc} </ThemedText>
      </View>
      <ThemedText style={styles.amount}>Rs. {props?.amount}</ThemedText>
    </View>
  )
}



const styles = StyleSheet.create({
  item: {
    width: "95%",
    flexDirection: "row",
    flexWrap: "wrap", alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-between"
  },
  label: {
    paddingHorizontal: 10,
    paddingLeft: 5
  },
  subLabel: {
    fontSize: 10,
    paddingLeft: 5
  },
  date: {
    padding: 5,
  },
  amount: {
    padding: 5,
  },
  divider: {
    borderBottomColor: 'rgba(136, 136, 136, 0.2)',
    borderBottomWidth: .75,
    width: "85%",
    alignSelf: "center"
  }
});