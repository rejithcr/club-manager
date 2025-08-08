import { View, StyleSheet, TouchableOpacity, Button } from "react-native";
import ThemedView from "@/src/components/themed-components/ThemedView";
import ShadowBox from "@/src/components/ShadowBox";
import ThemedText from "@/src/components/themed-components/ThemedText";
import { useState } from "react";
import ThemedIcon from "@/src/components/themed-components/ThemedIcon";
import { useTheme } from "@/src/hooks/use-theme";
import Spacer from "@/src/components/Spacer";
import Divider from "@/src/components/Divider";
import * as Linking from "expo-linking";
import { showSnackbar } from "@/src/components/snackbar/snackbarService";

type ClubDueType = {
  clubId: string;
  clubName: string;
  dueAmount: number;
  dues: {
    paymentId: string | number;
    feeType: string;
    fee: string;
    feeDesc: string;
    amount: number;
  }[];
};

const FeeSummary = (props: { duesByMember: ClubDueType[] }) => {
  return (
    <ThemedView>
      {props.duesByMember?.length == 0 ? (
        <ThemedText style={{ textAlign: "center" }}>Yay!! You are all clear 👏</ThemedText>
      ) : (
        props.duesByMember.map((item) => {
          return (
            <View key={item.clubId}>
              <Spacer space={4} />
              <ClubDue club={item} />
            </View>
          );
        })
      )}
    </ThemedView>
  );
};

export default FeeSummary;

const ClubDue = ({ club }: { club: ClubDueType }) => {
  const [showDues, setShowDues] = useState(false);
  const { colors } = useTheme();

  const makeUpiPayment = async (amount: number, clubName: string) => {
    const upiUri = `upi://pay?pa=8281478849@ybl&tid=txn1d1&tr=REF123456&tn=${clubName}${" fee payment"}&am=${amount}&cu=INR`;
    console.log(upiUri);
    const canOpen = await Linking.canOpenURL(upiUri);
    if (canOpen) {
      Linking.openURL(upiUri);
    } else {
      alert("No UPI app found on device");
    }
  };

  return (
    <View key={club.clubId}>
      <ShadowBox>
        <TouchableOpacity
          onPress={() => setShowDues((prev) => !prev)}
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ThemedIcon
            size={20}
            name={
              showDues ? "MaterialCommunityIcons:chevron-down-circle" : "MaterialCommunityIcons:chevron-right-circle"
            }
            color={colors.nav}
          />
          <ThemedText style={{ width: "60%", fontSize: 15 }}>{club.clubName}</ThemedText>
          <ThemedText style={{ width: "30%", fontWeight: "bold", fontSize: 15, textAlign: "right" }}>
            Rs. {club.dueAmount}
          </ThemedText>
        </TouchableOpacity>
      </ShadowBox>
      {showDues &&
        club.dues.map((due: any) => (
          <View key={due.paymentId.toString() + due.feeType} style={styles.item}>
            <Divider />
            <View style={{ paddingVertical: 5 }}>
              <ThemedText style={styles.label}>{due.fee} </ThemedText>
              <ThemedText style={styles.subLabel}>{due.feeDesc} </ThemedText>
            </View>
            <ThemedText style={styles.amount}>Rs. {due.amount}</ThemedText>
          </View>
        ))}

      {showDues && (
        <TouchableOpacity onPress={() => makeUpiPayment(club.dueAmount, club.clubName)}>
          <ThemedText style={{...styles.button}}>Pay Now</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    borderColor: "gray",
    borderWidth: 1,
    width: 80,
    textAlign: "center",
    paddingBottom: 2,
    alignSelf: "center"    
  },
  item: {
    width: "80%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    paddingHorizontal: 10,
    paddingLeft: 5,
  },
  subLabel: {
    fontSize: 10,
    paddingLeft: 5,
  },
  date: {
    padding: 5,
  },
  amount: {
    padding: 5,
  },
  divider: {
    borderBottomColor: "rgba(136, 136, 136, 0.2)",
    borderBottomWidth: 0.75,
    width: "100%",
  },
});
