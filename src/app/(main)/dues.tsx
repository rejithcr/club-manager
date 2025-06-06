import { View, StyleSheet, TouchableOpacity } from 'react-native'
import ThemedView from '@/src/components/themed-components/ThemedView';
import ShadowBox from '@/src/components/ShadowBox';
import ThemedText from '@/src/components/themed-components/ThemedText';
import { useState } from 'react';
import ThemedIcon from '@/src/components/themed-components/ThemedIcon';
import { useTheme } from '@/src/hooks/use-theme';
import Spacer from '@/src/components/Spacer';
import ThemedButton from '@/src/components/ThemedButton';

const FeeSummary = (props: { duesByMember: [] }) => {
  const [showDues, setShowDues] = useState(true)
  const { colors } = useTheme()

  return (
    <ThemedView>
      {props.duesByMember?.length == 0 && <ThemedText style={{ textAlign: "center" }}>Yay!! You are all clear 👏</ThemedText>}
      {props.duesByMember?.map((club: any) => {
        return (
          <View key={club.clubId}>
            <ShadowBox >
              <TouchableOpacity onPress={() => setShowDues(prev => !prev)} style={{
                flexDirection: "row", width: "100%", 
                justifyContent: "space-between", alignItems: "center"
              }}>
                <ThemedIcon size={20} name={showDues ? 'MaterialCommunityIcons:chevron-down-circle' : 'MaterialCommunityIcons:chevron-right-circle'} color={colors.nav} />
                <ThemedText style={{ width: "60%", fontSize: 15 }}>{club.clubName}</ThemedText>
                <ThemedText style={{ width: "30%", fontWeight: "bold", fontSize: 15, textAlign: "right" }}>Rs. {club.dueAmount}</ThemedText>
              </TouchableOpacity>
            </ShadowBox>
            {showDues && club.dues.map((due: any) =>
              <View key={due.paymentId.toString() + due.feeType} style={styles.item}>
                <View style={styles.divider} />
                <View style={{ paddingVertical: 5 }}>
                  <ThemedText style={styles.label}>{due.fee} </ThemedText>
                  <ThemedText style={styles.subLabel}>{due.feeDesc} </ThemedText>
                </View>
                <ThemedText style={styles.amount}>Rs. {due.amount}</ThemedText>
              </View>
            )}
            
             {/* {showDues && <ThemedButton title='Pay Now' onPress={()=>{ Linking.openURL(`upi://pay?pa=8281478849@ybl&pn=Rejith C R&cu=INR&am=100&tn=${club.clubName}: due payment`)}} />}
             <Link href='upi://pay?pa=8281478849@ybl&pn=Rejith C R&cu=INR&am=100'>Pay Now</Link> */}
            <Spacer space={4} />
          </View>
        )
      })}
    </ThemedView>
  )
}

export default FeeSummary


const styles = StyleSheet.create({
  item: {
    width: "75%",
    flexDirection: "row",
    flexWrap: "wrap", alignSelf:"center",
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