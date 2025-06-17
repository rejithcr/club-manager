import { StackHeader } from '@/src/components/StackHeader';
import { ClubContext } from '@/src/context/ClubContext';
import { useTheme } from '@/src/hooks/use-theme';
import { Stack } from 'expo-router';
import React, { useContext } from "react";

export default function ClubLayout() {
  const { clubInfo } = useContext(ClubContext)
  const { colors } = useTheme();
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: colors.background },
     // headerTitleContainerStyle: { padding: 0 },
      headerTintColor: colors.text
    }}>
      <Stack.Screen
        name="index" // This is the name of the page and must match the url from root
        options={{
          headerTitle: () => <StackHeader header={"Club Home"} rightText={clubInfo?.clubName} />,
          headerShown: true
        }}
      />
      <Stack.Screen
        name="createclub" // This is the name of the page and must match the url from root
        options={{
          title: 'Create new club',
          headerShown: true
        }}
      />
      <Stack.Screen
        name="(fees)" // This is the name of the page and must match the url from root
        options={{
          title: 'Fees',
          headerShown: false
        }}
      />
      <Stack.Screen
        name="(attendance)" // This is the name of the page and must match the url from root
        options={{
          title: 'Attendance',
          headerShown: false
        }}
      />
      <Stack.Screen
        name="(transactions)" // This is the name of the page and must match the url from root
        options={{
          title: 'Transactions',
          headerShown: false
        }}
      />
      <Stack.Screen
        name="membershiprequests" // This is the name of the page and must match the url from root
        options={{
          headerTitle: () => <StackHeader header={"Membership"} rightText={clubInfo?.clubName} />,
          headerShown: true
        }}
      />
      <Stack.Screen
        name="(reports)" // This is the name of the page and must match the url from root
        options={{
          title: 'Reports',
          headerShown: false
        }}
      />
    </Stack>
  )
}
