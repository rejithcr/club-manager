import { StackHeader } from '@/src/components/StackHeader';
import { ClubContext } from '@/src/context/ClubContext';
import { Stack } from 'expo-router';
import React, { useContext } from "react";

export default function TransactionLayout() {
  const { clubInfo } = useContext(ClubContext)
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerTitle: () => <StackHeader header={"Transactions"} clubName={clubInfo.clubName} />, headerShown: true }} />
    </Stack>
  )
}
