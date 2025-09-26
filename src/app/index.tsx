import { Redirect } from "expo-router";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useGlobalSearchParams } from "expo-router";

export default function Index() {
  const { userInfo } = useContext(UserContext);
  const params = useGlobalSearchParams();
  
  return userInfo == undefined ? (
    <Redirect href={{ pathname: "./(auth)", params: { ...params } }} />
  ) : (
    <Redirect href={{ pathname: "./(main)", params: { ...params } }} />
  );
}
