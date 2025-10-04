import DatePicker from "@/src/components/DatePicker";
import InputText from "@/src/components/InputText";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import Spacer from "@/src/components/Spacer";
import ThemedView from "@/src/components/themed-components/ThemedView";
import ThemedButton from "@/src/components/ThemedButton";
import EventTypePickerWithAdd from "@/src/components/EventTypePickerWithAdd";
import { ClubContext } from "@/src/context/ClubContext";
import { UserContext } from "@/src/context/UserContext";
import { isValidDate, isValidLength } from "@/src/utils/validators";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import { useSearchParams } from "expo-router/build/hooks";
import { useUpdateEventMutation } from "@/src/services/clubApi";
import { handleTimeChange, to24HourFormat } from "@/src/utils/common";
import FormSwitch from "@/src/components/FormSwitch";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";

const AddEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [eventTypeId, setEventTypeId] = useState("");
  const [eventId, setEventId] = useState();
  const [isTransactionEnabled, setIsTransactionEnabled] = useState(false);
  const [isAttendanceEnabled, setIsAttendanceEnabled] = useState(false);

  const { clubInfo } = useContext(ClubContext);
  const { userInfo } = useContext(UserContext);
  const params = useSearchParams();

  useEffect(() => {
    const eventObj = JSON.parse(params.get("event") || "");
    setTitle(eventObj.title);
    setDescription(eventObj.description);
    setEventDate(new Date(eventObj.eventDate));
    setStartTime(to24HourFormat(eventObj.startTime));
    setEndTime(to24HourFormat(eventObj.endTime));
    setLocation(eventObj.location);
    setEventId(eventObj.eventId);
    setIsTransactionEnabled(eventObj.isTransactionEnabled);
    setIsAttendanceEnabled(eventObj.isAttendanceEnabled);
    setEventTypeId(eventObj.eventTypeId);
  }, []);

  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const handleSubmit = async () => {
    if (!isValidLength(title, 2) || !isValidDate(eventDate)) {
      alert("Please enter title and date");
      return;
    }
    const payload = {
      title,
      description,
      eventDate: eventDate,
      startTime: startTime,
      endTime: endTime,
      location,
      eventTypeId: Number(eventTypeId),
      isTransactionEnabled,
      isAttendanceEnabled,
      createdBy: userInfo.email,
      eventId,
    };
    try {
      await updateEvent(payload).unwrap();
      router.dismissTo(`/(main)/(clubs)/(events)`);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Spacer space={Platform.OS == "web" ? 10 : 5} />
      <GestureHandlerRootView>
        <ScrollView>
          <EventTypePickerWithAdd
            selectedValue={eventTypeId}
            onValueChange={setEventTypeId}
          />
          <Spacer space={5} />
          <InputText label={"Title"} value={title} onChangeText={setTitle} placeholder="Event Title" />

          <InputText
            label={"Description"}
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
          />
          <DatePicker date={eventDate} setDate={setEventDate} label="Event Date" />
          <InputText
            value={startTime}
            label="Start Time (24-hr HH:MM)"
            onChangeText={(text: string) => handleTimeChange(text, setStartTime)}
            placeholder="00:00"
          />
          <InputText
            value={endTime}
            label="End Time (24-hr HH:MM)"
            onChangeText={(text: string) => handleTimeChange(text, setEndTime)}
            placeholder="00:00"
          />
          <InputText label={"Location"} value={location} onChangeText={setLocation} placeholder="" />
          <FormSwitch
            label={"Track transactions separatly for this event?"}
            onValueChange={() => setIsTransactionEnabled((prev) => !prev)}
            value={isTransactionEnabled}
          />
          <FormSwitch
            label={"Track attendance for this event?"}
            onValueChange={() => setIsAttendanceEnabled((prev) => !prev)}
            value={isAttendanceEnabled}
          />
          <Spacer space={8} />
          {isUpdating ? <LoadingSpinner /> : <ThemedButton title="Save Event" onPress={handleSubmit} />}
          <Spacer space={8}/>
        </ScrollView>
      </GestureHandlerRootView>
    </ThemedView>
  );
};

export default AddEvent;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
