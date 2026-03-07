import { useContext, useState, useMemo } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { ClubContext } from "@/src/context/ClubContext";
import ThemedView from "@/src/components/themed-components/ThemedView";
import ThemedText from "@/src/components/themed-components/ThemedText";
import Spacer from "@/src/components/Spacer";
import InputText from "@/src/components/InputText";
import ThemedButton from "@/src/components/ThemedButton";
import { useSendNotificationMutation } from "@/src/services/memberApi";
import { useGetClubMembersQuery } from "@/src/services/clubApi";
import { useTheme } from "@/src/hooks/use-theme";
import ThemedCheckBox from "@/src/components/themed-components/ThemedCheckBox";
import Alert, { AlertProps } from "@/src/components/Alert";
import { appStyles } from "@/src/utils/styles";
import Divider from "@/src/components/Divider";
import Chip from "@/src/components/Chip";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import ThemedIcon from "@/src/components/themed-components/ThemedIcon";

export default function SendNotification() {
    const { clubInfo } = useContext(ClubContext);
    const { colors } = useTheme();
    const router = useRouter();

    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationMessage, setNotificationMessage] = useState("");
    const [targetType, setTargetType] = useState<"all" | "selective">("all");
    const [selectedMemberIds, setSelectedMemberIds] = useState<Set<number>>(new Set());
    const [isSelectionModalVisible, setIsSelectionModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [alertConfig, setAlertConfig] = useState<AlertProps | null>(null);

    const { data: membersData, isLoading: isLoadingMembers } = useGetClubMembersQuery({
        clubId: clubInfo.clubId,
        limit: 1000 // Get all members for selection
    });

    const [sendNotification, { isLoading: isSending }] = useSendNotificationMutation();

    const members = useMemo(() => {
        const list = membersData || [];
        return [...list].sort((a: any, b: any) =>
            `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
        );
    }, [membersData]);

    const filteredMembers = useMemo(() => {
        if (!searchQuery) return members;
        const query = searchQuery.toLowerCase();
        return members.filter((m: any) =>
            m.firstName?.toLowerCase().includes(query) ||
            m.lastName?.toLowerCase().includes(query)
        );
    }, [members, searchQuery]);

    const toggleMemberSelection = (memberId: number) => {
        setSelectedMemberIds(prev => {
            const next = new Set(prev);
            if (next.has(memberId)) next.delete(memberId);
            else next.add(memberId);
            return next;
        });
    };

    const handleSend = async () => {
        if (!notificationTitle || !notificationMessage) {
            setAlertConfig({
                visible: true,
                title: "Missing Information",
                message: "Please provide both a title and a message.",
                buttons: [{ text: "OK", onPress: () => setAlertConfig(null) }]
            });
            return;
        }

        const targetIds = targetType === 'all' ? members.map((m: any) => m.memberId) : Array.from(selectedMemberIds);
        if (targetIds.length === 0) {
            setAlertConfig({
                visible: true,
                title: "No Members Selected",
                message: "Please select at least one member to notify.",
                buttons: [{ text: "OK", onPress: () => setAlertConfig(null) }]
            });
            return;
        }

        try {
            await sendNotification({
                memberIds: targetIds,
                title: notificationTitle,
                message: notificationMessage,
                clubId: clubInfo.clubId,
            }).unwrap();

            setAlertConfig({
                visible: true,
                title: "Success",
                message: "Notifications sent successfully.",
                buttons: [{
                    text: "OK", onPress: () => {
                        setAlertConfig(null);
                        router.back();
                    }
                }]
            });
        } catch (err) {
            setAlertConfig({
                visible: true,
                title: "Error",
                message: "Failed to send notifications. Please try again.",
                buttons: [{ text: "OK", onPress: () => setAlertConfig(null) }]
            });
        }
    };

    return (
        <ThemedView style={{ flex: 1, padding: 16 }}>
            {isLoadingMembers ? (
                <LoadingSpinner />
            ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                    <ThemedText style={[appStyles.heading, { marginBottom: 10 }]}>Recipient</ThemedText>

                    <TouchableOpacity
                        style={styles.optionItem}
                        onPress={() => setTargetType("all")}
                    >
                        <ThemedCheckBox checked={targetType === "all"} />
                        <Spacer hspace={10} />
                        <ThemedText>All Members ({members.length})</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.optionItem}
                        onPress={() => {
                            setTargetType("selective");
                            setIsSelectionModalVisible(true);
                        }}
                    >
                        <ThemedCheckBox checked={targetType === "selective"} />
                        <Spacer hspace={10} />
                        <ThemedText>Select Specific Members ({selectedMemberIds.size} selected)</ThemedText>
                    </TouchableOpacity>

                    {targetType === "selective" && (
                        <View style={styles.selectedMembersContainer}>
                            {members
                                .filter(m => selectedMemberIds.has(m.memberId))
                                .map(m => (
                                    <Chip
                                        key={m.memberId}
                                        onRemove={() => toggleMemberSelection(m.memberId)}
                                        style={styles.selectedChip}
                                    >
                                        <ThemedText style={{ fontSize: 12 }}>{m.firstName} {m.lastName}</ThemedText>
                                    </Chip>
                                ))}
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => setIsSelectionModalVisible(true)}
                            >
                                <ThemedIcon name="MaterialIcons:add-circle-outline" size={32} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                    )}

                    <Divider style={{ marginVertical: 20 }} />

                    <ThemedText style={[appStyles.heading, { marginBottom: 10 }]}>Message Content</ThemedText>

                    <InputText
                        label="Title"
                        placeholder="e.g. Important Announcement"
                        value={notificationTitle}
                        onChangeText={setNotificationTitle}
                    />

                    <InputText
                        label="Message"
                        placeholder="Enter your message here..."
                        value={notificationMessage}
                        onChangeText={setNotificationMessage}
                        multiline
                        containerStyle={{ marginTop: 10 }}
                    />

                    <Spacer space={30} />

                    <ThemedButton
                        title={isSending ? "Sending..." : "Send Notification"}
                        onPress={handleSend}
                        disabled={isSending}
                    />
                    <Spacer space={50} />
                </ScrollView>
            )}

            {/* Member Selection Modal */}
            <Modal
                visible={isSelectionModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsSelectionModalVisible(false)}
            >
                <ThemedView style={styles.modalContainer}>
                    <ThemedView style={[styles.modalContent, { backgroundColor: colors.background }]}>
                        <View style={styles.modalHeader}>
                            <ThemedText style={appStyles.heading}>Select Members</ThemedText>
                            <TouchableOpacity onPress={() => setIsSelectionModalVisible(false)}>
                                <MaterialIcons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <InputText
                            placeholder="Search by name..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            containerStyle={{ width: "100%", marginBottom: 15 }}
                        />

                        <ScrollView style={{ flex: 1 }}>
                            <View style={styles.chipContainer}>
                                {filteredMembers.map((m: any) => (
                                    <Chip
                                        key={m.memberId}
                                        selected={selectedMemberIds.has(m.memberId)}
                                        onPress={() => toggleMemberSelection(m.memberId)}
                                        style={styles.memberChip}
                                    >
                                        <ThemedText>{m.firstName} {m.lastName}</ThemedText>
                                    </Chip>
                                ))}
                            </View>
                        </ScrollView>

                        <Spacer space={20} />
                        <ThemedButton
                            title={`Done (${selectedMemberIds.size} selected)`}
                            onPress={() => setIsSelectionModalVisible(false)}
                        />
                    </ThemedView>
                </ThemedView>
            </Modal>

            {alertConfig && <Alert {...alertConfig} />}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    optionItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        height: "80%",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 20,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    chipContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    memberChip: {
        marginBottom: 5,
    },
    selectedMembersContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 15,
        alignItems: "center",
    },
    selectedChip: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#ccc",
        paddingVertical: 4,
        paddingHorizontal: 10,
    },
    addButton: {
        padding: 4,
    },
});
