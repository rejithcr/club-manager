import { useTheme } from '@/src/hooks/use-theme'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'


const MainStack = () => {
  const { colors } = useTheme()
  return (
    <SafeAreaView style={{ flex: 1 , backgroundColor: colors.background}}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Club Manager", headerShown: true, headerStyle: { backgroundColor: colors.primary}, headerTintColor: colors.text }} />
        <Stack.Screen name="(members)" options={{ title: "Member", headerShown: false }} />
        <Stack.Screen name="(clubs)" options={{ title: "Club", headerShown: false }} />
        <Stack.Screen name="(profile)" options={{ title: "Profile", headerShown: false }} />
      </Stack>
      <StatusBar style={colors.statusbar == "light" ? "light" : "dark"}/>
    </SafeAreaView>
  )
}

export default MainStack