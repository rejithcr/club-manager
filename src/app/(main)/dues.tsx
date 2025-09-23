import { View, StyleSheet, TouchableOpacity } from "react-native";
import ThemedView from "@/src/components/themed-components/ThemedView";
import ShadowBox from "@/src/components/ShadowBox";
import ThemedText from "@/src/components/themed-components/ThemedText";
import ThemedIcon from "@/src/components/themed-components/ThemedIcon";
import { useTheme } from "@/src/hooks/use-theme";
import Spacer from "@/src/components/Spacer";
import Divider from "@/src/components/Divider";
import * as Linking from "expo-linking";
import { useState } from "react";
import RoundedContainer from "@/src/components/RoundedContainer";
import Collapsible from "@/src/components/Collapsible";

type ClubDueType = {
  clubId: string;
  clubName: string;
  upiId: string;
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
  const { colors } = useTheme();

  const makeUpiPayment = async (amount: number, clubName: string, upiId: string) => {
    const upiUri = `upi://pay?pa=${upiId}&tid=txn1d1&tr=REF123456&tn=${clubName}${" fee payment"}&am=${amount}&cu=INR`;
    console.log(upiUri);
    const canOpen = await Linking.canOpenURL(upiUri);
    if (canOpen) {
      Linking.openURL(upiUri);
    } else {
      alert("No UPI app found on device");
    }
  };

  return (
    <Collapsible
      header={
        <>
          <ThemedText style={{ width: "60%", fontSize: 15 }}>{club.clubName}</ThemedText>
          <ThemedText style={{ width: "30%", fontWeight: "bold", fontSize: 15, textAlign: "right" }}>
            Rs. {club.dueAmount}
          </ThemedText>
        </>
      }
    >
      <Spacer space={4} />
      {club.dues.map((due: any, idx: number) => (
        <View key={due.paymentId.toString() + due.feeType} style={styles.item}>
          {idx > 0 && <Divider />}
          <View style={{ paddingVertical: 5, marginLeft: 10 }}>
            <ThemedText style={styles.label}>{due.fee} </ThemedText>
            <ThemedText style={{...styles.subLabel, color: colors.subText}}>{due.feeDesc} </ThemedText>
          </View>
          <ThemedText style={styles.amount}>Rs. {due.amount}</ThemedText>
        </View>
      ))}
      {club.upiId && (
        <TouchableOpacity onPress={() => makeUpiPayment(club.dueAmount, club.clubName, club.upiId)}>
          <ThemedText style={{ ...styles.button, backgroundColor: colors.primary }}>Pay Now</ThemedText>
        </TouchableOpacity>
      )}
    </Collapsible>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    width: 150,
    textAlign: "center",
    padding: 10,
    alignSelf: "center",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
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
