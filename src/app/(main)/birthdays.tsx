import React, { useContext, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { UserContext } from '../../context/UserContext';
import { useGetBirthdaysQuery } from '@/src/services/memberApi';
import { useGetClubQuery } from '@/src/services/clubApi';
import { useTheme } from '@/src/hooks/use-theme';
import { useAsyncStorage } from '@/src/hooks/use-async-storage';
import ThemedView from '@/src/components/themed-components/ThemedView';
import ThemedText from '@/src/components/themed-components/ThemedText';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import CardList from '@/src/components/CardList';
import BirthdayCard from '@/src/components/BirthdayCard';
import Spacer from '@/src/components/Spacer';
import Animated, { FadeInUp } from 'react-native-reanimated';
import InputSelect from '@/src/components/InputSelect';
import { Picker } from '@react-native-picker/picker';

const BirthdaysPage = () => {
  const { userInfo } = useContext(UserContext);
  const { colors } = useTheme();
  
  // Reuse the same storage key for club selection
  const [selectedClubId, setSelectedClubId] = useAsyncStorage<number>("selectedClubId", -1);
  
  // Month filter: -1 for All, 0-11 for months
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());

  const {
    data: clubs,
    isLoading: isLoadingClubs,
    refetch: refetchClubs,
  } = useGetClubQuery({ memberId: userInfo?.memberId });

  const {
    data: birthdays,
    isLoading: isBirthdaysLoading,
    isFetching: isFetchingBirthdays,
    refetch: refetchBirthdays,
  } = useGetBirthdaysQuery({
    memberId: userInfo?.memberId,
    clubId: selectedClubId
  });

  const onRefresh = () => {
    refetchClubs();
    refetchBirthdays();
  };

  const months = [
    { label: 'All Months', value: -1 },
    { label: 'January', value: 0 },
    { label: 'February', value: 1 },
    { label: 'March', value: 2 },
    { label: 'April', value: 3 },
    { label: 'May', value: 4 },
    { label: 'June', value: 5 },
    { label: 'July', value: 6 },
    { label: 'August', value: 7 },
    { label: 'September', value: 8 },
    { label: 'October', value: 9 },
    { label: 'November', value: 10 },
    { label: 'December', value: 11 },
  ];

  const filteredBirthdays = (birthdays || []).filter((b: any) => {
    if (selectedMonth === -1) return true;
    const [month] = b.birthday.split('-').map(Number);
    return (month - 1) === selectedMonth;
  }).sort((a: any, b: any) => {
    // Sort chronologically by month and then day
    const [monthA, dayA] = a.birthday.split('-').map(Number);
    const [monthB, dayB] = b.birthday.split('-').map(Number);
    
    if (monthA !== monthB) {
      return monthA - monthB;
    }
    return dayA - dayB;
  });

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

  const handleClubChange = (val: any) => {
    const numVal = Number(val);
    setSelectedClubId(numVal);
  };

  const handleMonthChange = (val: any) => {
    const numVal = Number(val);
    setSelectedMonth(numVal);
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      {/* Compact Filters Section */}
      <View style={{ 
        paddingHorizontal: 12, 
        paddingTop: 12, 
        paddingBottom: 8,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
      }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {/* Club Filter */}
          <View style={{ flex: 1 }}>
            <InputSelect
              label="Club"
              selectedValue={selectedClubId}
              onValueChange={handleClubChange}
              style={{ width: "100%", marginVertical: 0, height: 40 }}
            >
              <Picker.Item label="All Clubs" value={-1} />
              {clubs?.map((club: any) => (
                <Picker.Item key={club.clubId} label={club.clubName} value={club.clubId} />
              ))}
            </InputSelect>
          </View>

          {/* Month Filter */}
          <View style={{ flex: 1 }}>
            <InputSelect
              label="Month"
              selectedValue={selectedMonth}
              onValueChange={handleMonthChange}
              style={{ width: "100%", marginVertical: 0, height: 40 }}
            >
              {months.map((m) => (
                <Picker.Item key={m.value} label={m.label} value={m.value} />
              ))}
            </InputSelect>
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isFetchingBirthdays}
            onRefresh={onRefresh}
          />
        }
      >
        <Spacer space={8} />

        {/* Birthdays List */}
        <CardList
          headerTitle={selectedMonth === -1 ? "All Birthdays" : `${months.find(m => m.value === selectedMonth)?.label} Birthdays`}
          headerIcon="FontAwesome:birthday-cake"
        >
          {isBirthdaysLoading && <LoadingSpinner />}
          
          {!isBirthdaysLoading && filteredBirthdays.length === 0 && (
            <View style={{ padding: 24, alignItems: 'center' }}>
              <ThemedText style={{ color: colors.subText }}>No birthdays found</ThemedText>
            </View>
          )}

          {filteredBirthdays.map((member: any, idx: number) => (
            <Animated.View
              key={member.memberId}
              entering={FadeInUp.duration(380).delay(idx * 50)}
            >
              <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
                <BirthdayCard
                  member={{
                    ...member,
                    birthday: formatBirthdayDate(member.birthday)
                  }}
                  layout="list"
                />
              </View>
            </Animated.View>
          ))}
        </CardList>

        <Spacer space={50} />
      </ScrollView>
    </ThemedView>
  );
};

export default BirthdaysPage;
