import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { useTheme } from '@/src/hooks/use-theme';

const AuthStack = () => {
  const { theme } = useTheme();
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: theme.primary} }}>
      <Stack.Screen  name='index' options={{title: "Login", headerShown:false}}/>
      <Stack.Screen  name='register' options={{title: "Register"}}/>
    </Stack>
  )
}

export default AuthStack