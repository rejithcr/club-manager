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

    // Add birthdays (including previous week)
    birthdays?.forEach((birthday) => {
      const today = new Date();
      const currentYear = today.getFullYear();
      
      // Parse birthday (format: MM-DD)
      const [month, day] = birthday.birthday.split('-').map(Number);
      const birthdayThisYear = new Date(currentYear, month - 1, day);
      
      // Calculate days until birthday
      const diffTime = birthdayThisYear.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Include birthdays from previous week (-7 days) to future
      if (diffDays >= -7) {
        feedItems.push({
          type: 'birthday',
          date: birthdayThisYear,
          sortKey: diffDays,
          data: {
            ...birthday,
            daysUntilBirthday: diffDays
          }
        });
      }
    });

    // Sort with special priority: today=0, tomorrow=1, then by absolute days (past negatives first)
    return feedItems.sort((a, b) => {
      // Priority for today and tomorrow
      if (a.sortKey === 0) return -1;
      if (b.sortKey === 0) return 1;
      if (a.sortKey === 1) return -1;
      if (b.sortKey === 1) return 1;
      
      // Then by days (past dates with negative values come after today/tomorrow)
      return a.sortKey - b.sortKey;
    });
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
              <TouchableOpacity onPress={() => gotoEventDetails(item.data as Event)}>
                <EventCard event={item.data as Event} />
              </TouchableOpacity>
            ) : ( <RoundedContainer>
              <View style={{ paddingHorizontal: 25, paddingVertical: 10 }}>
                <BirthdayCard 
                  member={item.data as BirthdayMember}
                  //onPress={() => handleBirthdayPress(item.data as BirthdayMember)}
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