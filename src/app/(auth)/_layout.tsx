import React from 'react'
import { Stack } from 'expo-router'
import { useTheme } from '@/src/hooks/use-theme';

const AuthStack = () => {
  const { colors } = useTheme();
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: colors.background}, headerTintColor: colors.text }}>
      <Stack.Screen  name='index' options={{title: "Login", headerShown:false}}/>
      <Stack.Screen  name='verify' options={{title: "Verify"}}/>
    </Stack>
  )
}

export default AuthStack