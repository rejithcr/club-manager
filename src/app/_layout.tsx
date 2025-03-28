import { Redirect, router, Stack } from "expo-router";
import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const [isLoggedIn, setLogin] = useState(true)
  return (
    <GestureHandlerRootView>
      <Stack screenOptions={{ headerShown: false }} />
      {isLoggedIn ? <Redirect href={"./(main)"} /> : <Redirect href={"./(auth)"} />}
    </GestureHandlerRootView>
  );
}
