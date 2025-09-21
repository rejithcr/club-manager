import { TouchableOpacity, View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import React, { useContext, useState } from "react";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { ClubContext } from "@/src/context/ClubContext";
import ThemedView from "@/src/components/themed-components/ThemedView";
import ThemedText from "@/src/components/themed-components/ThemedText";
import ThemedIcon from "@/src/components/themed-components/ThemedIcon";
import { useTheme } from "@/src/hooks/use-theme";
import Spacer from "@/src/components/Spacer";
import ShadowBox from "@/src/components/ShadowBox";
import Divider from "@/src/components/Divider";
import { useGetClubDuesQuery, useMarkDuesPaidMutation } from "@/src/services/feeApi";
import Modal from "react-native-modal";
import ThemedCheckBox from "@/src/components/themed-components/ThemedCheckBox";
import ThemedButton from "@/src/components/ThemedButton";
import { ROLE_ADMIN } from "@/src/utils/constants";
import { UserContext } from "@/src/context/UserContext";
import { showSnackbar } from "@/src/components/snackbar/snackbarService";

const ClubDues = () => {
  const { clubInfo } = useContext(ClubContext);
  const { userInfo } = useContext(UserContext);
  const { data: duesByMembers, isLoading, isFetching, refetch } = useGetClubDuesQuery({ clubId: clubInfo.clubId, duesByClub: "true" });

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

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}>
        <Spacer space={5} />
        {isLoading && <LoadingSpinner />}
        <View style={{ width: "85%", alignSelf: "center" }}>
          {!isLoading &&
            duesByMembers?.map((item: any) => {
              return (
                <View key={item.memberId}>
                  <MemberDue key={item.memberId} member={item} selectedItems={selectedItems} toggle={toggleSelected} />
                  <Spacer space={4} />
                </View>
              );
            })}
        </View>
      </ScrollView>
      {clubInfo.role === ROLE_ADMIN && (
        <>
          <ThemedButton
            disabled={isMarking || selectedItems.length === 0}
            style={{ bottom: 30, position: "absolute", alignSelf: "center" }}
            title={isMarking ? "Marking..." : "Mark as paid"}
            onPress={() => handleMarkAsPaid()}
          />
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
  const [isShown, setIsShown] = useState(false);
  const { colors } = useTheme();
  const showMemberDues = () => {
    setIsShown(!isShown);
  };
  return (
    <>
      <ShadowBox style={{ width: "100%" }}>
        <TouchableOpacity
          onPress={showMemberDues}
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", width: "70%" }}>
            <ThemedIcon
              size={20}
              name={
                isShown ? "MaterialCommunityIcons:chevron-down-circle" : "MaterialCommunityIcons:chevron-right-circle"
              }
              color={colors.nav}
            />
            <Spacer hspace={5} />
            <ThemedText style={{ fontSize: 15 }}>
              {props?.member.firstName} {props?.member.lastName}
            </ThemedText>
          </View>
          <ThemedText style={{ width: "30%", fontWeight: "bold", fontSize: 15, textAlign: "right" }}>
            Rs. {props?.member.totalDue}
          </ThemedText>
        </TouchableOpacity>
      </ShadowBox>
      {isShown &&
        props?.member.dues.map((item: any) => {
          const checked = !!selectedItems.find((p) => p.paymentId === item.paymentId && p.feeType === item.feeType);
          return (
            <View key={item.paymentId.toString() + item.feeType}>
              <Divider />
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
          <ThemedText style={styles.subLabel}>{feeDesc} </ThemedText>
        </View>
      </View>
      <ThemedText style={styles.amount}>Rs. {amount}</ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    width: "95%",
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
