import React, { useContext, useEffect, useState } from "react";
import ThemedButton from "@/src/components/ThemedButton";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, View } from "react-native";
import { appStyles } from "@/src/utils/styles";
import { UserContext } from "../../context/UserContext";
import ThemedView from "@/src/components/themed-components/ThemedView";
import { authenticate } from "@/src/helpers/auth_helper";
import * as AuthSession from "expo-auth-session";
import LoadingSpinner from "@/src/components/LoadingSpinner";

WebBrowser.maybeCompleteAuthSession();

const AuthHome = () => {
  const { setUserInfo } = useContext(UserContext);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const redirectUri = AuthSession.makeRedirectUri({
    path: "/",
  });

  const [_, response, promptAsync] = Google.useAuthRequest({
    scopes: ["profile", "email"],
    //scopes: ['https://www.googleapis.com/auth/user.phonenumbers.read'],
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    iosClientId: "",
    webClientId:
      "586660286227-4p4t4g48ank7v2uud44t5dqsfqfra541.apps.googleusercontent.com",
    redirectUri: redirectUri,
  });

  useEffect(() => {
    if (response?.type === "success") {
      authenticate(response, setLoading, setUserInfo);
    } else {
      login();
    }
  }, [response]);

  const login = async () => {
    const userInfoFromAsyncStorage = await AsyncStorage.getItem("userInfo");
    const accessToken = await AsyncStorage.getItem("accessToken");
    const userInfoFromAsyncStorageParsed = userInfoFromAsyncStorage
      ? JSON.parse(userInfoFromAsyncStorage)
      : null;
    if (accessToken) {
      setUserInfo(userInfoFromAsyncStorageParsed);
      router.replace("/(main)");
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={appStyles.centerify}>
        <Image
          source={require("../../assets/images/app-icon.png")}
          style={{ height: 300, width: 300, marginBottom: 50 }}
        />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <ThemedButton
            title="Sign in with Google"
            onPress={() => promptAsync()}
          />
        )}
      </View>
    </ThemedView>
  );
};

export default AuthHome;
