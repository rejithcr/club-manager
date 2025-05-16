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
              <ThemedText style={{ fontWeight: "bold", fontSize: 15 }}>Rs. {club.dueAmount}</ThemedText>
              <ThemedText style={{ fontSize: 10, paddingRight: 10 }}> {club.clubName} </ThemedText>
            </View>
            {club.dues.map((due: any) =>
              <View key={due.paymentId.toString() + due.feeType} style={styles.item}>
                <View style={styles.divider} />
                <ThemedText style={styles.label}>{due.fee} </ThemedText>
                <ThemedText style={styles.date}>{due.feeDesc} </ThemedText>
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