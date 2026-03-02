import React, { useContext } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Event } from "@/src/types/event";
import Card from "@/src/components/Card";
import ThemedText from "@/src/components/themed-components/ThemedText";
import Spacer from "@/src/components/Spacer";
import ThemedIcon from "@/src/components/themed-components/ThemedIcon";
import { router } from "expo-router";
import { ClubContext } from "@/src/context/ClubContext";
import RoundedContainer from "@/src/components/RoundedContainer";
import Divider from "@/src/components/Divider";
import { useTheme } from "@/src/hooks/use-theme";

const UpcomingEvents = (props: { events: Event[]; clubs: any[] }) => {
  const { setClubInfo } = useContext(ClubContext);

  const gotoEventDetails = async (event: Event) => {
    const roleName = props.clubs.find((c) => c.clubId == event.clubId).roleName;
    await setClubInfo({ clubId: event.clubId, clubName: event.clubName, role: roleName });
    router.push(`/(main)/(clubs)/(events)/eventdetails?event=${JSON.stringify(event)}`);
  };
  return (
    <RoundedContainer>
      {props.events?.length == 0 && <ThemedText style={{ ThemedTextAlign: "center" }}>No upcoming events!</ThemedText>}
      {props.events.map((event, idx) => {
        return (
          <TouchableOpacity key={event.eventId} onPress={() => gotoEventDetails(event)}>
            <Animated.View entering={FadeInUp.duration(380).delay(idx * 80)} style={{ overflow: "hidden" }}>
              <EventCard event={event} />
              {idx < props.events.length - 1 && <Divider />}
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </RoundedContainer>
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
  const { colors } = useTheme();
  
  const getEventColor = (eventName: string | undefined) => {
    const name = eventName?.toLowerCase() || '';
    if (name.includes('birthday')) return colors.warning;
    if (name.includes('meeting')) return colors.info;
    if (name.includes('anniversary')) return colors.success;
    if (name.includes('practice') || name.includes('match')) return '#FF6B35';
    return colors.button;
  };

  const eventColor = getEventColor(event?.name);

  return (
    <View style={{ 
      margin: 8, width: "85%",
      alignSelf: "center",
      borderRadius: 16,
      backgroundColor: colors.primary,
      // Shadow for iOS
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      // Shadow for Android
      elevation: 4,
      overflow: 'hidden'
    }}>
      {/* Color accent bar */}
      <View style={{ 
        height: 4, 
        backgroundColor: eventColor,
        width: '100%'
      }} />
      
      <View style={{ padding: 20 }}>
        {/* Header section */}
        <View style={{ 
          flexDirection: "row", 
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16
        }}>
          <View style={{ flex: 1, marginRight: 16 }}>
            <ThemedText style={{ 
              fontWeight: "bold", 
              fontSize: 18,
              color: colors.heading,
              marginBottom: 4
            }}>
              {event?.title}
            </ThemedText>
            {event?.description && (
              <ThemedText style={{ 
                fontSize: 14, 
                color: colors.subText,
                lineHeight: 20
              }}>
                {event?.description}
              </ThemedText>
            )}
          </View>
          
          {/* Event icon with background */}
          <View style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: eventColor + '20', // 20% opacity
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {React.cloneElement(getEventIcon(event), { 
              size: 24, 
              color: eventColor 
            })}
          </View>
        </View>

        {/* Details section */}
        <View style={{ gap: 12 }}>
          {/* Date and Time row */}
          <View style={{ 
            flexDirection: "row", 
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: 'wrap'
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: colors.secondary + '30',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 8
              }}>
                <ThemedIcon name={"MaterialIcons:calendar-today"} size={16} color={colors.text} />
              </View>
              <ThemedText style={{ 
                fontSize: 12,
                fontWeight: '500',
                color: colors.text
              }}>
                {event?.eventDate}
              </ThemedText>
            </View>
            
            {event?.startTime && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: colors.secondary + '30',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 8
                }}>
                  <ThemedIcon name={"MaterialIcons:access-time"} size={16} color={colors.text} />
                </View>
                <ThemedText style={{ 
                  fontSize: 12,
                  fontWeight: '500',
                  color: colors.text
                }}>
                  {event?.startTime}
                  {event?.endTime && ` - ${event?.endTime}`}
                </ThemedText>
              </View>
            )}
          </View>

          {/* Location row */}
          {event?.location && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: colors.secondary + '30',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 8
              }}>
                <ThemedIcon name={"MaterialIcons:location-pin"} size={16} color={colors.text} />
              </View>
              <ThemedText style={{ 
                fontSize: 14,
                color: colors.text,
                flex: 1
              }}>
                {event?.location}
              </ThemedText>
            </View>
          )}
        </View>

        {/* Footer - Club name */}
        <View style={{ 
          marginTop: 16,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: colors.border
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{
              backgroundColor: eventColor + '15',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <View style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: eventColor,
                marginRight: 6
              }} />
              <ThemedText style={{ 
                fontSize: 12,
                fontWeight: '600',
                color: eventColor
              }}>
                {event?.clubName}
              </ThemedText>
            </View>
            
            {event?.name && (
              <ThemedText style={{ 
                fontSize: 11,
                color: colors.subText,
                fontStyle: 'italic'
              }}>
                {event?.name}
              </ThemedText>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
