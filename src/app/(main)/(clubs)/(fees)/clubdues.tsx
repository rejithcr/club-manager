import { TouchableOpacity, View, StyleSheet, ScrollView, RefreshControl, Image, Linking } from "react-native";
import React, { useContext, useState } from "react";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { ClubContext } from "@/src/context/ClubContext";
import ThemedView from "@/src/components/themed-components/ThemedView";
import ThemedText from "@/src/components/themed-components/ThemedText";
import ThemedIcon from "@/src/components/themed-components/ThemedIcon";
import { useTheme } from "@/src/hooks/use-theme";
import Spacer from "@/src/components/Spacer";
import Divider from "@/src/components/Divider";
import { useGetClubDuesQuery, useMarkDuesPaidMutation } from "@/src/services/feeApi";
import Modal from "react-native-modal";
import ThemedCheckBox from "@/src/components/themed-components/ThemedCheckBox";
import ThemedButton from "@/src/components/ThemedButton";
import { ROLE_ADMIN } from "@/src/utils/constants";
import { UserContext } from "@/src/context/UserContext";
import { showSnackbar } from "@/src/components/snackbar/snackbarService";
import Animated, { FadeInUp } from "react-native-reanimated";
import Banner from "@/src/components/Banner";
import RoundedContainer from "@/src/components/RoundedContainer";

const ClubDues = () => {
  const { clubInfo } = useContext(ClubContext);
  const { userInfo } = useContext(UserContext);
  const { colors } = useTheme();
  const {
    data: duesByMembers,
    isLoading,
    isFetching,
    refetch,
  } = useGetClubDuesQuery({ clubId: clubInfo.clubId, duesByClub: "true" });

  const totalDue = duesByMembers
    ? duesByMembers.reduce(
        (sum: number, member: any) =>
          sum + (member.dues ? member.dues.reduce((mSum: number, due: any) => mSum + (due.amount || 0), 0) : 0),
        0
      )
    : 0;

  const [selectedItems, setSelectedItems] = useState<{ paymentId: number; feeType: string; amount?: number }[]>([]);
  const [markDuesPaid, { isLoading: isMarking }] = useMarkDuesPaidMutation();
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [paymentsPreview, setPaymentsPreview] = useState<{ paymentId: number; feeType: string; amount?: number }[]>([]);

  const toggleSelected = (id: number, feeType: string, amount?: number) => {
    setSelectedItems((prev) => {
      const exists = prev.find((p) => p.paymentId === id && p.feeType === feeType);
      if (exists) return prev.filter((p) => !(p.paymentId === id && p.feeType === feeType));
      return [...prev, { paymentId: id, feeType, amount }];
    });
  };

  const handleMarkAsPaid = async () => {
    const paymentsToMark =
      selectedItems.length > 0
        ? selectedItems
        : (duesByMembers || []).flatMap((m: any) =>
            (m.dues || []).map((d: any) => ({ paymentId: d.paymentId, feeType: d.feeType, amount: d.amount }))
          );

    if (paymentsToMark.length === 0) {
      showSnackbar("Please select any dues to mark as paid.");
      return;
    }

    // show confirmation modal with preview
    setPaymentsPreview(paymentsToMark);
    setIsConfirmVisible(true);
  };

  const confirmMarkAsPaid = async () => {
    setIsConfirmVisible(false);
    if (paymentsPreview.length === 0) {
      showSnackbar("No dues to mark.");
      setIsConfirmVisible(false);
      return;
    }
    try {
      await markDuesPaid({ clubId: clubInfo.clubId, payments: paymentsPreview, email: userInfo.email }).unwrap();
      setSelectedItems([]);
    } catch (err: any) {
      console.error(err);
      showSnackbar("Failed to mark as paid. Try again.", "error");
    }
  };

  const handleShareToWhatsApp = async () => {
    if (!duesByMembers || duesByMembers.length === 0) {
      showSnackbar("No dues to share");
      return;
    }
    const lines: string[] = [];
    (duesByMembers || []).forEach((member: any) => {
      const name = [member.firstName, member.lastName].filter(Boolean).join(" ") || member.email || "Member";
      const amount = member.totalDue ?? (member.dues || []).reduce((s: number, d: any) => s + (d.amount || 0), 0);
      const upi = clubInfo?.upiId || "";
      const tn = `${clubInfo?.clubName || "Club"} fee payment`;
      const link = `upi://pay?pa=${upi}&tn=${encodeURIComponent(tn)}&am=${amount}&cu=INR`;
      lines.push(`*${name}: Rs. ${amount}*`);
    });

    const intro = `Dear Member,\n\nThis is a polite request to clear the following club dues. Timely payments help the functioning of the club and are much appreciated. Please clear the dues by clicking the payment link provided for each entry below:\n\n`;
    const outro = `\n\nPlease click on below link for due details and paying the fees now.\nhttps://club-manager-33a8c.web.app?showClubDues=${clubInfo?.clubId}\n\nThank you for supporting\n${clubInfo?.clubName}.`;

    const message = intro + lines.join("\n") + outro;

    const appUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
    const webUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    try {
      const canOpen = await Linking.canOpenURL(appUrl);
      if (canOpen) {
        await Linking.openURL(appUrl);
      } else {
        await Linking.openURL(webUrl);
      }
    } catch (err) {
      console.error("WhatsApp share failed", err);
      showSnackbar("Unable to open WhatsApp. Try copying the message.", "error");
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <Spacer space={10} />
      <Banner backgroundColor={totalDue == 0 ? colors.success : colors.warning}>
        <View>
          <ThemedText style={{ fontSize: 16, color: colors.background }}>Total Due</ThemedText>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <ThemedText style={{ fontSize: 30, fontWeight: "bold", color: colors.background }}>
              Rs. {totalDue}
            </ThemedText>
          )}
        </View>
        <ThemedIcon name="MaterialCommunityIcons:account-cash" size={50} color={colors.background} />
      </Banner>
      <Spacer space={10} />
      <ScrollView refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}>
        {isLoading ? (
          <LoadingSpinner />
        ) : duesByMembers && duesByMembers.length > 0 ? (
          <RoundedContainer>
            {duesByMembers.map((item: any, idx: number) => {
              return (
                <View key={item.memberId}>
                  {idx > 0 && <Divider />}
                  <Animated.View entering={FadeInUp.duration(380).delay(idx * 80)} style={{ overflow: "hidden" }}>
                    <MemberDue
                      key={item.memberId}
                      member={item}
                      selectedItems={selectedItems}
                      toggle={toggleSelected}
                    />
                  </Animated.View>
                </View>
              );
            })}
          </RoundedContainer>
        ) : (
          !isLoading && <ThemedText style={{ textAlign: "center", marginTop: 12 }}>Yay!! No dues 👏</ThemedText>
        )}
        <Spacer space={50} />
      </ScrollView>
      {clubInfo.role === ROLE_ADMIN && (
        <>
          <ThemedButton 
            disabled={isMarking || selectedItems.length === 0}
            style={{ bottom: 40, position: "absolute", alignSelf: "center" }}
            title={isMarking ? "Marking..." : "Mark as paid"}
            onPress={() => handleMarkAsPaid()}
          />
          <TouchableOpacity disabled={isLoading || duesByMembers?.length === 0}
            onPress={handleShareToWhatsApp}
            style={{ position: "absolute", right: 50, bottom: 40, padding: 8, borderRadius: 20 }}
          >
            <ThemedIcon name={"MaterialIcons:share"} size={22} color={duesByMembers?.length === 0 ? colors.disabled : colors.text}/>
          </TouchableOpacity>
          <ConfirmModal
            visible={isConfirmVisible}
            payments={paymentsPreview}
            onConfirm={confirmMarkAsPaid}
            onCancel={() => setIsConfirmVisible(false)}
          />
        </>
      )}
    </ThemedView>
  );
};

const ConfirmModal = (props: {
  visible: boolean;
  payments: { paymentId: number; feeType: string; amount?: number }[];
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  const { visible, payments, onConfirm, onCancel } = props;
  const total = payments.reduce((s, p) => s + (p.amount || 0), 0);
  return (
    <Modal isVisible={visible} onBackdropPress={onCancel} onBackButtonPress={onCancel}>
      <ThemedView style={{ padding: 16, borderRadius: 6 }}>
        <ThemedText style={{ fontWeight: "bold", marginBottom: 8, fontSize: 20 }}>Confirm updates</ThemedText>
        <ThemedText>Items: {payments.length}</ThemedText>
        <ThemedText>Total: Rs. {total}</ThemedText>
        <ThemedText style={{ marginTop: 8, fontSize: 12, color: "gray" }}>
          You are about to mark the listed dues as paid.
        </ThemedText>
        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 12 }}>
          <ThemedButton title="Confirm" onPress={onConfirm} />
          <ThemedButton title="Cancel" onPress={onCancel} />
        </View>
      </ThemedView>
    </Modal>
  );
};

const MemberDue = (props: {
  member: any;
  selectedItems: { paymentId: number; feeType: string; amount?: number }[];
  toggle: (id: number, feeType: string, amount?: number) => void;
}) => {
  const { selectedItems, toggle } = props;
  const [showDues, setShowDues] = React.useState(false);
  const { colors } = useTheme();
  return (
    <>
      <TouchableOpacity
        onPress={() => setShowDues((prev) => !prev)}
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 10,
          paddingHorizontal: 20,
        }}
      >
        <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10,}}>
            <ThemedIcon
              size={20}
              name={
                showDues ? "MaterialCommunityIcons:chevron-down-circle" : "MaterialCommunityIcons:chevron-right-circle"
              }
              color={colors.nav}
            />
            {props.member?.photo ? (
              <Image source={{ uri: props.member?.photo }} style={{ height: 32, width: 32, borderRadius: 100 }} />
            ) : (
              <ThemedIcon name={"MaterialIcons:account-circle"} size={32} />
            )}
            <ThemedText style={{ fontSize: 16 }} ellipsizeMode="tail">
              {props?.member.firstName} {props?.member.lastName}
            </ThemedText>
          </View>
          <ThemedText style={{ fontWeight: "500", fontSize: 16, textAlign: "right" }}>
            Rs. {props?.member.totalDue}
          </ThemedText>
        </View>
      </TouchableOpacity>
      {showDues &&
        props?.member.dues.map((item: any, idx: number) => {
          const checked = !!selectedItems.find((p) => p.paymentId === item.paymentId && p.feeType === item.feeType);
          return (
            <View key={item.paymentId.toString() + item.feeType}>
              {idx > 0 && <Divider style={{ width: "80%" }} />}
              <MemberFeeItem
                paymentId={item.paymentId}
                fee={item.fee}
                feeType={item.feeType}
                feeDesc={item.feeDesc}
                amount={item.amount}
                checked={checked}
                onToggle={() => toggle(item.paymentId, item.feeType, item.amount)}
                key={item.paymentId.toString() + item.feeType}
              />
            </View>
          );
        })}
    </>
  );
};

export default ClubDues;

const MemberFeeItem = (props: {
  paymentId: number;
  fee: string;
  feeType: string;
  feeDesc: string;
  amount: number;
  checked?: boolean;
  onToggle?: () => void;
}) => {
  const { paymentId, fee, feeDesc, amount, checked = false, onToggle } = props;
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      key={paymentId.toString() + props.feeType}
      style={styles.item}
      onPress={() => onToggle && onToggle()}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <ThemedCheckBox checked={checked} />
        <View style={{ paddingVertical: 5 }}>
          <ThemedText style={styles.label}>{fee} </ThemedText>
          <ThemedText style={{ ...styles.subLabel, color: colors.disabled }}>{feeDesc} </ThemedText>
        </View>
      </View>
      <ThemedText style={styles.amount}>Rs. {amount}</ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    width: "75%",
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
    textAlign: "right",
  },
  divider: {
    borderBottomColor: "rgba(136, 136, 136, 0.2)",
    borderBottomWidth: 0.75,
    width: "85%",
    alignSelf: "center",
  },
});
