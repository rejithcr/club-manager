import DatePicker from "@/src/components/DatePicker";
import InputText from "@/src/components/InputText";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import Spacer from "@/src/components/Spacer";
import ThemedView from "@/src/components/themed-components/ThemedView";
import ThemedButton from "@/src/components/ThemedButton";
import { ClubContext } from "@/src/context/ClubContext";
import { UserContext } from "@/src/context/UserContext";
import { isValidDate, isValidLength } from "@/src/utils/validators";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useSearchParams } from "expo-router/build/hooks";
import { useGetClubEventTypesQuery, useUpdateEventMutation } from "@/src/services/clubApi";

const AddEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [location, setLocation] = useState("");
  const [eventTypeId, setEventTypeId] = useState("");
  const [eventId, setEventId] = useState();

  const { clubInfo } = useContext(ClubContext);
  const { userInfo } = useContext(UserContext);
  const params = useSearchParams()

  const { data: eventTypes, isLoading: isLoadingEventTypes } = useGetClubEventTypesQuery({ clubId: clubInfo.clubId });
  
  useEffect(()=>{    
    const eventObj = JSON.parse(params.get('event')||'')
    setTitle(eventObj.title)
    setDescription(eventObj.description)
    setEventDate(new Date(eventObj.eventDate))
    setStartTime(eventObj.startTime)
    setEndTime(eventObj.endTime)
    setLocation(eventObj.location)
    setEventId(eventObj.eventId)
    eventTypes && setEventTypeId(eventObj.eventTypeId)
  },[eventTypes])

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
      createdBy: userInfo.email,
      eventId
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
      <InputText
        label={"Title"}
        value={title}
        onChangeText={setTitle}
        placeholder="Event Title"
      />

      <InputText
        label={"Description"}
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
      />
      <DatePicker date={eventDate} setDate={setEventDate} label="Event Date" />
      <InputText
        value={startTime}
        label="Start Time"
        onChangeText={setStartTime}
        placeholder="00:00"
      />
      <InputText
        value={endTime}
        label="End Time"
        onChangeText={setEndTime}
        placeholder="00:00"
      />
      <InputText
        label={"Location"}
        value={location}
        onChangeText={setLocation}
        placeholder=""
      />

      {isLoadingEventTypes ? (
        <LoadingSpinner />
      ) : (
        <Picker
          style={{ width: "80%", alignSelf: "center" }}
          selectedValue={eventTypeId}
          onValueChange={(value) => setEventTypeId(value)}
        >
          {eventTypes?.map((type: any) => (
            <Picker.Item
              key={type.eventTypeId}
              label={type.name}
              value={type.eventTypeId}
            />
          ))}
        </Picker>
      )}
      <Spacer space={5} />
      {isUpdating ? <LoadingSpinner/> :
      <ThemedButton title="Save Event" onPress={handleSubmit} />}
    </ThemedView>
  );
};

export default AddEvent;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
