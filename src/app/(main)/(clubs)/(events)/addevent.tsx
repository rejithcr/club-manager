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
import Alert, { AlertProps }from '@/src/components/Alert'
import { useAddEventMutation, useGetClubEventTypesQuery } from "@/src/services/clubApi";

const AddEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [location, setLocation] = useState("");
  const [eventTypeId, setEventTypeId] = useState("");
  const [alertConfig, setAlertConfig] = useState<AlertProps>();

  const { clubInfo } = useContext(ClubContext);
  const { userInfo } = useContext(UserContext);

  const { data: eventTypes, isLoading: isLoadingEventTypes } = useGetClubEventTypesQuery({ clubId: clubInfo.clubId });

  useEffect(()=>{    
    eventTypes && setEventTypeId(eventTypes[0].eventTypeId)
  },[eventTypes])

  const [addEvent, { isLoading: isAdding }] = useAddEventMutation();
  const handleSubmit = async () => {
    console.log(eventDate);
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
    };
    try {
      await addEvent(payload).unwrap();
      router.dismissTo(`/(main)/(clubs)/(events)`);
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const handleTimeChange = (text: string, setState: React.Dispatch<React.SetStateAction<string>>) => {
    const raw = text.replace(/[^0-9]/g, '');
    let formatted = '';
    if (raw.length <= 2) {
      formatted = raw;
    } else {
      formatted = raw.slice(0, 2) + ':' + raw.slice(2, 4);
    }
    setState(formatted);
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
        onChangeText={(text: string) => handleTimeChange(text, setStartTime)}
        placeholder="00:00"
        keyboardType="numeric"
      />
      <InputText
        value={endTime}
        label="End Time"
        onChangeText={(text: string) => handleTimeChange(text, setEndTime)}
        placeholder="00:00"
        keyboardType="numeric"
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
      {isAdding ? <LoadingSpinner/> :
      <ThemedButton title="Create Event" onPress={handleSubmit} />}
    {alertConfig?.visible && <Alert {...alertConfig}/>}
    </ThemedView>
  );
};

export default AddEvent;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
