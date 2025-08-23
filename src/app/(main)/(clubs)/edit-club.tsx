import React, { useContext, useEffect, useState } from "react";
import InputText from "@/src/components/InputText";
import ThemedButton from "@/src/components/ThemedButton";
import { UserContext } from "@/src/context/UserContext";
import { router, useRouter } from "expo-router";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { View } from "react-native";
import { isValidLength } from "@/src/utils/validators";
import ThemedView from "@/src/components/themed-components/ThemedView";
import { useAddClubMutation, useDeleteClubMutation, useGetClubQuery, useUpdateClubMutation } from "@/src/services/clubApi";
import { showSnackbar } from "@/src/components/snackbar/snackbarService";
import ThemedText from "@/src/components/themed-components/ThemedText";
import Spacer from "@/src/components/Spacer";
import { useTheme } from "@/src/hooks/use-theme";
import Alert, { AlertProps } from "@/src/components/Alert";
import { useSearchParams } from "expo-router/build/hooks";
import ThemedHeading from "@/src/components/themed-components/ThemedHeading";
import ThemedIcon from "@/src/components/themed-components/ThemedIcon";

const EditClub = () => {
  const [name, setClubName] = useState<string | null>();
  const [desc, setClubDesc] = useState<string | null>();
  const [location, setClubLocation] = useState<string | null>();
  const [upiId, setUpiId] = useState<string | null>();
  const { colors } = useTheme();
  const { userInfo } = useContext(UserContext);
  const [alertConfig, setAlertConfig] = useState<AlertProps>();
  const router = useRouter();
  const params = useSearchParams();

  const [updateClub, { isLoading: isUpdating }] = useUpdateClubMutation();

  const { data: club, isLoading: isLoadingClub, error } = useGetClubQuery({ clubId: Number(params.get("clubId")) });

  useEffect(() => {
    if (club) {
      setClubName(club.clubName || null);
      setClubDesc(club.description || null);
      setClubLocation(club.location || null);
      setUpiId(club.upiId || null);
    }
  }, [club]);

  if (error) {
    showSnackbar("Error fetching club details", "error");
    return <ThemedButton title="Go back" onPress={() => router.back()} />;
  }
  const validate = (clubName: string | null | undefined) => {
    if (!isValidLength(clubName?.trim(), 2)) {
      showSnackbar("Enter atleast 2 characters for club name", "error");
      return false;
    }
    return true;
  };
  const handleUpdate = async () => {
    if (!validate(name)) {
      return;
    }
    try {
      setAlertConfig({ visible: false });
      await updateClub({
        clubId: Number(params.get("clubId")),
        clubName: name,
        clubDescription: desc,
        location: location,
        upiId: upiId?.trim(),
        email: userInfo.email,
      }).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      router.back()
    }
  };

  const [deleteClub, { isLoading: isDeleting }] = useDeleteClubMutation();
  const handleDelete = () => {
    setAlertConfig({
      visible: true,
      title: "Are you sure!",
      message: "This will delete the club. This cannot be recovered.",
      buttons: [
        {
          text: "OK",
          onPress: async () => {
            setAlertConfig({ visible: false });
            try {
              await deleteClub({ clubId: Number(params.get("clubId")), email: userInfo.email }).unwrap();
              router.dismissTo(`/(main)`);
            } catch (error) {
              console.log(error);
            } finally {
              close();
            }
          },
        },
        { text: "Cancel", onPress: () => setAlertConfig({ visible: false }) },
      ],
    });
  };

  const isLoading = isUpdating || isDeleting || isLoadingClub;

  return (
    <ThemedView style={{ flex: 1 }}>
      {isLoading && <LoadingSpinner />}
      {!isLoading && (
        <ThemedView style={{ padding: 20, borderRadius: 5 }}>
          <InputText label="Club Name" value={name} defaultValue={club.clubName} onChangeText={setClubName} />
          <InputText label="Description" value={desc} defaultValue={club.description} onChangeText={setClubDesc} />
          <InputText label="Location" value={location} defaultValue={club.location} onChangeText={setClubLocation} />
          <InputText label="Payment UPI ID" value={upiId} defaultValue={club.upiId} onChangeText={setUpiId} />
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
            <ThemedButton title="Save" onPress={() => handleUpdate()} />
            <ThemedButton title="Cancel" onPress={() => router.back()} />
            <ThemedIcon
              name="MaterialCommunityIcons:delete"
              size={30}
              onPress={() => handleDelete()}
              color={colors.error}
            />
          </View>
        </ThemedView>
      )}
      {alertConfig?.visible && <Alert {...alertConfig} />}
    </ThemedView>
  );
};

export default EditClub;
