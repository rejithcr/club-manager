import { Stack } from 'expo-router'


const MainStack = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
      <Stack.Screen name="(members)" options={{ title: "Member", headerShown: false }} />
      <Stack.Screen name="(clubs)" options={{ title: "Club", headerShown: false }} />
    </Stack>
  )
}

export default MainStack