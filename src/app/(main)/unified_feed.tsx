import React from 'react';
import { View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Event } from '@/src/types/event';
import { BirthdayMember, FeedItem } from '@/src/types/member';
import BirthdayCard from '@/src/components/BirthdayCard';
import RoundedContainer from '@/src/components/RoundedContainer';
import ThemedText from '@/src/components/themed-components/ThemedText';
import ThemedIcon from '@/src/components/themed-components/ThemedIcon';
import Spacer from '@/src/components/Spacer';
import ExpandableCard from '@/src/components/ExpandableCard';
import CardList from '@/src/components/CardList';
import { useTheme } from '@/src/hooks/use-theme';

interface UnifiedFeedProps {
  events: Event[];
  birthdays: BirthdayMember[];
  clubs: any[];
}

const UnifiedFeed: React.FC<UnifiedFeedProps> = ({ events, birthdays, clubs }) => {
  const { colors } = useTheme();

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

      const [month, day] = birthday.birthday.split('-').map(Number);
      const birthdayThisYear = new Date(currentYear, month - 1, day);

      const diffTime = birthdayThisYear.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

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

    return feedItems.sort((a, b) => {
      if (a.sortKey === 0) return -1;
      if (b.sortKey === 0) return 1;
      if (a.sortKey === 1) return -1;
      if (b.sortKey === 1) return 1;
      return a.sortKey - b.sortKey;
    });
  };

  const feedItems = createFeedItems();

  const getEventIcon = (eventName: string | undefined): { name: string; color: string } => {
    const name = eventName?.toLowerCase() || '';
    if (name.includes('birthday')) return { name: "FontAwesome:birthday-cake", color: colors.warning };
    if (name.includes('meeting')) return { name: "MaterialIcons:event", color: colors.info };
    if (name.includes('anniversary')) return { name: "MaterialIcons:celebration", color: colors.success };
    if (name.includes('practice') || name.includes('match')) return { name: "MaterialIcons:sports-cricket", color: '#FF6B35' };
    return { name: "MaterialIcons:event", color: colors.button };
  };

  if (feedItems.length === 0) {
    return (
      <RoundedContainer>
        <ThemedText style={{ textAlign: "center" }}>No upcoming events or birthdays!</ThemedText>
      </RoundedContainer>
    );
  }

  const formatBirthdayDate = (birthdayStr: string) => {
    const [month, day] = birthdayStr.split('-').map(Number);
    const date = new Date(2000, month - 1, day);
    const monthName = date.toLocaleString('default', { month: 'long' });

    const getOrdinal = (n: number) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    return `${getOrdinal(day)} ${monthName}`;
  };

  return (
    <>
      {events?.length > 0 && (
        <CardList
          headerTitle="Upcoming Events"
          headerIcon="MaterialIcons:event"
        >
          {feedItems.filter(item => item.type === 'event').map((item, idx) => (
            <Animated.View
              key={`event-${(item.data as Event).eventId}`}
              entering={FadeInUp.duration(380).delay(idx * 80)}
            >
              <ExpandableCard
                title={(item.data as Event).title}
                subtitle={`${(item.data as Event).eventDate} • ${(item.data as Event).clubName}`}
                statusIconName={getEventIcon((item.data as Event).name).name}
                statusIconColor={getEventIcon((item.data as Event).name).color}
                onActionPress={() => console.log('Delete pressed')}
                isExpandable={true}
              >
                <View style={{ gap: 8 }}>
                  {(item.data as Event).description && (
                    <ThemedText style={{ fontSize: 14, color: colors.subText, marginBottom: 4 }}>
                      {(item.data as Event).description}
                    </ThemedText>
                  )}

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ThemedIcon name="MaterialIcons:access-time" size={16} color={colors.subText} />
                    <Spacer hspace={8} />
                    <ThemedText style={{ fontSize: 13 }}>
                      {(item.data as Event).startTime}
                      {(item.data as Event).endTime && ` - ${(item.data as Event).endTime}`}
                    </ThemedText>
                  </View>

                  {(item.data as Event).location && (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <ThemedIcon name="MaterialIcons:location-pin" size={16} color={colors.subText} />
                      <Spacer hspace={8} />
                      <ThemedText style={{ fontSize: 13 }}>
                        {(item.data as Event).location}
                      </ThemedText>
                    </View>
                  )}
                </View>
              </ExpandableCard>
            </Animated.View>
          ))}
        </CardList>
      )}

      {birthdays?.length > 0 && (
        <CardList
          headerTitle="Upcoming Birthdays"
          headerIcon="FontAwesome:birthday-cake"
        >
          {feedItems.filter(item => item.type === 'birthday').map((item, idx) => (
            <Animated.View
              key={`birthday-${(item.data as BirthdayMember).memberId}`}
              entering={FadeInUp.duration(380).delay(idx * 80)}
            >
              <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
                <BirthdayCard
                  member={{
                    ...item.data as BirthdayMember,
                    birthday: formatBirthdayDate((item.data as BirthdayMember).birthday)
                  }}
                  layout="list"
                />
              </View>
            </Animated.View>
          ))}
        </CardList>
      )}
    </>
  );
};

export default UnifiedFeed;
