import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { appStyles } from '@/src/utils/styles';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { FeeSummary, getFeeSummary } from '@/src/helpers/fee_helper';
import { ScrollView } from 'react-native-gesture-handler';
import { getFundBalance } from '@/src/helpers/club_helper';

const ClubFeeSummary = (props: {
  clubId: number | undefined;
  clubName: string | null | undefined;
  showClubDues: any | undefined;
  showFeeByMember: any | undefined
}) => {
  const[isFundBalanceLoading, setIsFundBalanceLoading] = useState(false)
  const[fundBalance, setFundBalance]= useState(0)
  const [isLoading, setIsLoading] = useState(true);
  const [feeSummary, setFeeSummary] = useState<FeeSummary | undefined>(undefined);

  useEffect(() => {
    setIsFundBalanceLoading(true)
    getFundBalance(props.clubId)
      .then(response=>setFundBalance(response.data.fundBalance))
      .catch(error=>Alert.alert("Error", error.response.data.error))
      .finally(() => setIsFundBalanceLoading(false))

    getFeeSummary(props?.clubId)
      .then(data => { setFeeSummary(data); setIsLoading(false) })
      .catch(error => { console.error(error); setIsLoading(false) });
  }, [])

  return (
    <ScrollView>
      <View>
        {/* <Text style={appStyles.title}>Fee Summary</Text> */}
        {isLoading && <LoadingSpinner />}
        {!isLoading && feeSummary &&
          <View style={{ ...appStyles.shadowBox, width: "80%", marginBottom: 5 }}>
            <View style={{ width: "100%", flexDirection: "row", flexWrap: "wrap" }}>
              <View style={{
                flexDirection: "row", width: "100%", margin: 5, paddingVertical: 5,
                justifyContent: "space-between", alignItems: "center"
              }}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>Fund Balance</Text>
                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                  {isFundBalanceLoading && <LoadingSpinner/>}
                  {!isFundBalanceLoading && <Text style={{ fontWeight: "bold", fontSize: 15, paddingRight: 10 }}> Rs. {fundBalance || 0} </Text> }
                  <View style={{ width: 20 }} />
                </View>
              </View>
              <View style={styles.divider} />
              <TouchableOpacity onPress={props.showClubDues} style={{
                flexDirection: "row", width: "100%", margin: 5, paddingVertical: 5,
                justifyContent: "space-between"
              }}>
                <Text style={{ fontSize: 15 }}>Total Due</Text>
                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                  <Text style={{ fontWeight: "bold", fontSize: 15, paddingRight: 10 }}> Rs. {feeSummary.totalDue} </Text>
                  <MaterialCommunityIcons size={20} name={'chevron-right-circle'} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        }
      </View>
    </ScrollView>
  )
}

const getEventIcon = (event: Event) => {
  if (event.type.toLowerCase() == "birthday") {
    return <FontAwesome name={"birthday-cake"} size={30} />
  } else if (event.type.toLowerCase() == "meeting") {
    return <MaterialIcons name={"event"} size={30} />
  } else if (event.type.toLowerCase() == "anniversary") {
    return <MaterialIcons name={"celebration"} size={30} />
  } else {
    return <MaterialIcons name={"event"} size={30} />
  }
}

export default ClubFeeSummary


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