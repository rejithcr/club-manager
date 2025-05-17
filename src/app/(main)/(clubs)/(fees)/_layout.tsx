import { StackHeader } from '@/src/components/StackHeader';
import { ClubContext } from '@/src/context/ClubContext';
import { useTheme } from '@/src/hooks/use-theme';
import { Stack } from 'expo-router';
import React, { useContext } from "react";
import {Text, View} from 'react-native'

export default function FeesLayout() {
  const { clubInfo } = useContext(ClubContext)
  const { colors } = useTheme();

  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: colors.primary}, headerTintColor: colors.text }}>
        <Stack.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            headerTitle: () => <StackHeader header={"Fees"} rightText={clubInfo?.clubName} />,
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="clubdues" // This is the name of the page and must match the url from root
          options={{
            headerTitle: () => <StackHeader header={"Club Dues"} rightText={clubInfo?.clubName} />,
            headerShown: true
          }}
        />
        <Stack.Screen
          name="payments" // This is the name of the page and must match the url from root
          options={{
            headerTitle: () => <StackHeader header={"Fee Payment"} rightText={clubInfo?.clubName} />,
            headerShown: true
          }}
        />
        <Stack.Screen
          name="startcollection" // This is the name of the page and must match the url from root
          options={{
            headerTitle: () => <StackHeader header={"Start Collection"} rightText={clubInfo?.clubName} />,
            headerShown: true
          }}
        />
        <Stack.Screen
          name="definefee" // This is the name of the page and must match the url from root
          options={{
            headerTitle: () => <StackHeader header={"Define Fee"} rightText={clubInfo?.clubName} />,
            headerShown: true
          }}
        />
        <Stack.Screen
          name="feetypedetails" // This is the name of the page and must match the url from root
          options={{
            headerTitle: () => <StackHeader header={"Fee Type"} rightText={clubInfo?.clubName} />,
            headerShown: true
          }}
        />
        <Stack.Screen
          name="exception/addfeeexception" // This is the name of the page and must match the url from root
          options={{
            headerTitle: () => <StackHeader header={"Add Fee Exception"} rightText={clubInfo?.clubName} />,
            headerShown: true
          }}
        />
        <Stack.Screen
          name="exception/editfeeexception" // This is the name of the page and must match the url from root
          options={{
            headerTitle: () => <StackHeader header={"Edit Fee Exception"} rightText={clubInfo?.clubName} />,
            headerShown: true
          }}
        />
        <Stack.Screen
          name="editfeetype" // This is the name of the page and must match the url from root
          options={{
            headerTitle: () => <StackHeader header={"Edit Fee type"} rightText={clubInfo?.clubName} />,
            headerShown: true
          }}
        />
        <Stack.Screen
          name="adhocfee/definefee" // This is the name of the page and must match the url from root
          options={{
            headerTitle: () => <StackHeader header={"Split Expense"} rightText={clubInfo?.clubName} />,
            headerShown: true
          }}
        />
        <Stack.Screen
          name="adhocfee/payments" // This is the name of the page and must match the url from root
          options={{
            headerTitle: () => <StackHeader header={"Split Payments"} rightText={clubInfo?.clubName} />,
            headerShown: true
          }}
        />
      </Stack>
  )
}
