import { StackHeader } from '@/src/components/StackHeader';
import { ClubContext } from '@/src/context/ClubContext';
import { Stack } from 'expo-router';
import React, { useContext } from "react";

export default function RootLayout() {
  const { clubInfo } = useContext(ClubContext)
  return (
    <Stack>
      <Stack.Screen
        name="index" // This is the name of the page and must match the url from root
        options={{
          headerTitle: () => <StackHeader header={"Members"} clubName={clubInfo.clubName} />,
          headerShown: true
        }}
      />
      <Stack.Screen
        name="memberdetails" // This is the name of the page and must match the url from root
        options={{
          headerTitle: () => <StackHeader header={"Profile"} clubName={clubInfo.clubName} />,
          headerShown: true
        }}
      />
      <Stack.Screen
        name="addmember" // This is the name of the page and must match the url from root
        options={{
          headerTitle: () => <StackHeader header={"Add Member"} clubName={clubInfo.clubName} />,
          headerShown: true
        }}
      />
      <Stack.Screen
        name="memberattributes" // This is the name of the page and must match the url from root
        options={{
          headerTitle: () => <StackHeader header={"Member Attributes"} clubName={clubInfo.clubName} />,
          headerShown: true
        }}
      />
    </Stack>
  )
}
