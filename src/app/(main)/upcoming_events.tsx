import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { appStyles } from '@/src/utils/styles';
import { MaterialIcons } from '@expo/vector-icons';
import { getEvents, Event } from '@/src/helpers/events_helper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import LoadingSpinner from '@/src/components/LoadingSpinner';


const UpcomingEvents = (props: { memberEmail: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    getEvents(props.memberEmail)
      .then(data => { setEvents(data); setIsLoading(false) })
      .catch(error => { console.error(error); setIsLoading(false) });
  }, [])

  return (
    <View>
      <Text style={appStyles.title}>Upcoming Events</Text>
      {isLoading && <LoadingSpinner />}
      {!isLoading && events.map((event) => {
        return (
          <View key={event.id} style={{ ...appStyles.shadowBox, width: "80%", marginBottom: 15 }}>
            <View style={{ width: "15%", paddingRight: 10, alignItems: "center" }}>
              {getEventIcon(event)}
            </View>
            <View style={{ width: "80%", flexDirection: "row", flexWrap: "wrap" }}>
              <View style={{
                flexDirection: "row", width: "100%", margin: 5,
                justifyContent: "space-between", alignItems: "center"
              }}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}> {event.name} </Text>
                <Text style={{ fontSize: 10, paddingRight: 10 }}> {event.type} </Text>
              </View>
              <View style={{ flexDirection: "row", margin: 5, alignItems: "center" }}>
                <MaterialIcons name={"calendar-today"} size={20} />
                <Text> {event.date} </Text>
              </View>
              {event?.time && <View style={{ flexDirection: "row", margin: 5, alignItems: "center" }}>
                <MaterialIcons name={"access-time"} size={20} />
                <Text> {event?.time} </Text>
              </View>
              }
              {event?.location &&
                <View style={{ flexDirection: "row", margin: 5, alignItems: "center" }}>
                  <MaterialIcons name={"location-pin"} size={20} />
                  <Text> {event?.location} </Text>
                </View>
              }
            </View>
          </View>
        )
      })}
    </View>
  )
}

const getEventIcon = (event: Event) => {
  if (event.type.toLowerCase() == "birthday") {
    return <FontAwesome name={"birthday-cake"} size={30} />
  } else if (event.type.toLowerCase() == "meeting") {
    return <MaterialIcons name={"event"} size={30} />
  } else if (event.type.toLowerCase() == "anniversary") {
    return <MaterialIcons name={"celebration"} size={30} />
  } else {
    return <MaterialIcons name={"event"} size={30} />
  }
}

export default UpcomingEvents