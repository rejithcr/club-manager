import { View, FlatList } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ClubContext } from "@/src/context/ClubContext";
import ThemedView from "@/src/components/themed-components/ThemedView";
import { Picker } from "@react-native-picker/picker";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import Spacer from "@/src/components/Spacer";
import DatePicker from "@/src/components/DatePicker";
import ThemedButton from "@/src/components/ThemedButton";
import ProgressBar from "@/src/components/charts/ProgressBar";
import ShadowBox from "@/src/components/ShadowBox";
import ThemedText from "@/src/components/themed-components/ThemedText";
import { useGetClubEventTypesQuery, useLazyGetAttendanceReportQuery } from "@/src/services/clubApi";

const AttendanceReport = () => {
  const { clubInfo } = useContext(ClubContext);
  const [eventTypeId, setEventTypeId] = useState<number>();
  const defaultDate = new Date();
  defaultDate.setMonth(defaultDate.getMonth() - 1);
  const [startDate, setStartDate] = useState(defaultDate);
  const [endDate, setEndDate] = useState(new Date());

  const { data: eventTypes, isLoading: isLoadingEventTypes } = useGetClubEventTypesQuery({ clubId: clubInfo.clubId });
   
  useEffect(() => {
    eventTypes && setEventTypeId(eventTypes[0].eventTypeId);
  }, [eventTypes]);

  const [getAttendanceReport, { data: report, isLoading: isLoadingReport }] = useLazyGetAttendanceReportQuery();

  const handleShowReport = () => {
    getAttendanceReport({
      eventTypeId,
      startDate: startDate.toISOString().substring(0, 10),
      endDate: endDate.toISOString().substring(0, 10),
    });
  };
  return (
    <ThemedView style={{ flex: 1 }}>
      <Spacer space={5} />
      {isLoadingEventTypes ? (
        <LoadingSpinner />
      ) : (
        <Picker
          style={{ width: "85%", alignSelf: "center" }}
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

      <Spacer space={10} />
      {isLoadingReport ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={report}
          keyExtractor={(r: any) => r.memberId}
          ItemSeparatorComponent={() => <Spacer space={4} />}
          ListFooterComponent={() => <Spacer space={10} />}
          renderItem={({ item }) => (
            <ShadowBox
              style={{ width: "85%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
            >
              <ThemedText style={{ width: "60%" }}>
                {item.firstName} {item.lastName}
              </ThemedText>
              <View style={{ width: "40%" }}>
                <ProgressBar height={12} value={Math.round(item.attendancePercentage)} />
              </View>
            </ShadowBox>
          )}
        />
      )}
    </ThemedView>
  );
};

export default AttendanceReport;
