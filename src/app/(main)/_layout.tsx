import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'


const MainStack = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
        <Stack.Screen name="(members)" options={{ title: "Member", headerShown: false }} />
        <Stack.Screen name="(clubs)" options={{ title: "Club", headerShown: false }} />
      </Stack>
    </SafeAreaView>
  )
}

export default MainStack