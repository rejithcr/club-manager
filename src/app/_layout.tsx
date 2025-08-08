import { Stack } from "expo-router";
import React, { useState } from "react";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { SnackbarProvider } from "../components/snackbar/SnackbarProvider";
import ErrorBoundary from "react-native-error-boundary";

export default function RootLayout() {
  const [userInfo, setUserInfo] = useState<any | undefined>(undefined);
  const [theme, setTheme] = useState<any | undefined>(undefined);
  return (
    <Provider store={store}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <SnackbarProvider />
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ title: "Init", headerShown: false }} />
          </Stack>
        </UserContext.Provider>
      </ThemeContext.Provider>
    </Provider>
  );
}
