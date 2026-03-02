import { Platform } from "react-native";

const getOSFromBrowser = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (/android/i.test(userAgent)) {
    return "android";
  }
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "ios";
  }
  return "other";
};

export const getMobileOS = () => {
  let deviceOS = Platform.OS.toString(); // "ios" | "android" | "web"

  if (deviceOS === "web") {
    deviceOS = getOSFromBrowser(); // use userAgent detection above
  }
  return deviceOS;
};
