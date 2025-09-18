import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
import React, { useContext, useState } from "react";
import Spacer from "@/src/components/Spacer";
import ThemedView from "@/src/components/themed-components/ThemedView";
import { router } from "expo-router";
import { ClubContext } from "@/src/context/ClubContext";
import FloatingMenu from "@/src/components/FloatingMenu";
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import ThemedText from "@/src/components/themed-components/ThemedText";
import { useTheme } from "@/src/hooks/use-theme";
import ThemedIcon from "@/src/components/themed-components/ThemedIcon";
import { ROLE_ADMIN } from "@/src/utils/constants";
import usePaginatedQuery from "@/src/hooks/usePaginatedQuery";
import { useGetClubEventsQuery, useGetClubEventTypesQuery } from "@/src/services/clubApi";
import ShadowBox from "@/src/components/ShadowBox";
import { Picker } from "@react-native-picker/picker";

const limit = 20;

const EventsHome = () => {
  const [eventTypeId, setEventTypeId] = useState("-1");
  const { clubInfo } = useContext(ClubContext);

  const { data: eventTypes, isLoading: isLoadingEventTypes } = useGetClubEventTypesQuery({ clubId: clubInfo.clubId });

  const { items, isLoading, isFetching, refreshing, onRefresh, loadMore } = usePaginatedQuery(
    useGetClubEventsQuery,
    { clubId: clubInfo.clubId, eventTypeId },
    limit
  );

  const gotoPage = (url: any) => {
    router.push(url);
  };

  return (
    <>
      <ThemedView style={{ flex: 1 }}>
        <Spacer space={10} />
        {isLoadingEventTypes ? (
          <LoadingSpinner />
        ) : (
          <Picker
            style={{ width: "80%", alignSelf: "center" }}
            selectedValue={eventTypeId}
            onValueChange={(value) => setEventTypeId(value)}
          >
            <Picker.Item label="All" value="-1" />
            {eventTypes?.map((type: any) => (
              <Picker.Item key={type.eventTypeId} label={type.name} value={type.eventTypeId} />
            ))}
          </Picker>
        )}
        <Spacer space={10} />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.eventId.toString()}
            initialNumToRender={20}
            onEndReached={loadMore}
            onEndReachedThreshold={0.2}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => router.push(`/(main)/(clubs)/(events)/eventdetails?event=${JSON.stringify(item)}`)}
              >
                <EventItem event={item} />
                <Spacer hspace={0} />
              </TouchableOpacity>
            )}
            ListFooterComponent={() =>
              (isFetching && (
                <>
                  <Spacer space={10} />
                  <LoadingSpinner />
                </>
              )) || <ThemedText style={{ alignSelf: "center", paddingVertical: 10 }}>No more items</ThemedText>
            }
          />
        )}
      </ThemedView>
      {clubInfo.role === ROLE_ADMIN && (
        <FloatingMenu
          actions={actions}
          position={"left"}
          color="black"
          icon={<MaterialIcons name={"menu"} size={32} color={"white"} />}
          onPressItem={(name: string | undefined) => handleMenuPress(name, gotoPage)}
        />
      )}
    </>
  );
};

export default EventsHome;

const handleMenuPress = (name: string | undefined, gotoPage: any) => {
  if (name == "addEvent") {
    gotoPage("/(main)/(clubs)/(events)/addevent");
  } else if (name == "attendance") {
    gotoPage("/(main)/(clubs)/(events)/attendance");
  } else {
    throw "Error";
  }
};

const actions = [
  {
    color: "black",
    text: "Add Event",
    icon: <MaterialCommunityIcons name={"calendar-plus"} size={15} color={"white"} />,
    name: "addEvent",
    position: 5,
  },
  {
    color: "black",
    text: "Attendance Report",
    icon: <AntDesign name={"barschart"} size={15} color={"white"} />,
    name: "attendance",
    position: 5,
  },
];

export const EventItem = ({ event }: { event: any }) => {
  const { colors } = useTheme();
  return (
    <ShadowBox style={{ width: "85%" }}>
      <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
        <View style={{ rowGap: 3 }}>
          <ThemedText style={{ fontWeight: "bold" }}>{event.title}</ThemedText>
          <ThemedText style={{ fontSize: 10 }}>{event.description}</ThemedText>
          <View style={{ flexDirection: "row" }}>
            <ThemedText style={{ fontSize: 12, fontWeight: "bold", color: colors.button }}>{event.name}</ThemedText>
            <Spacer hspace={2} />
            <ThemedText
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color:
                  event.status === "Completed"
                    ? colors.success
                    : event.status === "Scheduled"
                    ? colors.warning
                    : colors.error,
              }}
            >
              {event.status}
            </ThemedText>
          </View>
        </View>
        <View style={{ rowGap: 3 }}>
          <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "flex-end" }}>
            <ThemedIcon name={"MaterialIcons:calendar-today"} size={15} />
            <Spacer hspace={2} />
            <ThemedText style={{ textAlign: "right", fontSize: 12, fontWeight: "bold" }}>{event.eventDate}</ThemedText>
          </View>
          {event.startTime && (
            <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "flex-end" }}>
              <ThemedIcon name={"MaterialIcons:access-time"} size={15} />
              <Spacer hspace={2} />
              <ThemedText style={{ fontSize: 12 }}>
                {event.startTime} {event.endTime && " - " + event.endTime}
              </ThemedText>
            </View>
          )}
          {
            event.location ? (
              <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "flex-end" }}>
                <ThemedIcon name={"MaterialIcons:location-pin"} size={15} />
                <Spacer hspace={2} />
                <ThemedText style={{ textAlign: "right", fontSize: 12 }}>{event.location}</ThemedText>
              </View>
            ) : null // i dont know why erro txt  inside view. this worked though
          }
        </View>
      </View>
    </ShadowBox>
  );
};
