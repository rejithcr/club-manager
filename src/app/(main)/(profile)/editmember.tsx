import { ScrollView, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import InputText from "@/src/components/InputText";
import Spacer from "@/src/components/Spacer";
import ThemedButton from "@/src/components/ThemedButton";
import { Member } from "@/src/types/member";
import { useSearchParams } from "expo-router/build/hooks";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import ThemedView from "@/src/components/themed-components/ThemedView";
import { router } from "expo-router";
import ThemedText from "@/src/components/themed-components/ThemedText";
import { useTheme } from "@/src/hooks/use-theme";
import { isValidPhoneNumber } from "@/src/utils/validators";
import { appStyles } from "@/src/utils/styles";
import TouchableCard from "@/src/components/TouchableCard";
import { ClubContext } from "@/src/context/ClubContext";
import DatePicker from "@/src/components/DatePicker";
import { useGetMembersQuery, useUpdateMemberMutation } from "@/src/services/memberApi";
import { useGetClubQuery } from "@/src/services/clubApi";

const Editmember = () => {
  const params = useSearchParams();
  const [firstName, setFirstName] = useState<string | undefined>();
  const [lastName, setLastName] = useState<string | undefined>();
  const [updatedBy, setUpdatedBy] = useState<string | undefined>();
  const [phone, setPhone] = useState<number | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>();
  const { colors } = useTheme();

  const setDetails = (memberDetails: Member) => {
    setFirstName(memberDetails?.firstName);
    setLastName(memberDetails?.lastName);
    setPhone(memberDetails?.phone);
    setEmail(memberDetails?.email);
    setDateOfBirth(memberDetails?.dateOfBirth);
    setUpdatedBy(memberDetails?.updatedBy);
  };

  const { data: member, isLoading: isMemberLoading } = useGetMembersQuery({
    memberId: Number(params.get("memberId")),
  });
  const [updateMember, { isLoading: isMemberUpdating }] = useUpdateMemberMutation();

  useEffect(() => {
    if (member) {
      setDetails(member);
    }
  }, [member]);

  const handleSave = () => {
    if (validate()) {
      updateMember({
        memberId: Number(params.get("memberId")),
        firstName,
        lastName,
        phone,
        dateOfBirth,
        email,
        updatedBy: email,
      });
    }
  };

  const validate = () => {
    console.log(phone);
    if (!isValidPhoneNumber(phone?.toString())) {
      alert("Invalid Phone number");
      return false;
    }
    if (!firstName || (firstName && firstName?.length < 2)) {
      alert("Please enter name with atleast 2 characters");
      return false;
    }
    if (!lastName || (lastName && lastName?.length < 1)) {
      alert("Please enter last name");
      return false;
    }
    return true;
  };

  const { data: clubs, isLoading: isLoadingMyClubs } = useGetClubQuery({
    memberId: Number(params.get("memberId")),
  });

  const { setClubInfo } = useContext(ClubContext);
  const showDetails = (club: any) => {
    setClubInfo({ clubId: club.clubId, clubName: club.clubName, role: club.role });
    router.push(`/(main)/(clubs)/(members)/editclublevelattributes?memberId=${params.get("memberId")}`);
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      {(isMemberLoading || isMemberUpdating)&& <LoadingSpinner />}
      {!(isMemberLoading || isMemberUpdating) && (
        <ScrollView>
          <InputText label="First Name" onChangeText={setFirstName} defaultValue={firstName} />
          <InputText label="Last Name" onChangeText={setLastName} defaultValue={lastName} />
          <InputText label="Phone" onChangeText={setPhone} defaultValue={phone} keyboardType={"numeric"} />
          <InputText label="Email" defaultValue={email} keyboardType={"email-address"} editable={false} />
          <DatePicker
            label={"Date of Birth"}
            date={dateOfBirth ? new Date(dateOfBirth) : null}
            setDate={setDateOfBirth}
          />
          {updatedBy !== email && (
            <ThemedText style={{ alignSelf: "center", color: colors.warning }}>
              Last updated by: {updatedBy}{" "}
            </ThemedText>
          )}
          <Spacer space={10} />
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            <ThemedButton title="Save" onPress={handleSave} />
            <Spacer space={10} />
            <ThemedButton title="Cancel" onPress={() => router.dismissTo("/(main)/(profile)")} />
          </View>
          <Spacer space={10} />
          <ThemedText style={appStyles.heading}>Club level attributes</ThemedText>
          {isLoadingMyClubs && <LoadingSpinner />}
          {!isLoadingMyClubs &&
            clubs?.map((item: any) => (
              <View key={item.clubId}>
                <TouchableCard onPress={() => showDetails(item)} id={item.clubId}>
                  <ThemedText>{item.clubName}</ThemedText>
                </TouchableCard>
                <Spacer space={4} />
              </View>
            ))}
          <Spacer space={10} />
        </ScrollView>
      )}
    </ThemedView>
  );
};

export default Editmember;
