import { TouchableOpacity, View } from "react-native";
import { Event } from "@/src/helpers/events_helper";
import Card from "@/src/components/Card";
import ThemedText from "@/src/components/themed-components/ThemedText";
import Spacer from "@/src/components/Spacer";
import ThemedIcon from "@/src/components/themed-components/ThemedIcon";
import { router } from "expo-router";
import { useContext } from "react";
import { ClubContext } from "@/src/context/ClubContext";

const UpcomingEvents = (props: { events: Event[]; clubs: any[] }) => {
  const { setClubInfo } = useContext(ClubContext);

  const gotoEventDetails = async (event: Event) => {
    const roleName = props.clubs.find(c=> c.clubId == event.clubId).roleName;
    await setClubInfo({ clubId: event.clubId, clubName: event.clubName, role: roleName });
    router.push(`/(main)/(clubs)/(events)/eventdetails?event=${JSON.stringify(event)}`)
  }
  return (
    <View style={{ width: "85%", alignSelf: "center" }}>
      {props.events?.length == 0 && <ThemedText style={{ ThemedTextAlign: "center" }}>No upcoming events!</ThemedText>}
      {props.events.map((event) => {
        return (
          <TouchableOpacity key={event.eventId} onPress={()=> gotoEventDetails(event)}>
            <EventCard event={event} />
            <Spacer space={4} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const getEventIcon = (event: Event | undefined) => {
  if (event?.name?.toLowerCase() == "birthday") {
    return <ThemedIcon name={"FontAwesome:birthday-cake"} size={30} />;
  } else if (event?.name?.toLowerCase() == "meeting") {
    return <ThemedIcon name={"MaterialIcons:event"} size={30} />;
  } else if (event?.name?.toLowerCase() == "anniversary") {
    return <ThemedIcon name={"MaterialIcons:celebration"} size={30} />;
  } else if (event?.name?.toLowerCase() == "practice session") {
    return <ThemedIcon name={"MaterialIcons:sports-cricket"} size={30} />;
  } else if (event?.name?.toLowerCase() == "match") {
    return <ThemedIcon name={"MaterialIcons:sports-cricket"} size={30} />;
  } else {
    return <ThemedIcon name={"MaterialIcons:event"} size={30} />;
  }
};

export default UpcomingEvents;

export const EventCard = ({ event, cardSize }: { event: Event | undefined; cardSize?: string }) => {
  return (
    <Card>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View>
            <ThemedText style={{ fontWeight: "bold", fontSize: 15 }}>{event?.title}</ThemedText>
            <ThemedText style={{ fontSize: 10 }}>{event?.description}</ThemedText>
          </View>
        </View>
        <Spacer hspace={10} />
        {getEventIcon(event)}
      </View>
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 5,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <ThemedIcon name={"MaterialIcons:calendar-today"} size={15} />
            <Spacer hspace={2} />
            <ThemedText style={{ fontSize: 12 }}>{event?.eventDate}</ThemedText>
            <Spacer hspace={10} />
            {cardSize === "long" && event?.startTime && (
              <>
                <ThemedIcon name={"MaterialIcons:access-time"} size={15} />
                <Spacer hspace={2} />
                <ThemedText style={{ fontSize: 12 }}>
                  {event?.startTime}
                  {event?.endTime && " - "}
                  {event?.endTime}
                </ThemedText>
              </>
            )}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {event?.location ? <ThemedIcon name={"MaterialIcons:location-pin"} size={15} /> : <></>}
            <ThemedText style={{ fontSize: 12 }}>{event?.location}</ThemedText>
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5, justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            {cardSize !== "long" && event?.startTime && (
              <>
                <ThemedIcon name={"MaterialIcons:access-time"} size={15} />
                <Spacer hspace={2} />
                <ThemedText style={{ fontSize: 12 }}>
                  {event?.startTime}
                  {event?.endTime && " - "}
                  {event?.endTime}
                </ThemedText>
              </>
            )}
          </View>
          <ThemedText style={{ textAlign: "right", fontSize: 10 }}>{event?.clubName}</ThemedText>
        </View>
      </View>
    </Card>
  );
};
