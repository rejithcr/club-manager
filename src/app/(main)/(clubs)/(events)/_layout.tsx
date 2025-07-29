import { StackHeader } from '@/src/components/StackHeader';
import { ClubContext } from '@/src/context/ClubContext';
import { useTheme } from '@/src/hooks/use-theme';
import { Stack } from 'expo-router';
import React, { useContext } from "react";

export default function EventsLayout() {
  const { clubInfo } = useContext(ClubContext)
  const { colors } = useTheme();

  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.text }}>
      <Stack.Screen name="index" options={{ headerTitle: () => <StackHeader header={"Events"} rightText={clubInfo?.clubName} />, headerShown: true }} />
      <Stack.Screen name="addevent" options={{ headerTitle: () => <StackHeader header={"Add Event"} rightText={clubInfo?.clubName} />, headerShown: true }} />
      <Stack.Screen name="editevent" options={{ headerTitle: () => <StackHeader header={"Edit Event"} rightText={clubInfo?.clubName} />, headerShown: true }} />
      <Stack.Screen name="eventdetails" options={{ headerTitle: () => <StackHeader header={"Event Details"} rightText={clubInfo?.clubName} />, headerShown: true }} />
      <Stack.Screen name="attendance" options={{ headerTitle: () => <StackHeader header={"Attendance Report"} rightText={clubInfo?.clubName} />, headerShown: true }} />
      {/* <Stack.Screen name="Report"options={{ headerTitle: () => <StackHeader header={"Report"} rightText={clubInfo?.clubName} />, headerShown: true }} /> */}
    </Stack>
  )
}
