import { Stack } from 'expo-router';
import React from "react";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index" // This is the name of the page and must match the url from root
        options={{
          title: 'Members',
          headerShown: true
        }}
      />
      <Stack.Screen
        name="memberdetails" // This is the name of the page and must match the url from root
        options={{
          title: 'Profile',
          headerShown: true
        }}
      />
      <Stack.Screen
        name="addmember" // This is the name of the page and must match the url from root
        options={{
          title: 'Add Member',
          headerShown: true
        }}
      />
      <Stack.Screen
        name="memberattributes" // This is the name of the page and must match the url from root
        options={{
          title: 'Member Attributes',
          headerShown: true
        }}
      />
    </Stack>
  )
}
