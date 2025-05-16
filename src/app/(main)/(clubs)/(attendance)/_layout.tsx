import { useTheme } from '@/src/hooks/use-theme';
import { Stack } from 'expo-router';
import React from "react";

export default function AttendanceLayout() {
  const { theme } = useTheme();
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: theme.primary} }}>
      <Stack.Screen name="index" options={{title: 'Attendance', headerShown:true}}/>      
    </Stack>
  )
}
