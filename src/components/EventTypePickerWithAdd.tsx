import React, { useState, useContext } from "react";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Modal from "react-native-modal";

import LoadingSpinner from "@/src/components/LoadingSpinner";
import InputText from "@/src/components/InputText";
import ThemedView from "@/src/components/themed-components/ThemedView";
import ThemedButton from "@/src/components/ThemedButton";
import Spacer from "@/src/components/Spacer";
import { useAddClubEventTypeMutation, useGetClubEventTypesQuery } from "@/src/services/clubApi";
import { ClubContext } from "@/src/context/ClubContext";

// Event Type Picker with Add New Type functionality
interface EventTypePickerWithAddProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  onEventTypeAdded?: (newEventType: any) => void;
}

const EventTypePickerWithAdd: React.FC<EventTypePickerWithAddProps> = ({
  selectedValue,
  onValueChange,
  onEventTypeAdded,
}) => {
  const { clubInfo } = useContext(ClubContext);
  const [isAddTypeVisible, setIsAddTypeVisible] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");

  const { data: eventTypes, isLoading: isLoadingEventTypes, refetch: refetchEventTypes } = 
    useGetClubEventTypesQuery({ clubId: clubInfo.clubId });
  const [addClubEventType, { isLoading: isAddingType }] = useAddClubEventTypeMutation();

  const handleValueChange = (value: string) => {
    if (value === "__add__") {
      setIsAddTypeVisible(true);
      return;
    }
    onValueChange(value);
  };

  const handleAddEventType = async () => {
    if (!newTypeName || newTypeName.trim().length < 2) {
      alert("Enter at least 2 characters");
      return;
    }

    try {
      await addClubEventType({ clubId: clubInfo.clubId, name: newTypeName.trim() }).unwrap();
      
      // Refetch types and auto-select the newly added type
      const refetchRes: any = await refetchEventTypes();
      const refreshed = (refetchRes?.data) ? refetchRes.data : eventTypes;
      const match = refreshed?.find((t: any) => 
        t.name && t.name.toLowerCase() === newTypeName.trim().toLowerCase()
      );
      
      if (match) {
        onValueChange(match.eventTypeId.toString());
        onEventTypeAdded?.(match);
      }
    } finally {
      setIsAddTypeVisible(false);
      setNewTypeName("");
    }
  };

  if (isLoadingEventTypes) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Picker
        style={{ width: "80%", alignSelf: "center" }}
        selectedValue={selectedValue}
        onValueChange={handleValueChange}
      >
        {eventTypes?.map((type: any) => (
          <Picker.Item key={type.eventTypeId} label={type.name} value={type.eventTypeId} />
        ))}
        <Picker.Item value="__add__" label="+ Add New Event Type" />
      </Picker>

      <Modal isVisible={isAddTypeVisible}>
        <ThemedView style={styles.modalContainer}>
          <InputText 
            label="Event Type Name" 
            defaultValue={newTypeName} 
            onChangeText={setNewTypeName} 
          />
          <Spacer space={10} />
          <View style={styles.modalButtonContainer}>
            <ThemedButton
              title={isAddingType ? "Saving..." : "Save"}
              onPress={handleAddEventType}
              disabled={isAddingType}
            />
            <ThemedButton 
              title="Cancel" 
              onPress={() => {
                setIsAddTypeVisible(false);
                setNewTypeName("");
              }} 
            />
          </View>
        </ThemedView>
      </Modal>
    </>
  );
};

const styles = {
  modalContainer: {
    borderRadius: 5,
    padding: 20,
  },
  modalButtonContainer: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
  },
};

export default EventTypePickerWithAdd;