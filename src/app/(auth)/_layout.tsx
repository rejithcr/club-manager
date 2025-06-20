import React from 'react'
import { Stack } from 'expo-router'
import { useTheme } from '@/src/hooks/use-theme';
import { StatusBar } from 'expo-status-bar';

const AuthStack = () => {
  const { colors } = useTheme();
  return (
    <>
      <Stack screenOptions={{ headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.text }}>
        <Stack.Screen name='index' options={{ title: "Login", headerShown: false }} />
        <Stack.Screen name='verify' options={{ title: "Verify" }} />
      </Stack>
      <StatusBar style={colors.statusbar == "light" ? "light" : "dark"} />
    </>
  )
}

export default AuthStack