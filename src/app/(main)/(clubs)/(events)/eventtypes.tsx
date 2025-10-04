import React, { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import ThemedView from "@/src/components/themed-components/ThemedView";
import ThemedText from "@/src/components/themed-components/ThemedText";
import InputText from "@/src/components/InputText";
import ThemedButton from "@/src/components/ThemedButton";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import Spacer from "@/src/components/Spacer";
import { useTheme } from "@/src/hooks/use-theme";
import { ClubContext } from "@/src/context/ClubContext";
import { UserContext } from "@/src/context/UserContext";
import {
  useGetClubEventTypesQuery,
  useAddClubEventTypeMutation,
  useUpdateClubEventTypeMutation,
  useDeleteClubEventTypeMutation,
} from "@/src/services/clubApi";
import Modal from "react-native-modal";
import RoundedContainer from "@/src/components/RoundedContainer";
import TouchableCard from "@/src/components/TouchableCard";
import ThemedIcon from "@/src/components/themed-components/ThemedIcon";
import Alert, { AlertProps } from "@/src/components/Alert";
import { appStyles } from "@/src/utils/styles";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const EventTypesManager = () => {
  const { clubInfo } = useContext(ClubContext);
  const { userInfo } = useContext(UserContext);
  const { colors } = useTheme();

  const { data: eventTypes = [], isLoading } = useGetClubEventTypesQuery({ clubId: clubInfo.clubId });
  const [addEventType] = useAddClubEventTypeMutation();
  const [updateEventType] = useUpdateClubEventTypeMutation();
  const [deleteEventType] = useDeleteClubEventTypeMutation();

  const [isSaving, setIsSaving] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [eventTypeId, setEventTypeId] = useState<number | null>(null);
  const [eventTypeName, setEventTypeName] = useState("");
  const [alertConfig, setAlertConfig] = useState<AlertProps>();

  const showAddModal = () => {
    setIsEdit(false);
    setEventTypeId(null);
    setEventTypeName("");
    setIsModalVisible(true);
  };

  const showEditModal = (item: any) => {
    setIsEdit(true);
    setEventTypeId(item.eventTypeId);
    setEventTypeName(item.name);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEventTypeId(null);
    setEventTypeName("");
    setIsSaving(false);
  };

  const handleSave = async () => {
    if (!eventTypeName || eventTypeName.trim().length < 2) {
      setAlertConfig({
        visible: true,
        title: "Error",
        message: "Enter at least 2 characters for event type name.",
        buttons: [{ text: "OK", onPress: () => setAlertConfig({ visible: false }) }],
      });
      return;
    }
    setIsSaving(true);
    setIsModalVisible(false);
    try {
      if (isEdit && eventTypeId) {
        await updateEventType({
          clubId: clubInfo.clubId,
          eventTypeId: eventTypeId,
          name: eventTypeName.trim(),
        }).unwrap();
      } else {
        await addEventType({
          clubId: clubInfo.clubId,
          name: eventTypeName.trim(),
        }).unwrap();
      }
    } catch (error: any) {
      setAlertConfig({
        visible: true,
        title: "Error",
        message: error?.data?.message || `Failed to ${isEdit ? "update" : "add"} event type.`,
        buttons: [{ text: "OK", onPress: () => setAlertConfig({ visible: false }) }],
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (eventTypeId == null) return;
    setAlertConfig({
      visible: true,
      title: "Are you sure!",
      message: "This will delete the event type. This cannot be recovered.",
      buttons: [
        {
          text: "OK",
          onPress: async () => {
            setAlertConfig({ visible: false });
            setIsSaving(true);
            setIsModalVisible(false);
            try {
              await deleteEventType({ clubId: clubInfo.clubId, eventTypeId }).unwrap();
            } catch (error: any) {
              setAlertConfig({
                visible: true,
                title: "Error",
                message: error?.data?.message || "Failed to delete event type.",
                buttons: [{ text: "OK", onPress: () => setAlertConfig({ visible: false }) }],
              });
            } finally {
              setIsSaving(false);
            }
          },
        },
        { text: "Cancel", onPress: () => setAlertConfig({ visible: false }) },
      ],
    });
  };

  if (isLoading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LoadingSpinner />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <ScrollView>
          <Spacer space={10} />
          {isLoading && <LoadingSpinner />}
          {!isLoading && eventTypes?.length === 0 && (
            <ThemedText style={{ width: "80%", alignSelf: "center" }}>
              Define event types to organize your club events. Eg. Practice, Match, Tournament, Meeting, etc.
            </ThemedText>
          )}
          {!isLoading &&
            eventTypes?.map((item: any) => (
              <View key={item.eventTypeId}>
                <RoundedContainer>
                  <TouchableCard
                    style={{ justifyContent: "space-between" }}
                    onPress={() => showEditModal(item)}
                    icon={<ThemedIcon name={"MaterialCommunityIcons:square-edit-outline"} />}
                  >
                    <ThemedText>{item.name}</ThemedText>
                  </TouchableCard>
                </RoundedContainer>
                <Spacer space={4} />
              </View>
            ))}
          <Spacer space={10} />
          {isSaving && <LoadingSpinner />}
          {!isSaving && (
            <TouchableOpacity style={{ alignSelf: "center" }} onPress={showAddModal}>
              <ThemedIcon name={"MaterialIcons:add-circle"} size={50} />
            </TouchableOpacity>
          )}
          <View style={{ marginBottom: 30 }} />
        </ScrollView>
      </GestureHandlerRootView>

      <Modal isVisible={isModalVisible}>
        <ThemedView style={{ borderRadius: 5, paddingBottom: 20 }}>
          <Spacer space={5} />
          <ThemedText style={appStyles.heading}>{isEdit ? "Edit" : "Add"} Event Type</ThemedText>
          <Spacer space={5} />
          <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "center", width: "80%" }}>
            <InputText
              label="Event Type Name"
              defaultValue={eventTypeName}
              onChangeText={(value: string) => setEventTypeName(value)}
            />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20, alignItems: "center" }}>
            <ThemedButton title={"   Save   "} onPress={() => handleSave()} />
            <ThemedButton title="Cancel" onPress={() => setIsModalVisible(false)} />
            {isEdit && (
              <ThemedIcon
                name="MaterialCommunityIcons:delete"
                size={30}
                onPress={() => handleDelete()}
                color={colors.error}
              />
            )}
          </View>
        </ThemedView>
      </Modal>

      {/* Alert Component */}
      {alertConfig?.visible && <Alert {...alertConfig} />}
    </ThemedView>
  );
};

export default EventTypesManager;