import React, { useContext, useEffect, useState } from 'react'
import ThemedButton from '@/src/components/ThemedButton'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ActivityIndicator, View } from 'react-native'
import { appStyles } from '@/src/utils/styles'
import { AuthContext } from '../../context/AuthContext';

WebBrowser.maybeCompleteAuthSession()

const AuthHome = () => {
  const {setUserInfo} = useContext(AuthContext)

  const [isLoading, setLoading] = useState(true)
  const [_, response, promptAsyc] = Google.useAuthRequest({
    androidClientId: "586660286227-diu8vq5k4tm6c7b9bueeqn8cuimnsl41.apps.googleusercontent.com",
    iosClientId: "",
    webClientId: "586660286227-ss63b55mb5l82s7q6skocr4f8tc3v1ql.apps.googleusercontent.com",
  })
  const router = useRouter()

  useEffect(() => {
    validateLogin()
  }, [response])

  const validateLogin = async () => {
    const userInfo = await AsyncStorage.getItem("userInfo");
    if (userInfo) {
      setUserInfo(JSON.parse(userInfo))
      router.replace('/(main)')
    } else {
      gettUserInfo()
    }
  }
  const gettUserInfo = async () => {
    const url = "https://www.googleapis.com/oauth2/v1/userinfo?access_token=";
    try {
      if (response?.type == "success") {
        const userInfoResponse = await fetch(url + response?.authentication?.accessToken);
        const userInfoJson = await userInfoResponse.json();
        console.log(userInfoJson)
        const userInfo = {
          email: userInfoJson?.email, 
          name: userInfoJson?.name,
          photo: userInfoJson?.picture,
          phone: undefined 
        }
        await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo))
        setUserInfo(userInfo)        
        router.replace('/(main)')
      } else {
        throw "Authentication error. Try again. " + JSON.stringify(response)
      }
    } catch (error) {
      throw "Authentication error. Try again. " + JSON.stringify(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={appStyles.centerify}>
      {isLoading ? <ActivityIndicator size="large" color={"black"} /> : <ThemedButton title="Sign in with Google" opnPress={() => promptAsyc()} />}
    </View>
  )
}

export default AuthHome