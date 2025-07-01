import { Stack } from "expo-router";
import React, { useState } from "react";
import { UserContext } from "../context/UserContext";
import { ClubContext } from "../context/ClubContext";
import { ThemeContext } from "../context/ThemeContext";

export default function RootLayout() {
  const [userInfo, setUserInfo] = useState<any | undefined>(undefined)
  const [clubInfo, setClubInfo] = useState<any | undefined>(undefined)
  const [theme, setTheme] = useState<any | undefined>(undefined)
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <UserContext.Provider value={{ userInfo, setUserInfo }}>
        <ClubContext.Provider value={{ clubInfo, setClubInfo }}>
          <Stack screenOptions={{ headerShown: false }} >
            <Stack.Screen name="index" options={{ title: "Init", headerShown: false }} />
          </Stack>
        </ClubContext.Provider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}
