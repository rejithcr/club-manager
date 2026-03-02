import { View, FlatList, Platform, Image, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ClubContext } from "@/src/context/ClubContext";
import ThemedView from "@/src/components/themed-components/ThemedView";
import { Picker } from "@react-native-picker/picker";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import Spacer from "@/src/components/Spacer";
import DatePicker from "@/src/components/DatePicker";
import ThemedButton from "@/src/components/ThemedButton";
import ProgressBar from "@/src/components/charts/ProgressBar";
import ThemedText from "@/src/components/themed-components/ThemedText";
import { useGetClubEventTypesQuery, useLazyGetAttendanceReportQuery } from "@/src/services/clubApi";
import RoundedContainer from "@/src/components/RoundedContainer";
import ThemedIcon from "@/src/components/themed-components/ThemedIcon";
import Divider from "@/src/components/Divider";
import { useTheme } from "@/src/hooks/use-theme";

const AttendanceReport = () => {
  const { clubInfo } = useContext(ClubContext);
  const { colors } = useTheme();
  const [eventTypeId, setEventTypeId] = useState<number>();
  const [eventTypeName, setEventTypeName] = useState<string>();
  const defaultDate = new Date();
  defaultDate.setMonth(defaultDate.getMonth() - 1);
  const [startDate, setStartDate] = useState(defaultDate);
  const [endDate, setEndDate] = useState(new Date());

  const { data: eventTypes, isLoading: isLoadingEventTypes } = useGetClubEventTypesQuery({ clubId: clubInfo.clubId });

  useEffect(() => {
    eventTypes && setEventTypeId(eventTypes[0].eventTypeId);
  }, [eventTypes]);

  useEffect(() => {
    const event = eventTypes?.find((et: any) => et.eventTypeId == eventTypeId);
    setEventTypeName(event?.name);
  }, [eventTypeId]);

  const [getAttendanceReport, { data: report, isFetching: isLoadingReport }] = useLazyGetAttendanceReportQuery();

  const handleShowReport = () => {
    setShowParams(false);
    getAttendanceReport({
      eventTypeId,
      startDate: startDate.toISOString().substring(0, 10),
      endDate: endDate.toISOString().substring(0, 10),
    });
  };

  const [showParams, setShowParams] = useState(true);
  return (
    <ThemedView style={{ flex: 1 }}>
      <Spacer space={Platform.OS == "web" ? 10 : 5} />
      <RoundedContainer>
        <TouchableOpacity
          onPress={() => setShowParams((prev) => !prev)}
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 10,
            paddingHorizontal: 18,
          }}
        >
          <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 5}}>
              <ThemedIcon
                size={20}
                name={
                  showParams
                    ? "MaterialCommunityIcons:chevron-down-circle"
                    : "MaterialCommunityIcons:chevron-right-circle"
                }
                color={colors.nav}
              />
              <ThemedText>
                {eventTypeName} between {startDate.toISOString().substring(0, 10)} and {endDate.toISOString().substring(0, 10)}                
              </ThemedText>
            </View>
          </View>
        </TouchableOpacity>
      </RoundedContainer>
      {showParams && (
        <>
          <Spacer space={10} />
          {isLoadingEventTypes ? (
            <LoadingSpinner />
          ) : (
            <Picker
              style={{ width: "80%", alignSelf: "center" }}
              selectedValue={eventTypeId}
              onValueChange={(value) => setEventTypeId(value)}
            >
              {eventTypes?.map((type: any) => (
                <Picker.Item key={type.eventTypeId} label={type.name} value={type.eventTypeId} />
              ))}
            </Picker>
          )}
          <DatePicker date={startDate} setDate={setStartDate} label="Start Date" />
          <DatePicker date={endDate} setDate={setEndDate} label="End Date" />
          {!isLoadingEventTypes && <ThemedButton title="Show Report" onPress={handleShowReport} />}
        </>
      )}
      <Spacer space={10} />
      {isLoadingReport ? (
        <LoadingSpinner />
      ) : (
        report && report.length === 0 ? <ThemedText style={{alignSelf:"center"}}>No records found</ThemedText> : (
          <RoundedContainer style={{ flex: 1 }}>
            <FlatList
              data={report}
              keyExtractor={(r: any) => r.memberId}
              ItemSeparatorComponent={() => <Divider />}
              renderItem={({ item }) => (
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                  }}
                >
                  {item.photo ? (
                    <Image source={{ uri: item.photo }} style={{ height: 32, width: 32, borderRadius: 100 }} />
                  ) : (
                    <ThemedIcon name={"MaterialIcons:account-circle"} size={32} />
                  )}
                  <ThemedText style={{ width: "40%" }}>
                    {item.firstName} {item.lastName}
                  </ThemedText>
                  <View style={{ width: "40%" }}>
                    <ProgressBar height={12} value={Math.round(item.attendancePercentage)} />
                  </View>
                </View>
              )}
            />
          </RoundedContainer>
        )
      )}
      <Spacer space={10} />
    </ThemedView>
  );
};

export default AttendanceReport;
