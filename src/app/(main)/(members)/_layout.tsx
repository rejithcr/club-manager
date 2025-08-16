import { StackHeader } from '@/src/components/StackHeader';
import { ClubContext } from '@/src/context/ClubContext';
import { useTheme } from '@/src/hooks/use-theme';
import { Stack } from 'expo-router';
import React, { useContext } from "react";

export default function RootLayout() {
  const { clubInfo } = useContext(ClubContext)
  const { colors } = useTheme();
  return (
        <Stack screenOptions={{ headerStyle: { backgroundColor: colors.background}, headerTintColor: colors.text }}>
        <Stack.Screen
          name="addmember" // This is the name of the page and must match the url from root
          options={{
            headerTitle: () => <StackHeader header={"Add Member"} rightText={clubInfo?.clubName} />,
            headerShown: true
          }}
        />   
        <Stack.Screen
          name="joinclub" // This is the name of the page and must match the url from root
          options={{
            headerTitle: () => <StackHeader header={"Join Club"} rightText={clubInfo?.clubName} />,
            headerShown:true
          }}
        />         
        <Stack.Screen
          name="editmember" // This is the name of the page and must match the url from root
          options={{
            headerTitle: () => <StackHeader header={"Edit Member"} rightText={clubInfo?.clubName} />,
            headerShown:true
          }}
        />       
      </Stack>
  )
}
