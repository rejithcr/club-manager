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
import { useDeleteEventMutation, useLazyGetClubMembersQuery, useLazyGetEventMembersQuery, useUpdateEventAttendanceMutation } from "@/src/services/clubApi";
import RoundedContainer from "@/src/components/RoundedContainer";

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


  const loadClubMembers = async (eventId: string) => {
    setIsLoadingMembers(true);
    try {
      const attendedMembers = await getAtendedMembers({eventId}).unwrap();
      const attendedMembersLocal = attendedMembers.filter((m: { present: any }) => m.present);
      setAttendedMembersBackup([...attendedMembersLocal]);
      setAttendedMembers(
        attendedMembersLocal.sort((m1: { firstName: string }, m2: { firstName: any }) =>
          m1.firstName.localeCompare(m2.firstName)
        )
      );
      const members = await getClubMembers({clubId: clubInfo.clubId}).unwrap();
      const difference = members.filter(
        (m: any) => !attendedMembersLocal.some((e: any) => e.membershipId == m.membershipId)
      );
      setRemainingMembers(
        difference.sort((m1: { firstName: string }, m2: { firstName: any }) =>
          m1.firstName.localeCompare(m2.firstName)
        )
      );
    } catch(error){
      console.log(error);
    } finally{
      setIsLoadingMembers(false);
    }
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
        <ThemedHeading style={{ width: 200 }}>{event?.title}</ThemedHeading>
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

      {event && <EventItemDetails event={event} />}
      <Spacer space={8} />
      <ThemedText style={{ width: "85%", textAlign: "center", alignSelf: "center", fontSize: 14, color: colors.subText }}>
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



export const EventItemDetails = ({ event }: { event: any }) => {
  const { colors } = useTheme();
  return (
    <RoundedContainer>
      <View style={{ paddingVertical: 10, paddingHorizontal: 15 }}>
        <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems:"center" }}>
          <ThemedText style={{ fontWeight: "bold" }}>{event.name}</ThemedText>          
          <ThemedText
            style={{textAlign: "right",
              fontSize: 12,
              fontWeight: "bold",
              color:
                event.status === "Completed"
                  ? colors.success
                  : event.status === "Scheduled"
                  ? colors.warning
                  : colors.error,
            }}
          >
            {event.status}
          </ThemedText>
        </View>
        <Spacer space={3} />
        <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between",  alignItems:"center" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ThemedIcon name={"MaterialIcons:calendar-today"} size={15} />
            <Spacer hspace={2} />
            <ThemedText style={{ textAlign: "right", fontSize: 12 }}>{event.eventDate}</ThemedText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "flex-end" }}>
             {event.startTime && (
            <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "flex-end" }}>
              <ThemedIcon name={"MaterialIcons:access-time"} size={15} />
              <Spacer hspace={2} />
              <ThemedText style={{ fontSize: 12 }}>
                {event.startTime} {event.endTime && " - " + event.endTime}
              </ThemedText>
            </View>
          )}
          </View>
        </View>
      </View>
      <ThemedText style={{paddingHorizontal: 15, paddingBottom: 5, fontSize: 12, color: colors.subText}}>{event.description}</ThemedText>
    </RoundedContainer>
  );
};