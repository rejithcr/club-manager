import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import Spacer from "@/src/components/Spacer";
import ThemedView from "@/src/components/themed-components/ThemedView";
import { router } from "expo-router";
import Alert, { AlertProps } from "@/src/components/Alert";
import { getEvents } from "@/src/helpers/events_helper";
import { ClubContext } from "@/src/context/ClubContext";
import FloatingMenu from "@/src/components/FloatingMenu";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import ThemedText from "@/src/components/themed-components/ThemedText";
import { useTheme } from "@/src/hooks/use-theme";
import ShadowBox from "@/src/components/ShadowBox";
import { appStyles } from "@/src/utils/styles";
import ThemedIcon from "@/src/components/themed-components/ThemedIcon";

const EventsHome = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { clubInfo } = useContext(ClubContext);
  const [alertConfig, setAlertConfig] = useState<AlertProps>();

  const offset = useRef(0);
  const limit = 20;
  const [hasMoreData, setHasMoreData] = useState(false);
  const [isFectching, setIsFetching] = useState(false);

  const onRefresh = () => {
    setIsLoading(true);
    offset.current = 0;
    getEvents(clubInfo.clubId, limit, offset.current)
      .then((response) => {
        setHasMoreData(response.data?.length > 0);
        setEvents(response.data);
      })
      .catch((error) =>
        setAlertConfig({
          visible: true,
          title: "Error",
          message: error.response.data.error,
          buttons: [{ text: "OK", onPress: () => setAlertConfig({ visible: false }) }],
        })
      )
      .finally(() => setIsLoading(false));
  };

  const fetchNextPage = () => {
    if (hasMoreData && !isFectching) {
      setIsFetching(true);
      offset.current = offset.current + limit;
      getEvents(clubInfo.clubId, limit, offset.current)
        .then((response) => {
          setHasMoreData(response.data?.length > 0);
          setEvents((prev: any) => [...prev, ...response.data]);
        })
        .catch((error) =>
          setAlertConfig({
            visible: true,
            title: "Error",
            message: error.response.data.error,
            buttons: [{ text: "OK", onPress: () => setAlertConfig({ visible: false }) }],
          })
        )
        .finally(() => setIsFetching(false));
    }
  };

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <>
      <ThemedView style={{ flex: 1 }}>
        <Spacer space={5} />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <FlatList
            data={events}
            keyExtractor={(item) => item.eventId.toString()}
            initialNumToRender={20}
            onEndReached={fetchNextPage}
            onEndReachedThreshold={0.2}
            refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => router.push(`/(main)/(clubs)/(events)/eventdetails?event=${JSON.stringify(item)}`)}
              >
                <EventItem event={item} />
                <Spacer hspace={0} />
              </TouchableOpacity>
            )}
            ListFooterComponent={() =>
              (isFectching && (
                <>
                  <Spacer space={10} />
                  <LoadingSpinner />
                </>
              )) || <Spacer space={4} />
            }
          />
        )}
        {alertConfig?.visible && <Alert {...alertConfig} />}
      </ThemedView>
      <FloatingMenu
        actions={actions}
        position={"left"}
        color="black"
        icon={<MaterialIcons name={"menu"} size={32} color={"white"} />}
        onPressItem={(name: string | undefined) => handleMenuPress(name)}
      />
    </>
  );
};

export default EventsHome;

const handleMenuPress = (name: string | undefined) => {
  if (name == "addEvent") {
    router.push("/(main)/(clubs)/(events)/addevent");
  } if (name == "attendance") {
    router.push("/(main)/(clubs)/(events)/attendance");
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
  },{
    color: "black",
    text: "Attendance Report",
    icon: <MaterialCommunityIcons name={"calendar-plus"} size={15} color={"white"} />,
    name: "attendance",
    position: 5,
  },
];

export const EventItem = ({ event }: { event: any }) => {
  const { colors } = useTheme();
  return (
    <ThemedView style={{ ...appStyles.shadowBox, width: "85%" }}>
      <ThemedView style={{ flexDirection: "row", width: "100%", justifyContent: "space-between"}}>
        <ThemedView style={{rowGap: 3 }}>
          <ThemedText style={{ fontWeight: "bold" }}>{event.title}</ThemedText>
          <ThemedText style={{ fontSize: 10 }}>{event.description}</ThemedText>
          <ThemedView style={{ flexDirection: "row" }}>
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
          </ThemedView>
        </ThemedView>
        <ThemedView style={{rowGap: 3 }}>
          <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "flex-end" }}>
            <ThemedIcon name={"MaterialIcons:calendar-today"} size={15} />
            <Spacer hspace={2} />
            <ThemedText style={{ textAlign: "right", fontSize: 12, fontWeight: "bold" }}>{event.eventDate}</ThemedText>
          </View>
          {event.startTime && (
            <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "flex-end" }}>
              <ThemedIcon name={"MaterialIcons:access-time"} size={15} />
              <Spacer hspace={2} />
              <ThemedText style={{ fontSize: 12}}>
                {event.startTime} {event.endTime && " - " + event.endTime}
              </ThemedText>
            </View>
          )}
          {event.location ? 
            <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "flex-end" }}>
              <ThemedIcon name={"MaterialIcons:location-pin"} size={15} />
              <Spacer hspace={2} />
              <ThemedText style={{ textAlign: "right", fontSize: 12}}>{event.location}</ThemedText>
            </View> : null // i dont know why erro txt  inside view. this worked though
          }
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};
