import React, { useContext, useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import DatePicker from "@/src/components/DatePicker";
import InputText from "@/src/components/InputText";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import Spacer from "@/src/components/Spacer";
import ThemedView from "@/src/components/themed-components/ThemedView";
import ThemedButton from "@/src/components/ThemedButton";
import FormSwitch from "@/src/components/FormSwitch";
import EventTypePickerWithAdd from "@/src/components/EventTypePickerWithAdd";
import { ClubContext } from "@/src/context/ClubContext";
import { UserContext } from "@/src/context/UserContext";
import { isValidDate, isValidLength } from "@/src/utils/validators";
import { useAddEventMutation } from "@/src/services/clubApi";
import { handleTimeChange } from "@/src/utils/common";

// Event form data interface
interface EventFormData {
  title: string;
  description: string;
  eventDate: Date;
  startTime: string | null;
  endTime: string | null;
  location: string;
  eventTypeId: string;
  isTransactionEnabled: boolean;
  isAttendanceEnabled: boolean;
}

// Event Form Fields Component
interface EventFormFieldsProps {
  formData: EventFormData;
  onUpdateForm: (updates: Partial<EventFormData>) => void;
}

const EventFormFields: React.FC<EventFormFieldsProps> = ({ formData, onUpdateForm }) => (
  <>
    <InputText 
      label="Title" 
      value={formData.title} 
      onChangeText={(title: string) => onUpdateForm({ title })} 
      placeholder="Event Title" 
    />
    
    <InputText
      label="Description"
      value={formData.description}
      onChangeText={(description: string) => onUpdateForm({ description })}
      placeholder="Description"
    />
    
    <DatePicker 
      date={formData.eventDate} 
      setDate={(eventDate: Date) => onUpdateForm({ eventDate })} 
      label="Event Date" 
    />
    
    <InputText
      value={formData.startTime}
      label="Start Time (24-hr HH:MM)"
      onChangeText={(text: string) => {
        handleTimeChange(text, (value) => {
          const startTime = typeof value === 'function' ? value(formData.startTime) : value;
          onUpdateForm({ startTime });
        });
      }}
      placeholder="00:00"
      keyboardType="numeric"
    />
    
    <InputText
      value={formData.endTime}
      label="End Time (24-hr HH:MM)"
      onChangeText={(text: string) => {
        handleTimeChange(text, (value) => {
          const endTime = typeof value === 'function' ? value(formData.endTime) : value;
          onUpdateForm({ endTime });
        });
      }}
      placeholder="00:00"
      keyboardType="numeric"
    />
    
    <InputText 
      label="Location" 
      value={formData.location} 
      onChangeText={(location: string) => onUpdateForm({ location })} 
      placeholder="" 
    />
    
    <FormSwitch
      label="Track transactions separately for this event?"
      onValueChange={() => onUpdateForm({ isTransactionEnabled: !formData.isTransactionEnabled })}
      value={formData.isTransactionEnabled}
    />
    
    <FormSwitch
      label="Track attendance for this event?"
      onValueChange={() => onUpdateForm({ isAttendanceEnabled: !formData.isAttendanceEnabled })}
      value={formData.isAttendanceEnabled}
    />
  </>
);

const AddEvent = () => {
  // Form state
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    eventDate: new Date(),
    startTime: null,
    endTime: null,
    location: "",
    eventTypeId: "",
    isTransactionEnabled: false,
    isAttendanceEnabled: false,
  });

  // Contexts
  const { clubInfo } = useContext(ClubContext);
  const { userInfo } = useContext(UserContext);

  // API hooks
  const [addEvent, { isLoading: isAdding }] = useAddEventMutation();

  // Form update handler
  const updateForm = (updates: Partial<EventFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Event type change handler
  const handleEventTypeChange = (value: string) => {
    updateForm({ eventTypeId: value });
  };

  // Form submission handler
  const handleSubmit = async () => {
    if (!isValidLength(formData.title, 2) || !isValidDate(formData.eventDate)) {
      alert("Please enter title and date");
      return;
    }

    const payload = {
      ...formData,
      eventTypeId: Number(formData.eventTypeId),
      createdBy: userInfo.email,
    };

    try {
      await addEvent(payload).unwrap();
      router.dismissTo(`/(main)/(clubs)/(events)`);
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Spacer space={Platform.OS === "web" ? 10 : 5} />
      <GestureHandlerRootView>
        <ScrollView style={styles.scrollView}>
          <EventTypePickerWithAdd
            selectedValue={formData.eventTypeId}
            onValueChange={handleEventTypeChange}
          />

          <Spacer space={5} />
          
          <EventFormFields formData={formData} onUpdateForm={updateForm} />

          <Spacer space={8} />
          
          {isAdding ? (
            <LoadingSpinner />
          ) : (
            <ThemedButton title="Create Event" onPress={handleSubmit} />
          )}
          
          <Spacer space={8} />
        </ScrollView>
      </GestureHandlerRootView>
    </ThemedView>
  );
};

export default AddEvent;

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  modalContainer: {
    borderRadius: 25,
    padding: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
