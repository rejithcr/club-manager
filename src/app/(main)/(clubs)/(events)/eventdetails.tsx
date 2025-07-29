import React, { useContext, useEffect, useState } from "react";
import ThemedView from "@/src/components/themed-components/ThemedView";
import { EventCard } from "../../upcoming_events";
import { useSearchParams } from "expo-router/build/hooks";
import { Event, getAtendedMembers, saveEventChanges } from "@/src/helpers/events_helper";
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
  const [isSaving, setIsSaving] = useState(false);
  const [event, setEvent] = useState<Event>();
  const params = useSearchParams();
  const { clubInfo } = useContext(ClubContext);

  const loadClubMembers = (eventId: string) => {
    setIsLoadingAttendedMembers(true);
    getAtendedMembers(eventId)
      .then((response) => {
        const attendedMembersLocal = response.data.filter((m: { present: any }) => m.present);
        setAttendedMembersBackup([...attendedMembersLocal]);
        setAttendedMembers(attendedMembersLocal);
        setIsLoadingMembers(true);
        getClubMembers(clubInfo.clubId)
          .then((response) => {
            const members = response.data;
            const difference = members.filter(
              (m: any) => !attendedMembersLocal.some((e: any) => e.membershipId == m.membershipId)
            );
            setRemainingMembers(difference);
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

  const handleSaveChanges = () => {
    const added = attendanceDiff.added.map((m) => ({ membershipId: m.membershipId, present: true }));
    const removed = attendanceDiff.removed.map((m) => ({ membershipId: m.membershipId, present: false }));
    setIsSaving(true);
    saveEventChanges(event?.eventId, [...added, ...removed], eventStatus)
      .then((response) => {
        alert(response.data.message);
      })
      .finally(() => {
        setIsSaving(false);
        setIsConfirmVisible(false);
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
        <ThemedIcon
          name="MaterialCommunityIcons:square-edit-outline"
          size={25}
          onPress={() => router.push(`/(main)/(clubs)/(events)/editevent?event=${JSON.stringify(event)}`)}
        />
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
            <ThemedView style={{ borderRadius: 5, paddingBottom: 20 }}>
              <ThemedHeading>{attendanceChanged ? "Update Attendance" : "Update Status"}</ThemedHeading>
              {attendanceChanged ? 
                <ThemedText style={{ textAlign: "center" }}>
                  Review the attendance changes and update event status?
                </ThemedText> :
                <ThemedText style={{ textAlign: "center" }}>
                  Update event status?
                </ThemedText> 
              }
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
                  <Chip selected={true} key={item.memberId} onPress={() => addToAttended(item)}>
                    <ThemedText>
                      {item?.firstName} {item?.lastName}
                    </ThemedText>
                  </Chip>
                ))}
                {attendanceDiff.removed.map((item: any) => (
                  <Chip selected={false} key={item.memberId} onPress={() => addToAttended(item)}>
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
                <ThemedButton title="Save" onPress={handleSaveChanges} />
                <ThemedButton title="Cancel" onPress={() => setIsConfirmVisible(false)} />
              </ThemedView>
            </ThemedView>
          </Modal>
        </ScrollView>
      </GestureHandlerRootView>
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
        <ThemedButton title="Update Status" onPress={() => setIsConfirmVisible(true)} />
      </View>
    </ThemedView>
  );
};

export default EventDetails;
