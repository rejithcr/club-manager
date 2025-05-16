import { useTheme } from '@/src/hooks/use-theme'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'


const MainStack = () => {
  const { theme } = useTheme()
  return (
    <SafeAreaView style={{ flex: 1 , backgroundColor: theme.background}}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
        <Stack.Screen name="(members)" options={{ title: "Member", headerShown: false }} />
        <Stack.Screen name="(clubs)" options={{ title: "Club", headerShown: false }} />
        <Stack.Screen name="(profile)" options={{ title: "Club", headerShown: false }} />
      </Stack>
      <StatusBar style={theme.name == "system" ? "light" : "dark"}/>
    </SafeAreaView>
  )
}

export default MainStack