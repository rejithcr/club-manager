import { useTheme } from '@/src/hooks/use-theme'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ClubContext } from "../../context/ClubContext";
import { useState } from 'react';

const MainStack = () => {
  const { colors } = useTheme()
  const [clubInfo, setClubInfo] = useState<any | undefined>(undefined)
  return (
    <ClubContext.Provider value={{ clubInfo, setClubInfo }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <Stack>
          <Stack.Screen name="index" options={{
            title: "Club Manager", headerShown: true,
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text
          }} />
          <Stack.Screen name="(members)" options={{ title: "Member", headerShown: false }} />
          <Stack.Screen name="(clubs)" options={{ title: "Club", headerShown: false }} />
          <Stack.Screen name="(profile)" options={{ title: "Profile", headerShown: false }} />
        </Stack>
        <StatusBar style={colors.statusbar == "light" ? "light" : "dark"} />
      </SafeAreaView>
    </ClubContext.Provider>
  )
}

export default MainStack