import React, { useContext, useEffect, useState } from "react";
import ThemedView from "@/src/components/themed-components/ThemedView";
import { useSearchParams } from "expo-router/build/hooks";
import { Event } from "@/src/types/event";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import Spacer from "@/src/components/Spacer";
import ThemedText from "@/src/components/themed-components/ThemedText";
import { ClubContext } from "@/src/context/ClubContext";
import { Member } from "@/src/types/member";
import ThemedHeading from "@/src/components/themed-components/ThemedHeading";
import Chip from "@/src/components/Chip";
import ThemedButton from "@/src/components/ThemedButton";
import Modal from "react-native-modal";
import { Picker } from "@react-native-picker/picker";
import InputText from "@/src/components/InputText";
import { View } from "react-native";
import { arrayDifference } from "@/src/utils/array";
import ThemedIcon from "@/src/components/themed-components/ThemedIcon";
import { router } from "expo-router";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/src/hooks/use-theme";
import Alert, { AlertProps } from "@/src/components/Alert";
import { ROLE_ADMIN } from "@/src/utils/constants";
import {
  useDeleteEventMutation,
  useLazyGetClubMembersQuery,
  useLazyGetEventMembersQuery,
  useUpdateEventAttendanceMutation,
  useLazyGetEventQuery,
} from "@/src/services/clubApi";
import Banner from "@/src/components/Banner";
import NumberTicker from "@/src/components/NumberTicker";
import { useGetEventTransactionsQuery } from "@/src/services/feeApi";
import usePaginatedQuery from "@/src/hooks/usePaginatedQuery";
import Divider from "@/src/components/Divider";
import LabelWithIcon from "@/src/components/LabelWithIcon";

const EventDetails = () => {
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [attendedMembers, setAttendedMembers] = useState<Member[]>([]);
  const [attendedMembersBackup, setAttendedMembersBackup] = useState<Member[]>([]);
  const [remainingMembers, setRemainingMembers] = useState<Member[]>([]);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [eventStatus, setEventStatus] = useState("Completed");
  const [attendanceDiff, setAttendanceDiff] = useState<{ added: any[]; removed: any[] }>({ added: [], removed: [] });
  const [attendanceChanged, setAttendanceChanged] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [event, setEvent] = useState<Event>();
  const params = useSearchParams();
  const { clubInfo } = useContext(ClubContext);
  const { colors } = useTheme();

  const [getClubMembers] = useLazyGetClubMembersQuery();
  const [getAtendedMembers] = useLazyGetEventMembersQuery();
  const [getEventById, { isFetching: isFetchingEvent }] = useLazyGetEventQuery();

  const eventObj = JSON.parse(params.get("event") || "{}");
  const fallbackEventId = params.get("eventId");

  const loadClubMembers = async (eventId: string) => {
    setIsLoadingMembers(true);
    try {
      const attendedMembers = await getAtendedMembers({ eventId }).unwrap();
      const attendedMembersLocal = attendedMembers.filter((m: { present: any }) => m.present);
      setAttendedMembersBackup([...attendedMembersLocal]);
      setAttendedMembers(
        attendedMembersLocal.sort((m1: { firstName: string }, m2: { firstName: any }) =>
          m1.firstName.localeCompare(m2.firstName)
        )
      );
      const members = await getClubMembers({ clubId: clubInfo.clubId }).unwrap();
      const difference = members.filter(
        (m: any) => !attendedMembersLocal.some((e: any) => e.membershipId == m.membershipId)
      );
      setRemainingMembers(
        difference.sort((m1: { firstName: string }, m2: { firstName: any }) => m1.firstName.localeCompare(m2.firstName))
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  useEffect(() => {
    const initData = async () => {
      let currentEvent = eventObj;
      if (!currentEvent.eventId && fallbackEventId) {
        try {
          const resp: any = await getEventById({ eventId: fallbackEventId }).unwrap();
          // The backend might return an array of 1 item, or the object directly.
          if (Array.isArray(resp) && resp.length > 0) {
            currentEvent = resp[0];
          } else if (resp && resp.eventId) {
            currentEvent = resp;
          }
          console.log("Fetched event remotely:", currentEvent);
        } catch (error) {
          console.error("Failed to fetch event:", error);
          return;
        }
      }
      if (currentEvent && currentEvent.eventId) {
        setEvent(currentEvent);
        loadClubMembers(currentEvent.eventId);
      } else {
        console.log("currentEvent is missing eventId:", currentEvent);
      }
    };
    initData();
  }, [fallbackEventId]);

  const addToAttended = (member: Member) => {
    setAttendedMembers((prev) => {
      return [...prev, member].sort((m1, m2) => m1.firstName.localeCompare(m2.firstName));
    });
    setRemainingMembers((prev) => {
      return prev
        .filter((m) => m.memberId !== member.memberId)
        .sort((m1, m2) => m1.firstName.localeCompare(m2.firstName));
    });
  };
  const removeFromAttended = (member: Member) => {
    setRemainingMembers((prev) => {
      return [...prev, member].sort((m1, m2) => m1.firstName.localeCompare(m2.firstName));
    });
    setAttendedMembers((prev) => {
      return prev
        .filter((m) => m.memberId !== member.memberId)
        .sort((m1, m2) => m1.firstName.localeCompare(m2.firstName));
    });
  };

  useEffect(() => {
    const diff = arrayDifference(attendedMembersBackup, attendedMembers, "membershipId");
    setAttendanceDiff(diff);
    setAttendanceChanged(diff.added.length > 0 || diff.removed.length > 0);
  }, [attendedMembers]);

  const [updateEventAttendance, { isLoading: isSaving }] = useUpdateEventAttendanceMutation();
  const handleSaveChanges = async () => {
    const added = attendanceDiff.added.map((m) => ({ membershipId: m.membershipId, present: true }));
    const removed = attendanceDiff.removed.map((m) => ({ membershipId: m.membershipId, present: false }));
    try {
      await updateEventAttendance({
        eventId: event?.eventId,
        records: [...added, ...removed],
        status: eventStatus,
      }).unwrap();
      setEvent((prev) => (prev ? { ...prev, status: eventStatus } : prev));
    } catch (error) {
      console.error("Error updating attendance:", error);
    } finally {
      setIsConfirmVisible(false);
    }
  };

  const [alertConfig, setAlertConfig] = useState<AlertProps>();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();
  const handleDeleteEvent = () => {
    setAlertConfig({
      visible: true,
      title: "Are you sure!",
      message: "This will delete the event and its attendance records. This cannot be recovered.",
      buttons: [
        {
          text: "OK",
          onPress: async () => {
            setAlertConfig({ visible: false });
            try {
              await deleteEvent({ eventId: event?.eventId }).unwrap();
              router.dismissTo("/(main)/(clubs)/(events)");
            } catch (error) {
              console.error("Error deleting event:", error);
            }
          },
        },
        { text: "Cancel", onPress: () => setAlertConfig({ visible: false }) },
      ],
    });
  };
  const gotoEventTransactions = (eventId: number | undefined) => {
    router.push(`/(main)/(clubs)/(events)/transactions?eventId=${eventId}`);
  };

  const { items: recentTxns = [], isFetching: isTxnsFetching } = usePaginatedQuery(
    useGetEventTransactionsQuery,
    { eventId: eventObj.eventId || fallbackEventId, txnType: "ALL", txnCategoryId: -1 },
    event?.isAttendanceEnabled ? 3 : 5
  );

  const { data: fb = { fundBalance: 0 }, isFetching: isFbFetching } = useGetEventTransactionsQuery({
    eventId: eventObj.eventId || fallbackEventId,
    fundBalance: true,
  });

  return (
    <ThemedView style={{ flex: 1, backgroundColor: colors.background }}>
      {isFetchingEvent ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <LoadingSpinner />
        </View>
      ) : (
        <GestureHandlerRootView>
          <ScrollView>
            {event && <EventItemDetails event={event} clubRole={clubInfo?.role} />}
            <Spacer space={8} />
            {event?.isTransactionEnabled && (
              <>
                <Banner
                  backgroundColor={fb?.fundBalance < 0 ? colors.error : colors.success}
                  onPress={() => gotoEventTransactions(event?.eventId)}
                >
                  <View>
                    <ThemedText style={{ color: colors.background }}>Event Fund Balance</ThemedText>
                    <NumberTicker
                      value={fb.fundBalance}
                      isLoading={isFbFetching}
                      style={{ fontSize: 30, fontWeight: "bold", color: colors.background }}
                    />
                  </View>
                  <ThemedIcon name="MaterialCommunityIcons:wallet" size={50} color={colors.background} />
                </Banner>
                <Spacer space={5} />
              </>
            )}
            {event?.isTransactionEnabled && (
              <ThemedText style={{ color: colors.subText, width: "80%", alignSelf: "center" }}>Recent</ThemedText>
            )}
            {event?.isTransactionEnabled && isTxnsFetching && <LoadingSpinner />}
            {event?.isTransactionEnabled && !isTxnsFetching && (
              <>
                {recentTxns.map((item, idx) => (
                  <View key={item.eventTransactionId}>
                    {idx > 0 && <Divider style={{ width: "80%" }} />}
                    <View
                      style={{
                        width: "80%",
                        alignSelf: "center",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingVertical: 10,
                      }}
                    >
                      <View>
                        <ThemedText style={{ fontWeight: "600" }}>{item.eventCategoryName}</ThemedText>
                        <ThemedText style={{ fontSize: 12 }}>{item.eventTransactionComment}</ThemedText>
                      </View>
                      <View style={{ alignItems: "flex-end" }}>
                        <ThemedText
                          style={{
                            fontWeight: "bold",
                            color: item.eventTransactionType === "CREDIT" ? colors.success : colors.error,
                          }}
                        >
                          {item.eventTransactionType === "CREDIT" ? "+" : "-"} ₹ {item.eventTransactionAmount}
                        </ThemedText>
                        <ThemedText style={{ fontSize: 10 }}>{item.eventTransactionDate}</ThemedText>
                      </View>
                    </View>
                  </View>
                ))}
                <ThemedIcon
                  style={{ alignSelf: "center" }}
                  name={"MaterialIcons:expand-more"}
                  onPress={() => gotoEventTransactions(event?.eventId)}
                  size={32}
                />
              </>
            )}
            {event?.isAttendanceEnabled && (
              <>
                <ThemedText
                  style={{ width: "85%", textAlign: "center", alignSelf: "center", fontSize: 12, color: colors.subText }}
                >
                  Please select from the below list to mark attendance
                </ThemedText>
                <Spacer space={8} />
                <ThemedView
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 10,
                    alignSelf: "center",
                    width: "85%",
                  }}
                >
                  {isLoadingMembers && <LoadingSpinner />}
                  {!isLoadingMembers &&
                    attendedMembers.map((item: any) => (
                      <Chip selected={true} key={item.memberId} onPress={() => removeFromAttended(item)}>
                        <ThemedText>
                          {item?.firstName} {item?.lastName}
                        </ThemedText>
                      </Chip>
                    ))}

                  {!isLoadingMembers && remainingMembers.length == 0 && (
                    <ThemedText style={{ textAlign: "center" }}>Yay!! All members attended 👏</ThemedText>
                  )}
                  {!isLoadingMembers &&
                    remainingMembers.map((item: any) => (
                      <Chip selected={false} key={item.memberId} onPress={() => addToAttended(item)}>
                        <ThemedText>
                          {item?.firstName} {item?.lastName}
                        </ThemedText>
                      </Chip>
                    ))}
                </ThemedView>
              </>
            )}
            <Spacer space={40} />
            <Modal isVisible={isConfirmVisible}>
              <ScrollView>
                <ThemedView style={{ borderRadius: 25, paddingBottom: 20 }}>
                  <ThemedHeading>Update Status</ThemedHeading>
                  {attendanceChanged ? (
                    <ThemedText style={{ textAlign: "center" }}>
                      Review the attendance changes and update event status?
                    </ThemedText>
                  ) : (
                    <ThemedText style={{ textAlign: "center" }}>Update event status?</ThemedText>
                  )}
                  <Spacer space={10} />
                  <ThemedView
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 10,
                      alignSelf: "center",
                      width: "85%",
                    }}
                  >
                    {attendanceDiff.added.map((item: any) => (
                      <Chip selected={true} key={item.memberId}>
                        <ThemedText>
                          {item?.firstName} {item?.lastName}
                        </ThemedText>
                      </Chip>
                    ))}
                    {attendanceDiff.removed.map((item: any) => (
                      <Chip selected={false} key={item.memberId}>
                        <ThemedText>
                          {item?.firstName} {item?.lastName}
                        </ThemedText>
                      </Chip>
                    ))}
                  </ThemedView>
                  <Spacer space={10} />
                  <Picker
                    style={{ width: "80%", alignSelf: "center" }}
                    onValueChange={setEventStatus}
                    selectedValue={eventStatus}
                  >
                    <Picker.Item value={"Scheduled"} label="Scheduled" />
                    <Picker.Item value={"Completed"} label="Completed" />
                    <Picker.Item value={"Cancelled"} label="Cancelled" />
                  </Picker>
                  <Spacer space={10} />
                  {eventStatus === "Cancelled" && (
                    <InputText placeholder="Cancellation Reason" onChangeText={setCancellationReason} />
                  )}
                  <Spacer space={10} />
                  <ThemedView style={{ flexDirection: "row", justifyContent: "space-around" }}>
                    {isSaving ? <LoadingSpinner /> : <ThemedButton title="Save" onPress={handleSaveChanges} />}
                    <ThemedButton title="Cancel" onPress={() => setIsConfirmVisible(false)} />
                  </ThemedView>
                </ThemedView>
              </ScrollView>
            </Modal>
          </ScrollView>
        </GestureHandlerRootView>
      )}
      {clubInfo?.role === ROLE_ADMIN && (
        <View
          style={{
            position: "absolute",
            flexDirection: "row",
            bottom: 30,
            justifyContent: "space-around",
            alignSelf: "center",
            width: "100%",
          }}
        >
          {isDeleting ? (
            <LoadingSpinner />
          ) : (
            <>
              <ThemedButton title="Update Status" onPress={() => setIsConfirmVisible(true)} />
              <MaterialCommunityIcons
                name="delete"
                size={30}
                onPress={() => handleDeleteEvent()}
                color={colors.error}
              />
            </>
          )}
        </View>
      )}
      {alertConfig?.visible && <Alert {...alertConfig} />}
    </ThemedView>
  );
};

export default EventDetails;

export const EventItemDetails = ({ event, clubRole }: { event: any; clubRole?: string }) => {
  const { colors } = useTheme();

  const getStatusColor = (status: string) => {
    if (status === "Completed") return colors.success;
    if (status === "Scheduled") return colors.warning;
    return colors.error;
  };

  const statusColor = getStatusColor(event.status);

  return (
    <View
      style={{
        borderRadius: 20,
        overflow: "hidden",
        width: "100%",
        alignSelf: "center",
      }}
    >
      {/* Header Section */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 12,
        }}
      >
        {/* Title and Edit Icon Row */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        ><View>
            <ThemedText
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: colors.heading,
                flex: 1,
                marginRight: 12,
                marginBottom: 8,
              }}
            >
              {event.title}
            </ThemedText>
            {/* Event Type and Status Row */}
            <View
              style={{
                flexDirection: "row",
                gap: 12,
              }}
            >
              {/* Event Type Badge */}
              <View
                style={{
                  backgroundColor: statusColor + "20",
                  paddingHorizontal: 12,
                  paddingVertical: 2,
                  borderRadius: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: statusColor,
                    marginRight: 6,
                  }}
                />
                <ThemedText
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: statusColor,
                  }}
                >
                  {event.name}
                </ThemedText>
              </View>

              {/* Status Badge */}
              <View
                style={{
                  backgroundColor: statusColor,
                  paddingHorizontal: 12,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ThemedText
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  {event.status}
                </ThemedText>
              </View>
            </View>
          </View>
          {/* Edit Icon */}
          {clubRole === ROLE_ADMIN && (
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                paddingLeft: 4,
                backgroundColor: colors.button + "20",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ThemedIcon
                name="MaterialCommunityIcons:square-edit-outline"
                size={20}
                color={colors.button}
                onPress={() => router.push(`/(main)/(clubs)/(events)/editevent?event=${JSON.stringify(event)}`)}
              />
            </View>
          )}
        </View>

        {/* Description */}
        {event.description && (
          <View
            style={{
              backgroundColor: colors.background,
              paddingHorizontal: 12,
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
            <ThemedText
              style={{
                fontSize: 14,
                color: colors.text,
                lineHeight: 20,
              }}
            >
              {event.description}
            </ThemedText>
          </View>
        )}

        {/* Details Grid */}
        <View style={{ gap: 12, display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
          <LabelWithIcon
            icon="MaterialIcons:calendar-today"
            label="Event Date"
            text={event.eventDate}
            color={colors.info}
          />
          {event.startTime && (
            <LabelWithIcon
              icon="MaterialIcons:access-time"
              label="Event Time"
              text={`${event.startTime}${event.endTime ? ` - ${event.endTime}` : ""}`}
              color={colors.warning}
            />
          )}
          {event.location && (
            <LabelWithIcon
              icon="MaterialIcons:location-pin"
              label="Event Location"
              text={event.location}
              color={colors.success}
            />
          )}
        </View>
      </View>
    </View>
  );
};
