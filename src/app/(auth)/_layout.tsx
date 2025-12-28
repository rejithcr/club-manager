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
        <Stack.Screen name='contact-us' options={{ title: "Contact Us" }} />
        <Stack.Screen name='terms-and-conditions' options={{ title: "Terms and Conditions" }} />
        <Stack.Screen name='privacy-policy' options={{ title: "Privacy Policy" }} />
        <Stack.Screen name='refund-policy' options={{ title: "Refund Policy" }} />
      </Stack>
      <StatusBar style={colors.statusbar == "light" ? "light" : "dark"} />
    </>
  )
}

export default AuthStack