import { useTheme } from '@/src/hooks/use-theme'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { ClubContext } from "../../context/ClubContext";
import { useContext } from 'react';
import { StackHeader } from '@/src/components/StackHeader';

const MainStack = () => {
  const { colors } = useTheme()
  const { clubInfo } = useContext(ClubContext)
  return (
    <>
      <Stack screenOptions={{ headerShadowVisible: false }}>
        <Stack.Screen name="index" options={{
          headerTitle: () => <StackHeader header={"Club Manager"} />,
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }} />
        <Stack.Screen name="(members)" options={{ title: "Member", headerShown: false }} />
        <Stack.Screen name="(clubs)" options={{ title: "Club", headerShown: false }} />
        <Stack.Screen name="(profile)" options={{ title: "Profile", headerShown: false }} />
        <Stack.Screen
          name="createclub"
          options={{
            title: 'Create Club',
            headerShown: true, headerTintColor: colors.text,
            headerStyle: { backgroundColor: colors.background },
          }}
        />
        <Stack.Screen
          name="notifications"
          options={{
            headerTitle: () => <StackHeader header={"Notifications"} hideNotificationIcon={true} />,
            headerShown: true,
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
          }}
        />
      </Stack>
      <StatusBar style={colors.statusbar == "light" ? "light" : "dark"} />
    </>
  )
}

export default MainStack
