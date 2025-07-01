import { Redirect } from "expo-router";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function Index() {
    const { userInfo } = useContext(UserContext)
    
    return userInfo == undefined ? <Redirect href={"./(auth)"} /> : <Redirect href={"./(main)"} />
}