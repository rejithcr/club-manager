import { Stack } from "expo-router";
import React, { useState } from "react";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";

export default function RootLayout() {
  const [userInfo, setUserInfo] = useState<any | undefined>(undefined)
  const [theme, setTheme] = useState<any | undefined>(undefined)
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <UserContext.Provider value={{ userInfo, setUserInfo }}>
          <Stack screenOptions={{ headerShown: false }} >
            <Stack.Screen name="index" options={{ title: "Init", headerShown: false }} />
          </Stack>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}
