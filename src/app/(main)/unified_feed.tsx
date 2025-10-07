import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Event } from '@/src/types/event';
import { BirthdayMember, FeedItem } from '@/src/types/member';
import BirthdayCard from '@/src/components/BirthdayCard';
import { EventCard } from './upcoming_events';
import RoundedContainer from '@/src/components/RoundedContainer';
import ThemedText from '@/src/components/themed-components/ThemedText';
import { router } from 'expo-router';
import { useContext } from 'react';
import { ClubContext } from '@/src/context/ClubContext';
import Spacer from '@/src/components/Spacer';

interface UnifiedFeedProps {
  events: Event[];
  birthdays: BirthdayMember[];
  clubs: any[];
}

const UnifiedFeed: React.FC<UnifiedFeedProps> = ({ events, birthdays, clubs }) => {
  const { setClubInfo } = useContext(ClubContext);

  // Create unified feed items
  const createFeedItems = (): FeedItem[] => {
    const feedItems: FeedItem[] = [];
    
    // Add events
    events?.forEach((event) => {
      const eventDate = new Date(event.eventDate);
      const today = new Date();
      const diffTime = eventDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      feedItems.push({
        type: 'event',
        date: eventDate,
        sortKey: diffDays,
        data: event
      });
    });

    // Add birthdays
    birthdays?.forEach((birthday) => {
      const today = new Date();
      const currentYear = today.getFullYear();
      const birthdayThisYear = new Date(currentYear, 
        parseInt(birthday.birthday.split('-')[0]) - 1, 
        parseInt(birthday.birthday.split('-')[1])
      );
      
      // If birthday already passed this year, use next year
      if (birthdayThisYear < today) {
        birthdayThisYear.setFullYear(currentYear + 1);
      }
      
      feedItems.push({
        type: 'birthday',
        date: birthdayThisYear,
        sortKey: birthday.daysUntilBirthday,
        data: birthday
      });
    });

    // Sort by sortKey (days until event/birthday)
    return feedItems.sort((a, b) => a.sortKey - b.sortKey);
  };

  const feedItems = createFeedItems();

  const gotoEventDetails = async (event: Event) => {
    const roleName = clubs.find((c) => c.clubId == event.clubId)?.roleName;
    await setClubInfo({ clubId: event.clubId, clubName: event.clubName, role: roleName });
    router.push(`/(main)/(clubs)/(events)/eventdetails?event=${JSON.stringify(event)}`);
  };

  const handleBirthdayPress = (birthday: BirthdayMember) => {
    // Optional: Navigate to member profile or club
    console.log('Birthday member pressed:', birthday);
  };

  if (feedItems.length === 0) {
    return (
      <RoundedContainer>
        <ThemedText style={{ textAlign: "center" }}>No upcoming events or birthdays!</ThemedText>
      </RoundedContainer>
    );
  }

  return (<>
      {feedItems.map((item, idx) => {
        const isLastItem = idx === feedItems.length - 1;
        
        return (
          <Animated.View 
            key={`${item.type}-${item.type === 'event' ? item.data.eventId : item.data.memberId}`}
            entering={FadeInUp.duration(380).delay(idx * 80)} 
            style={{ overflow: "hidden" }}
          >
            {item.type === 'event' ? (
                <RoundedContainer>
              <TouchableOpacity onPress={() => gotoEventDetails(item.data as Event)}>
                <EventCard event={item.data as Event} />
              </TouchableOpacity></RoundedContainer>
            ) : ( <RoundedContainer>
              <View style={{ paddingHorizontal: 25, paddingVertical: 10 }}>
                <BirthdayCard 
                  member={item.data as BirthdayMember}
                  onPress={() => handleBirthdayPress(item.data as BirthdayMember)}
                  layout="list"
                />
              </View></RoundedContainer>
            )}
            {<Spacer space={5} />}
          </Animated.View>
        );
      })}</>
  );
};

export default UnifiedFeed;