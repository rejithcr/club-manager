import { View, Text, StyleSheet } from 'react-native'
import { appStyles } from '@/src/utils/styles';

const FeeSummary = (props: { duesByMember: []}) => {
  return (
    <View>
      {props.duesByMember?.length == 0 && <Text style={{ textAlign: "center" }}>Yay!! You are all clear 👏</Text>}
      {props.duesByMember?.map((club: any) => {
        return (
          <View key={club.clubId} style={{ ...appStyles.shadowBox, width: "80%", marginBottom: 15 }}>
            <View style={{
              flexDirection: "row", width: "100%", margin: 5,
              justifyContent: "space-between", alignItems: "center"
            }}>
              <Text style={{ fontWeight: "bold", fontSize: 15 }}>Rs. {club.dueAmount}</Text>
              <Text style={{ fontSize: 10, paddingRight: 10 }}> {club.clubName} </Text>
            </View>
            {club.dues.map((due: any) =>
              <View key={due.paymentId.toString() + due.feeType} style={styles.item}>
                <View style={styles.divider} />
                <Text style={styles.label}>{due.fee} </Text>
                <Text style={styles.date}>{due.feeDesc} </Text>
                <Text style={styles.amount}>Rs. {due.amount}</Text>
              </View>
            )}
          </View>
        )
      })}
    </View>
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