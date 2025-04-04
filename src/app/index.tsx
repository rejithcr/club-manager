import { Redirect } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Index() {
    const { userInfo } = useContext(AuthContext)
    
    return userInfo == undefined ? <Redirect href={"./(auth)"} /> : <Redirect href={"./(main)"} />
}