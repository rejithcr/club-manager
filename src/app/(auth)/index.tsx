import React, { useContext, useEffect, useState } from "react";
import ThemedButton from "@/src/components/ThemedButton";
import { useGlobalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, View, TouchableOpacity, StyleSheet } from "react-native";
import { appStyles } from "@/src/utils/styles";
import { UserContext } from "../../context/UserContext";
import ThemedView from "@/src/components/themed-components/ThemedView";
import ThemedText from "@/src/components/themed-components/ThemedText";
import * as AuthSession from "expo-auth-session";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { getAccessToken, saveTokens } from "@/src/helpers/auth_helper";
import { useAuthenticateMemberMutation } from "@/src/services/authApi";
import { showSnackbar } from "@/src/components/snackbar/snackbarService";
import Spacer from "@/src/components/Spacer";
import BasicLogin from "@/src/components/BasicLogin";

WebBrowser.maybeCompleteAuthSession();

const AuthHome = () => {
  const { setUserInfo } = useContext(UserContext);
  const searchParams = useGlobalSearchParams();
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
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    redirectUri: redirectUri,
  });

  useEffect(() => {
    if (response?.type === "success") {
      authenticate();
    } else {
      login();
    }
  }, [response]);

  const login = async () => {
    const userInfoFromAsyncStorage = await AsyncStorage.getItem("userInfo");
    const accessToken = await getAccessToken();
    const userInfoFromAsyncStorageParsed = userInfoFromAsyncStorage ? JSON.parse(userInfoFromAsyncStorage) : null;
    if (accessToken) {
      setUserInfo(userInfoFromAsyncStorageParsed);
      router.replace({
        pathname: "/(main)",
        params: { ...searchParams },
      });
    }
  };
  const [authenticateMember] = useAuthenticateMemberMutation();

  const authenticate = async () => {
    setLoading(true);
    try {
      const gInfo = await getGoogleProfile(response);
      const authResponse = await authenticateMember({ email: gInfo.email, gToken: gInfo.gtoken }).unwrap();
      if (authResponse?.isRegistered === 1) {
        setUserInfo({ ...gInfo, ...authResponse });
        router.replace({
          pathname: "/(main)",
          params: { ...searchParams },
        });
      } else if (authResponse?.isRegistered === 0) {
        const memberInfo = { ...authResponse, photo: gInfo.photo };
        router.replace(`/(auth)/verify?memberInfo=${JSON.stringify(memberInfo)}`);
      } else {
        setUserInfo(gInfo);
        router.replace(`/(main)/(members)/addmember?createMember=true&name=${gInfo.name}&email=${gInfo.email}`);
      }
      delete gInfo.gtoken; // Remove gtoken from user info before saving
      AsyncStorage.setItem(
        "userInfo",
        JSON.stringify({
          ...gInfo,
          memberId: authResponse["memberId"],
          isSuperUser: authResponse["isSuperUser"],
        })
      );
      saveTokens(authResponse["accessToken"], authResponse["refreshToken"]);
    } catch (error: any) {
      console.log("Authentication error.", error);
      const message = `${error.data?.message || error.message}.`;
      showSnackbar(`Authentication error! ${message} Please try again. `, "error");
    } finally {
      setLoading(false);
    }
  };

  const getGoogleProfile = async (response: any | undefined) => {
    if (!response || response.type !== "success") {
      throw new Error("Authentication error. Try again.");
    }
    const accessToken = response?.authentication?.accessToken;
    const url = "https://www.googleapis.com/oauth2/v1/userinfo?access_token=";
    const gResponse = await fetch(url + accessToken);
    const gInfoJson = await gResponse.json();
    const gInfo = {
      email: gInfoJson?.email,
      name: gInfoJson?.name,
      photo: gInfoJson?.picture,
      gtoken: accessToken,
      phone: undefined,
    };
    return gInfo;
  };
  
  // created for payment gateway integration - can be removed later */
  const handleBasicLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const authResponse = await authenticateMember({ email, password }).unwrap();
      if (authResponse?.isRegistered === 1) {
        setUserInfo({ email, ...authResponse });
        AsyncStorage.setItem(
          "userInfo",
          JSON.stringify({
            email,
            memberId: authResponse["memberId"],
            isSuperUser: authResponse["isSuperUser"],
          })
        );
        saveTokens(authResponse["accessToken"], authResponse["refreshToken"]);
        router.replace({
          pathname: "/(main)",
          params: { ...searchParams },
        });
      } else if (authResponse?.isRegistered === 0) {
        const memberInfo = { ...authResponse, email };
        router.replace(`/(auth)/verify?memberInfo=${JSON.stringify(memberInfo)}`);
      } else {
        router.replace(`/(main)/(members)/addmember?createMember=true&email=${email}`);
      }
    } catch (error: any) {
      console.log("Authentication error.", error);
      const message = `${error.data?.message || error.message}.`;
      showSnackbar(`Login failed! ${message} Please try again.`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={appStyles.centerify}>
        <Image source={require("../../assets/images/app-icon.png")} style={{ height: 150, width: 150 }} />
        <Spacer space={20} />
        <BasicLogin onLogin={handleBasicLogin} isLoading={isLoading} />
        <Spacer space={10} />
        <ThemedText style={styles.dividerText}>or</ThemedText>
        <Spacer space={10} />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <ThemedButton icon="AntDesign:google" title="Sign in with Google" onPress={() => promptAsync()} />
        )}
        {/* {isLoading ? <LoadingSpinner /> : <ThemedButton title="Sign in with Google" onPress={() => bypasslogin()} />} */}
      </View>

      {/* Footer Links */}
      <View style={styles.footerLinks}>
        <TouchableOpacity onPress={() => router.push("/(auth)/contact-us")}>
          <ThemedText style={styles.linkText}>Contact Us</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.separator}>•</ThemedText>
        <TouchableOpacity onPress={() => router.push("/(auth)/terms-and-conditions")}>
          <ThemedText style={styles.linkText}>Terms & Conditions</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.separator}>•</ThemedText>
        <TouchableOpacity onPress={() => router.push("/(auth)/privacy-policy")}>
          <ThemedText style={styles.linkText}>Privacy</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.separator}>•</ThemedText>
        <TouchableOpacity onPress={() => router.push("/(auth)/refund-policy")}>
          <ThemedText style={styles.linkText}>Refund Policy</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  footerLinks: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 20,
    gap: 6,
  },
  linkText: {
    fontSize: 11,
    opacity: 0.7,
    textDecorationLine: "underline",
  },
  separator: {
    fontSize: 11,
    opacity: 0.5,
  },
  dividerText: {
    fontSize: 14,
    opacity: 0.6,
    fontWeight: "500",
  },
});

export default AuthHome;
