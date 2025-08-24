import React, { useContext, useState } from "react";
import InputText from "@/src/components/InputText";
import ThemedButton from "@/src/components/ThemedButton";
import { UserContext } from "@/src/context/UserContext";
import { router } from "expo-router";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { View } from "react-native";
import { isValidLength } from "@/src/utils/validators";
import ThemedView from "@/src/components/themed-components/ThemedView";
import { useAddClubMutation } from "@/src/services/clubApi";
import { showSnackbar } from "@/src/components/snackbar/snackbarService";
import ThemedText from "@/src/components/themed-components/ThemedText";
import Spacer from "@/src/components/Spacer";
import Chip from "@/src/components/Chip";
import Label from "@/src/components/Label";
import ThemedIcon from "@/src/components/themed-components/ThemedIcon";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";

const initialEventTypes = [
  { name: "Meeting", isSelected: true },
  { name: "Practice Session", isSelected: true },
  { name: "Match", isSelected: true },
  { name: "Other", isSelected: true },
];

const CreateClub = () => {
  const [clubName, setClubName] = useState("");
  const [clubDescription, setClubDescription] = useState("");
  const [location, setLocation] = useState("");
  const [upiId, setUpiId] = useState("");
  const { userInfo } = useContext(UserContext);

  const [addClub, { isLoading }] = useAddClubMutation();

  const submitCreateClub = async () => {
    if (validate(clubName.trim())) {
      try {
        await addClub({
          clubName: clubName.trim(),
          clubDescription,
          location,
          memberId: userInfo.memberId,
          email: userInfo.email,
          upiId,
          eventTypes,
        }).unwrap();
        router.back();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const validate = (clubName: string | null | undefined) => {
    if (!isValidLength(clubName?.trim(), 2)) {
      showSnackbar("Enter atleast 2 characters for club name", "error");
      return false;
    }
    return true;
  };

  /* event type */
  const [eventTypes, setEventTypes] = useState<{ name: string; isSelected: boolean }[]>(initialEventTypes);
  const [newEventType, setNewEventType] = useState("");
  const handleEventTypeSelection = (selectedName: string) => {
    setEventTypes((prevTypes) =>
      prevTypes.map((type) => (type.name === selectedName ? { ...type, isSelected: !type.isSelected } : type))
    );
  };
  const handleAddNewEventType = () => {
    if (newEventType.trim() === "") {
      showSnackbar("Event type cannot be empty", "error");
      return;
    }
    setEventTypes((prev) => [...prev, { name: newEventType.trim(), isSelected: true }]);
    setNewEventType("");
  };
  return (
    <ThemedView style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <ScrollView>
          {isLoading && <LoadingSpinner />}
          {!isLoading && (
            <View style={{ alignItems: "center", marginTop: 20 }}>
              <InputText
                placeholder="Enter Club Name"
                label="Club Name *"
                onChangeText={(text: string) => setClubName(text)}
              />
              <InputText
                placeholder="Enter Club Description"
                label="Club Description"
                onChangeText={(text: string) => setClubDescription(text)}
              />
              <InputText
                placeholder="Enter Location"
                label="Location"
                onChangeText={(text: string) => setLocation(text)}
              />
              <Spacer space={10} />
              <Label
                title={"Event Types"}
                subTitle={"Events your club will be conducting. You can add or modify event types later as well."}
              />
              <Spacer space={5} />
              <ThemedView
                style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, alignSelf: "center", width: "80%" }}
              >
                {eventTypes.map((type) => (
                  <Chip key={type.name} selected={type.isSelected} onPress={() => handleEventTypeSelection(type.name)}>
                    <ThemedText>{type.name}</ThemedText>
                  </Chip>
                ))}
              </ThemedView>
              <Spacer space={10} />
              <ThemedView
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignSelf: "center",
                  alignItems: "center",
                  width: "60%",
                }}
              >
                <InputText
                  placeholder={""}
                  label={"Add new"}
                  value={newEventType}
                  onChangeText={(text: string) => setNewEventType(text)}
                />
                <ThemedIcon name="MaterialIcons:add-circle" size={20} onPress={() => handleAddNewEventType()} />
              </ThemedView>
              <InputText
                placeholder="Fee Collection UPI id"
                label="UPI Id"
                onChangeText={(text: string) => setUpiId(text)}
              />
              <ThemedText style={{ width: "80%", fontSize: 12, color: "gray", textAlign: "center" }}>
                This will be only used for redirecting the payment. Automatic tracking of payment is not yet supported.
              </ThemedText>
              <Spacer space={20} />
              <ThemedButton title="Create" onPress={submitCreateClub} />
              <Spacer space={20} />
            </View>
          )}
        </ScrollView>
      </GestureHandlerRootView>
    </ThemedView>
  );
};

export default CreateClub;
