import { useTheme } from '@/src/hooks/use-theme';
import { Stack } from 'expo-router';
import React from "react";

export default function AttendanceLayout() {
  const { colors } = useTheme();
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: colors.primary}, headerTintColor: colors.text }}>
      <Stack.Screen name="index" options={{title: 'Attendance', headerShown:true}}/>      
    </Stack>
  )
}
