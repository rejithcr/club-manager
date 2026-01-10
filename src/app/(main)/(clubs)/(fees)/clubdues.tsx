import { TouchableOpacity, View, StyleSheet, ScrollView, RefreshControl, Image, Linking, TextInput, Share, Platform } from "react-native";
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
import NumberTicker from "@/src/components/NumberTicker";

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
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);

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
    // Open the share preview modal instead of directly sharing
    setIsShareModalVisible(true);
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <Spacer space={10} />
      <Banner backgroundColor={totalDue == 0 ? colors.success : colors.warning}>
        <View>
          <ThemedText style={{color: colors.background }}>Total Due</ThemedText>          
          <NumberTicker
            value={totalDue?.toFixed(0)}
            isLoading={isLoading}
            style={{ fontSize: 30, fontWeight: 'bold', color: colors.background }}
          />
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
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              position: "absolute",
              bottom: 40,
            }}
          >
            <ThemedButton
              disabled={isMarking || selectedItems.length === 0}
              title={isMarking ? "Marking..." : "Mark as paid"}
              onPress={() => handleMarkAsPaid()}
            />
            <TouchableOpacity
              disabled={isLoading || duesByMembers?.length === 0}
              onPress={handleShareToWhatsApp}
            >
              <ThemedIcon
                name={"MaterialIcons:share"}
                size={22}
                color={duesByMembers?.length === 0 ? colors.disabled : colors.text}
              />
            </TouchableOpacity>
          </View>

          <ConfirmModal
            visible={isConfirmVisible}
            payments={paymentsPreview}
            onConfirm={confirmMarkAsPaid}
            onCancel={() => setIsConfirmVisible(false)}
          />

          <SharePreviewModal
            visible={isShareModalVisible}
            duesByMembers={duesByMembers}
            totalDue={totalDue}
            clubInfo={clubInfo}
            onClose={() => setIsShareModalVisible(false)}
          />
        </>
      )}
    </ThemedView>
  );
};

const SharePreviewModal = (props: {
  visible: boolean;
  duesByMembers: any[];
  totalDue: number;
  clubInfo: any;
  onClose: () => void;
}) => {
  const { visible, duesByMembers, totalDue, clubInfo, onClose } = props;
  const { colors } = useTheme();
  const [includeMemberDues, setIncludeMemberDues] = useState(true);
  const [editableMessage, setEditableMessage] = useState("");

  // Generate the message whenever the modal opens or checkbox changes
  React.useEffect(() => {
    if (visible) {
      const lines: string[] = [];
      
      if (includeMemberDues) {
        (duesByMembers || []).forEach((member: any) => {
          const name = [member.firstName, member.lastName].filter(Boolean).join(" ") || member.email || "Member";
          const amount = member.totalDue ?? (member.dues || []).reduce((s: number, d: any) => s + (d.amount || 0), 0);
          lines.push(`- ${name}: *₹ ${amount}*`);
        });
      }

      const intro = `Dear Member,\n\nThis is a polite request to clear the following club dues. Timely payments help the functioning of the club and are much appreciated.\n\n`;
      const dueAmount = `*Total Due: ₹ ${totalDue?.toFixed(0)}*\n\n`;
      const membersList = includeMemberDues ? lines.join("\n") + "\n\n" : "";
      const outro = `Please click on below link to see your dues breakdown and pay.\nhttps://sportsclubsmanager.com?showClubDues=${clubInfo?.clubId}\n\nThank you for supporting\n${clubInfo?.clubName}.`;

      const message = intro + dueAmount + membersList + outro;
      setEditableMessage(message);
    }
  }, [visible, includeMemberDues, duesByMembers, totalDue, clubInfo]);

  const handleShareToWhatsApp = async () => {
    if (!editableMessage.trim()) {
      showSnackbar("Message is empty");
      return;
    }

    const webUrl = `https://wa.me/?text=${encodeURIComponent(editableMessage)}`;
    
    try {
      // Try native Share API first (better for iOS)
      if (Platform.OS === 'ios') {
        try {
          await Share.share({
            message: editableMessage,
          });
          onClose();
          return;
        } catch (shareErr) {
          console.log("Native share failed, trying WhatsApp URL");
        }
      }

      // Try WhatsApp URL
      const canOpen = await Linking.canOpenURL(webUrl);
      if (canOpen) {
        await Linking.openURL(webUrl);
        onClose();
      } else {
        // Fallback to native share
        await Share.share({
          message: editableMessage,
        });
        onClose();
      }
    } catch (err) {
      console.error("Share failed", err);
      showSnackbar("Unable to share. Please copy the message manually.", "error");
    }
  };

  return (
    <Modal 
      isVisible={visible} 
      onBackdropPress={onClose} 
      onBackButtonPress={onClose}
      style={{ margin: 0, justifyContent: 'flex-end' }}
    >
      <ThemedView style={{ 
        borderTopLeftRadius: 20, 
        borderTopRightRadius: 20, 
        paddingTop: 20,
        paddingHorizontal: 16,
        paddingBottom: 30,
        maxHeight: '90%'
      }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <ThemedText style={{ fontWeight: "bold", fontSize: 20 }}>Share Dues</ThemedText>
          <TouchableOpacity onPress={onClose}>
            <ThemedIcon name="MaterialIcons:close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Checkbox for including member dues */}
        <TouchableOpacity 
          onPress={() => setIncludeMemberDues(!includeMemberDues)}
          style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            marginBottom: 16,
            paddingVertical: 8
          }}
        >
          <ThemedCheckBox checked={includeMemberDues} />
          <ThemedText style={{ marginLeft: 8 }}>Include dues by members</ThemedText>
        </TouchableOpacity>

        {/* Editable message preview */}
        <ThemedText style={{ fontSize: 12, color: colors.subText, marginBottom: 8 }}>
          Preview & Edit Message:
        </ThemedText>
        <ScrollView style={{ 
          borderWidth: 1, 
          borderColor: colors.border, 
          borderRadius: 8, 
          padding: 12,
          backgroundColor: colors.background,
          maxHeight: 350,
          marginBottom: 16
        }}>
          <TextInput
            value={editableMessage}
            onChangeText={setEditableMessage}
            multiline
            style={{
              color: colors.text,
              fontSize: 14,
              lineHeight: 20,
              minHeight: 300,
              textAlignVertical: 'top'
            }}
            placeholderTextColor={colors.subText}
            placeholder="Enter message to share..."
          />
        </ScrollView>

        {/* Share button */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <ThemedButton 
              title="Share to whatsapp"
              onPress={handleShareToWhatsApp}
              icon="MaterialCommunityIcons:whatsapp"
            />
          </View>
        </View>
      </ThemedView>
    </Modal>
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
        <ThemedText>Total: ₹ {total}</ThemedText>
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
          paddingHorizontal:18,
        }}
      >
        <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
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
            <ThemedText style={{ marginLeft: 3, maxWidth: 135}}>
              {props?.member.firstName} {props?.member.lastName}
            </ThemedText>
          </View>
          <ThemedText style={{ fontSize: 15, textAlign: "right" }}>
            ₹ {props?.member.totalDue}
          </ThemedText>
        </View>
      </TouchableOpacity>
      {showDues &&
        <>
        {props?.member.dues.map((item: any, idx: number) => {
          const checked = !!selectedItems.find((p) => p.paymentId === item.paymentId && p.feeType === item.feeType);
          return (
            <View key={item.paymentId.toString() + item.feeType}>
              {idx > 0 && <Divider style={{ width: "75%" }} />}
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
        <Spacer space={10} />
        </>}
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
  const { clubInfo } = useContext(ClubContext);
  const { paymentId, fee, feeDesc, amount, checked = false, onToggle } = props;
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      disabled={clubInfo.role !== ROLE_ADMIN}
      key={paymentId.toString() + props.feeType}
      style={styles.item}
      onPress={() => onToggle && onToggle()}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {clubInfo.role === ROLE_ADMIN && <ThemedCheckBox checked={checked} />}
        <View style={{ paddingVertical: 5, maxWidth: 150 }}>
          <ThemedText style={styles.label}>{fee} </ThemedText>
          <ThemedText style={{ ...styles.subLabel, color: colors.disabled }}>{feeDesc} </ThemedText>
        </View>
      </View>
      <ThemedText style={styles.amount}>₹ {amount}</ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    width: "80%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: "9%"
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
