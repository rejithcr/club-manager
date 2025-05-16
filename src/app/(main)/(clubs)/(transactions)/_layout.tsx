import { StackHeader } from '@/src/components/StackHeader';
import { ClubContext } from '@/src/context/ClubContext';
import { useTheme } from '@/src/hooks/use-theme';
import { Stack } from 'expo-router';
import React, { useContext } from "react";

export default function TransactionLayout() {
  const { clubInfo } = useContext(ClubContext)
  const { theme } = useTheme();

  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: theme.primary } }}>
      <Stack.Screen name="index" options={{ headerTitle: () => <StackHeader header={"Transactions"} clubName={clubInfo?.clubName} />, headerShown: true }} />
    </Stack>
  )
}
