import { post } from "../utils/http/api";
import { router } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

export const authenticateMember = (
  email: string,
  gToken: string | undefined
) => {
  return post("/auth", null, { email: email, gToken: gToken });
};

export const authenticate = async (
  response: any | undefined,
  setLoading: (isLoading: boolean) => void,
  setUserInfo: (gInfo: {}) => void
) => {
  setLoading(true);
  const gInfo = await getGoogleProfile(response);
  authenticateMember(gInfo.email, gInfo.gtoken)
    .then((authResponse) => {
      if (authResponse.data?.isRegistered === 1) {
        setUserInfo({ ...gInfo, ...authResponse.data });
        router.replace("/(main)");
      } else if (authResponse.data?.isRegistered === 0) {
        const memberInfo = { ...authResponse.data, photo: gInfo.photo };
        router.replace(
          `/(auth)/verify?memberInfo=${JSON.stringify(memberInfo)}`
        );
      } else {
        setUserInfo(gInfo);
        router.replace(
          `/(main)/(members)/addmember?createMember=true&name=${gInfo.name}&email=${gInfo.email}`
        );
      }
      delete gInfo.gtoken; // Remove gtoken from user info before saving
      AsyncStorage.setItem(
        "userInfo",
        JSON.stringify({
          ...gInfo,
          memberId: authResponse.data["memberId"],
          isSuperUser: authResponse.data["isSuperUser"],
        })
      );
      AsyncStorage.setItem("accessToken", authResponse.data["accessToken"]);
      AsyncStorage.setItem("refreshToken", authResponse.data["refreshToken"]);
    })
    .catch((error) => {
      alert(error.response.data.error);
    })
    .finally(() => setLoading(false));
};

export const getGoogleProfile = async (response: any | undefined) => {
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
