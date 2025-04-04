import { Stack } from "expo-router";
import React, { useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function RootLayout() {
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined)
  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: "Init", headerShown: false }} />
      </Stack>
    </AuthContext.Provider>
  );
}
