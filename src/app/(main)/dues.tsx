import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { appStyles } from '@/src/utils/styles';
import { getDues } from '@/src/helpers/fee_helper';
import LoadingSpinner from '@/src/components/LoadingSpinner';

const FeeSummary = (props: { memberEmail: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [dues, setDues] = useState<any>([]);

  useEffect(() => {
    getDues(props.memberEmail)
      .then(data => { setDues(data)})
      .catch(error => { console.error(error)})
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <View>
      <Text style={appStyles.title}>Dues Summary</Text>
      {isLoading && <LoadingSpinner />}
      {!isLoading && dues?.length == 0 && <Text style={{ textAlign: "center" }}>Yay!! You are all clear 👏</Text>}
      {!isLoading && dues.map((club: any) => {
        return (
          <View key={club.club} style={{ ...appStyles.shadowBox, width: "80%", marginBottom: 15 }}>
            <View style={{
              flexDirection: "row", width: "100%", margin: 5,
              justifyContent: "space-between", alignItems: "center"
            }}>
              <Text style={{ fontWeight: "bold", fontSize: 15 }}>Rs. {club.total}</Text>
              <Text style={{ fontSize: 10, paddingRight: 10 }}> {club.club} </Text>
            </View>
            {club.dues.map((due: any) =>
              <View key={due.id} style={styles.item}>
                <View style={styles.divider} />
                <Text style={styles.label}>{due.type} </Text>
                <Text style={styles.date}>{due.period} </Text>
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