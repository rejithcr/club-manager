import { StackHeader } from '@/src/components/StackHeader';
import { ClubContext } from '@/src/context/ClubContext';
import { useTheme } from '@/src/hooks/use-theme';
import { Stack } from 'expo-router';
import React, { useContext } from "react";

export default function ReportsLayout() {
  const { clubInfo } = useContext(ClubContext)
  const { colors } = useTheme();

  return (
    <Stack screenOptions={{
      headerShadowVisible: false, headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.text
    }}>
      <Stack.Screen name="index" options={{ headerTitle: () => <StackHeader header={"Reports"} rightText={clubInfo?.clubName} logo={clubInfo?.logo} />, headerShown: true }} />
      <Stack.Screen
        name="memberattributesexport" // This is the name of the page and must match the url from root
        options={{
          headerTitle: () => <StackHeader header={"Member Attributes Export"} rightText={clubInfo?.clubName} logo={clubInfo?.logo} />,
          headerShown: true
        }}
      />
    </Stack>
  )
}
