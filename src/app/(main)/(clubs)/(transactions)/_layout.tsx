import { StackHeader } from '@/src/components/StackHeader';
import { ClubContext } from '@/src/context/ClubContext';
import { useTheme } from '@/src/hooks/use-theme';
import { Stack } from 'expo-router';
import React, { useContext } from "react";

export default function TransactionLayout() {
  const { clubInfo } = useContext(ClubContext)
  const { colors } = useTheme();

  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.text }}>
      <Stack.Screen name="index" options={{ headerTitle: () => <StackHeader header={"Transactions"} rightText={clubInfo?.clubName} logo={clubInfo?.logo} />, headerShown: true }} />
      <Stack.Screen name="categories" options={{ headerTitle: () => <StackHeader header={"Categories"} rightText={clubInfo?.clubName} logo={clubInfo?.logo} />, headerShown: true }} />
    </Stack>
  )
}
