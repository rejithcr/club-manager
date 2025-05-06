import React, { useContext, useEffect, useState } from 'react'
import ThemedButton from '@/src/components/ThemedButton'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ActivityIndicator, Alert, View } from 'react-native'
import { appStyles } from '@/src/utils/styles'
import { AuthContext } from '../../context/AuthContext';
import { ANDROID_CLIENT_ID, WEB_CLIENT_ID } from '@/src/utils/keys'
import { getMemberByEmail } from '@/src/helpers/member_helper'


WebBrowser.maybeCompleteAuthSession()

const AuthHome = () => {
  const { setUserInfo } = useContext(AuthContext)

  const [isLoading, setLoading] = useState(false)
  const [_, response, promptAsyc] = Google.useAuthRequest({
    //scopes: ['https://www.googleapis.com/auth/user.phonenumbers.read'],
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: "",
    webClientId: WEB_CLIENT_ID,
  })
  const router = useRouter()

  useEffect(() => {
    validateLogin()
  }, [response])

  const validateLogin = async () => {
    //const userInfoFromCache = await AsyncStorage.getItem("userInfo");
    const userInfoFromCache = "{\"email\": \"rejithramakrishnan@gmail.com\",\"name\": \"Rejith\"}"
    console.log(userInfoFromCache)
    if (userInfoFromCache) {
      setUserInfo(JSON.parse(userInfoFromCache))
      registerMember(JSON.parse(userInfoFromCache))
    } else {
      console.log("going to google auth")
      gettUserInfo()
    }
  }

  const registerMember = (userInfoFromCache: any) => {
    setLoading(true)
    getMemberByEmail(userInfoFromCache.email)
      .then(response => {
        console.log(response.data)
        if (response.data?.memberId) {
          console.log(response.data)
          setUserInfo({...userInfoFromCache,...response.data})
          router.replace('/(main)')
        } else {
          setUserInfo(userInfoFromCache)
          router.replace(`/(main)/(members)/addmember?createMember=true&name=${userInfoFromCache.name}&email=${userInfoFromCache.email}`)
        }
      })
      .catch(error => Alert.alert("Error", error.response.data.error))
      .finally(() => setLoading(false))
  }

  const gettUserInfo = async () => {
    setLoading(true)
    const url = "https://www.googleapis.com/oauth2/v1/userinfo?access_token=";
    try {
      if (response?.type == "success") {
        const userInfoResponse = await fetch(url + response?.authentication?.accessToken);
        const userInfoJson = await userInfoResponse.json();
        const userInfo = {
          email: userInfoJson?.email,
          name: userInfoJson?.name,
          photo: userInfoJson?.picture,
          phone: undefined
        }
        await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo))
        registerMember(userInfo)
      } else if (response) {
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
      {isLoading ? <ActivityIndicator size="large" color={"black"} /> : <ThemedButton title="Sign in with Google" onPress={() => promptAsyc()} />}
    </View>
  )
}

export default AuthHome