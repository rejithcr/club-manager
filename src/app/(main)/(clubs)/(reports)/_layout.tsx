import { useTheme } from '@/src/hooks/use-theme';
import { Stack } from 'expo-router';
import React from "react";

export default function ReportsLayout() {
  const { colors } = useTheme();
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: colors.background}, headerTintColor: colors.text }}>
      <Stack.Screen name="index" options={{title: 'Reports', headerShown:true}}/>      
      <Stack.Screen name="memberattributes" options={{title: 'Member Attributes Report', headerShown:true}}/>      
    </Stack>
  )
}
