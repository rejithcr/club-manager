import { View, Text, StyleSheet } from 'react-native'
import { appStyles } from '@/src/utils/styles';
import ThemedView from '@/src/components/themed-components/ThemedView';
import ShadowBox from '@/src/components/ShadowBox';
import ThemedText from '@/src/components/themed-components/ThemedText';

const FeeSummary = (props: { duesByMember: []}) => {
  return (
    <ThemedView>
      {props.duesByMember?.length == 0 && <ThemedText style={{ textAlign: "center" }}>Yay!! You are all clear 👏</ThemedText>}
      {props.duesByMember?.map((club: any) => {
        return (
          <ShadowBox key={club.clubId} style={{ padding: 10, width: "80%", marginBottom: 15, flexDirection: "column" }}>
            <View style={{
              flexDirection: "row", width: "100%", margin: 5,
              justifyContent: "space-between", alignItems: "center"
            }}>
              <ThemedText style={{ fontWeight: "bold", paddingLeft: 5, fontSize: 15, }}>{club.clubName}</ThemedText>
              <ThemedText style={{ fontWeight: "bold" , paddingRight: 5}}>Rs. {club.dueAmount}</ThemedText>
            </View>
            {club.dues.map((due: any) =>
              <View key={due.paymentId.toString() + due.feeType} style={styles.item}>
                <View style={styles.divider} />
                <View style={{paddingVertical: 5}}>
                <ThemedText style={styles.label}>{due.fee} </ThemedText>
                <ThemedText style={styles.subLabel}>{due.feeDesc} </ThemedText>
                </View>
                <ThemedText style={styles.amount}>Rs. {due.amount}</ThemedText>
              </View>
            )}
          </ShadowBox>
        )
      })}
    </ThemedView>
  )
}

export default FeeSummary


const styles = StyleSheet.create({
  item: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
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
    width: "100%"
  }
});