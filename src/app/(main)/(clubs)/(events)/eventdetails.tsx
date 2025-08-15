import React, { useContext, useEffect, useState } from "react";
import ThemedView from "@/src/components/themed-components/ThemedView";
import { useSearchParams } from "expo-router/build/hooks";
import { deleteEvent, Event, getAtendedMembers, saveEventChanges } from "@/src/helpers/events_helper";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import Spacer from "@/src/components/Spacer";
import ThemedText from "@/src/components/themed-components/ThemedText";
import { ClubContext } from "@/src/context/ClubContext";
import { getClubMembers } from "@/src/helpers/club_helper";
import { Member } from "@/src/helpers/member_helper";
import ThemedHeading from "@/src/components/themed-components/ThemedHeading";
import Chip from "@/src/components/Chip";
import ThemedButton from "@/src/components/ThemedButton";
import Modal from "react-native-modal";
import { Picker } from "@react-native-picker/picker";
import InputText from "@/src/components/InputText";
import { View } from "react-native";
import { arrayDifference } from "@/src/utils/array";
import { EventItem } from ".";
import ThemedIcon from "@/src/components/themed-components/ThemedIcon";
import { router } from "expo-router";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/src/hooks/use-theme";
import Alert, { AlertProps } from "@/src/components/Alert";
import { ROLE_ADMIN } from "@/src/utils/constants";
import { useDeleteEventMutation, useUpdateEventAttendanceMutation } from "@/src/services/clubApi";

const EventDetails = () => {
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [isLoadingAttendedMembers, setIsLoadingAttendedMembers] = useState(false);
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

  const loadClubMembers = (eventId: string) => {
    setIsLoadingAttendedMembers(true);
    getAtendedMembers(eventId)
      .then((response) => {
        const attendedMembersLocal = response.data.filter((m: { present: any }) => m.present);
        setAttendedMembersBackup([...attendedMembersLocal]);
        setAttendedMembers(
          attendedMembersLocal.sort((m1: { firstName: string }, m2: { firstName: any }) =>
            m1.firstName.localeCompare(m2.firstName)
          )
        );
        setIsLoadingMembers(true);
        getClubMembers(clubInfo.clubId)
          .then((response) => {
            const members = response.data;
            const difference = members.filter(
              (m: any) => !attendedMembersLocal.some((e: any) => e.membershipId == m.membershipId)
            );
            setRemainingMembers(
              difference.sort((m1: { firstName: string }, m2: { firstName: any }) =>
                m1.firstName.localeCompare(m2.firstName)
              )
            );
          })
          .catch(() => alert("Error! please retry"))
          .finally(() => setIsLoadingMembers(false));
      })
      .catch(() => alert("Error! please retry"))
      .finally(() => setIsLoadingAttendedMembers(false));
  };
  useEffect(() => {
    const eventObj = JSON.parse(params.get("event") || "");
    setEvent(eventObj);
    loadClubMembers(eventObj.eventId);
  }, []);

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

  const [updateEventAttendance, {isLoading: isSaving}] = useUpdateEventAttendanceMutation();
  const handleSaveChanges = async () => {
    const added = attendanceDiff.added.map((m) => ({ membershipId: m.membershipId, present: true }));
    const removed = attendanceDiff.removed.map((m) => ({ membershipId: m.membershipId, present: false }));
    try {
      await updateEventAttendance({ eventId: event?.eventId, records: [...added, ...removed], status: eventStatus }).unwrap();
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
            try{
              await deleteEvent({ eventId: event?.eventId }).unwrap();
              router.dismissTo("/(main)/(clubs)/(events)");
            }catch (error) {
              console.error("Error deleting event:", error);
            }
          },
        },
        { text: "Cancel", onPress: () => setAlertConfig({ visible: false }) },
      ],
    });
  };
  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedView
        style={{
          width: "90%",
          alignSelf: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ThemedHeading style={{ width: 200 }}>Mark Attendance</ThemedHeading>
        {clubInfo.role === ROLE_ADMIN ? (
          <ThemedIcon
            name="MaterialCommunityIcons:square-edit-outline"
            size={25}
            onPress={() => router.push(`/(main)/(clubs)/(events)/editevent?event=${JSON.stringify(event)}`)}
          />
        ) : (
          <ThemedText></ThemedText>
        )}
      </ThemedView>

      {event && <EventItem event={event} />}
      <Spacer space={8} />
      <ThemedText style={{ width: "85%", textAlign: "center" }}>
        Please select from the below list to mark attendance
      </ThemedText>
      <Spacer space={8} />
      <GestureHandlerRootView>
        <ScrollView>
          <ThemedView
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
              alignSelf: "center",
              width: "85%",
            }}
          >
            {isLoadingAttendedMembers && <LoadingSpinner />}
            {!isLoadingAttendedMembers &&
              attendedMembers.map((item: any) => (
                <Chip selected={true} key={item.memberId} onPress={() => removeFromAttended(item)}>
                  <ThemedText>
                    {item?.firstName} {item?.lastName}
                  </ThemedText>
                </Chip>
              ))}
            {isLoadingMembers && <LoadingSpinner />}
            {!isLoadingMembers && !isLoadingAttendedMembers && remainingMembers.length == 0 && (
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
          <Spacer space={40} />
          <Modal isVisible={isConfirmVisible}>
            <ScrollView>
              <ThemedView style={{ borderRadius: 5, paddingBottom: 20 }}>
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
      {clubInfo.role === ROLE_ADMIN && (
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
