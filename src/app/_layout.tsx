import { Stack } from "expo-router";
import React, { useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { StatusBar } from "expo-status-bar";
import { ClubContext } from "../context/ClubContext";

export default function RootLayout() {
  const [userInfo, setUserInfo] = useState<any | undefined>(undefined)
  const [clubInfo, setClubInfo] = useState<any | undefined>(undefined)
  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo }}>
      <ClubContext.Provider value={{ clubInfo, setClubInfo }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ title: "Init", headerShown: false }} />
        </Stack>
        <StatusBar style="dark" translucent={true} hidden={false} />
      </ClubContext.Provider>
    </AuthContext.Provider>
  );
}
