import { FlatList, RefreshControl, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import Spacer from "@/src/components/Spacer";
import ThemedView from "@/src/components/themed-components/ThemedView";
import { router } from "expo-router";
import Alert, { AlertProps } from "@/src/components/Alert";
import { getEvents } from "@/src/helpers/events_helper";
import { ClubContext } from "@/src/context/ClubContext";
import FloatingMenu from "@/src/components/FloatingMenu";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { EventCard } from "../../upcoming_events";
import LoadingSpinner from "@/src/components/LoadingSpinner";

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
          buttons: [
            { text: "OK", onPress: () => setAlertConfig({ visible: false }) },
          ],
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
            buttons: [
              { text: "OK", onPress: () => setAlertConfig({ visible: false }) },
            ],
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
    <ThemedView style={{ flex: 1, width: "90%", alignSelf: "center" }}>
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
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/(main)/(clubs)/(events)/eventdetails?event=${JSON.stringify(item)}`)}
            >
              <EventCard event={item} cardSize={"long"} />
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
  } else {
    throw "Error";
  }
};

const actions = [
  {
    color: "black",
    text: "Add Event",
    icon: (
      <MaterialCommunityIcons
        name={"calendar-plus"}
        size={15}
        color={"white"}
      />
    ),
    name: "addEvent",
    position: 5,
  },
];
