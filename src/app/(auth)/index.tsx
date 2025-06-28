import React, { useContext, useEffect, useState } from 'react'
import ThemedButton from '@/src/components/ThemedButton'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ActivityIndicator, Image, View } from 'react-native'
import { appStyles } from '@/src/utils/styles'
import { AuthContext } from '../../context/AuthContext';
import ThemedView from '@/src/components/themed-components/ThemedView'
import Alert, { AlertProps } from '@/src/components/Alert'
import { authenticateMember } from '@/src/helpers/auth_helper'


WebBrowser.maybeCompleteAuthSession()

const AuthHome = () => {
  const { setUserInfo } = useContext(AuthContext)
  const [alertConfig, setAlertConfig] = useState<AlertProps>();
  const [isLoading, setLoading] = useState(false)

  const [_, response, promptAsyc] = Google.useAuthRequest({
    //scopes: ['https://www.googleapis.com/auth/user.phonenumbers.read'],
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    iosClientId: "",
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
  })
  const router = useRouter()

  useEffect(() => {
    authenticate()
  }, [response])

  const authenticate = async () => {
    const userInfoFromAsyncStorage = await AsyncStorage.getItem("authInfo");
    const userInfoFromAsyncStorageParsed = userInfoFromAsyncStorage ? JSON.parse(userInfoFromAsyncStorage) : null;
    if (userInfoFromAsyncStorageParsed?.accessToken && userInfoFromAsyncStorageParsed?.refreshToken) {
      setUserInfo(userInfoFromAsyncStorageParsed)
      router.replace('/(main)')
    } else {
      const gInfo = await getGoogleAuthResponse();
      setLoading(true)
      authenticateMember(gInfo.email, gInfo.gtoken)
        .then(response => {
          if (response.data?.isRegistered === 1) {
            setUserInfo({ ...gInfo, ...response.data })
            router.replace('/(main)')
          } else if (response.data?.isRegistered === 0) {
            const memberInfo = { ...response.data, photo: gInfo.photo }
            router.replace(`/(auth)/verify?memberInfo=${JSON.stringify(memberInfo)}`)
          } else {
            setUserInfo(gInfo)
            router.replace(`/(main)/(members)/addmember?createMember=true&name=${gInfo.name}&email=${gInfo.email}`)
          }
          delete gInfo.gtoken; // Remove gtoken from user info before saving
          AsyncStorage.setItem("authInfo", JSON.stringify({ 
            ...gInfo, 
            memberId: response.data['memberId'],
            accessToken: response.data['accessToken'],
            refreshToken: response.data['refreshToken']
          }))
        })
        .catch(error => setAlertConfig({
          visible: true,
          title: 'Error',
          message: error.response.data.error,
          buttons: [{ text: 'OK', onPress: () => setAlertConfig({ visible: false }) }]
        })).finally(() => setLoading(false))
    }
  }

  const getGoogleAuthResponse = async () => {
    const url = "https://www.googleapis.com/oauth2/v1/userinfo?access_token=";
    if (response?.type == "success") {
      const gResponse = await fetch(url + response?.authentication?.accessToken);
      const gInfoJson = await gResponse.json();
      const gInfo = {
        email: gInfoJson?.email,
        name: gInfoJson?.name,
        photo: gInfoJson?.picture,
        gtoken: response?.authentication?.accessToken,
        phone: undefined
      }
      return gInfo;
    } else {
      throw "Authentication error. Try again. " + JSON.stringify(response)
    }
  }
  /*
   const validateLogin = async () => {
     const userInfoFromCache = await AsyncStorage.getItem("userInfo");
     //const userInfoFromCache = "{\"email\": \"rejithramakrishnan@gmail.com\",\"name\": \"Rejith\"}"
     //const userInfoFromCache = "{\"email\": \"test@babu.com\",\"name\": \"Test\"}"
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
     authenticateMember(userInfoFromCache.email, userInfoFromCache.gtoken)
       .then(response => {
         if (response.data?.isRegistered === 1) {
           console.log("User is registered", response.data)
           setUserInfo({...userInfoFromCache,...response.data})
           router.replace('/(main)')
         } else if (response.data?.isRegistered === 0) {
           const memberInfo = {...response.data, photo: userInfoFromCache.photo}
           router.replace(`/(auth)/verify?memberInfo=${JSON.stringify(memberInfo)}`)
         } else {
           setUserInfo(userInfoFromCache)
           router.replace(`/(main)/(members)/addmember?createMember=true&name=${userInfoFromCache.name}&email=${userInfoFromCache.email}`)
         }
       })
       .catch(error => setAlertConfig({visible: true, title: 'Error', message: error.response.data.error, buttons: [{ text: 'OK', onPress: () => setAlertConfig({visible: false}) }]}))
       .finally(() => setLoading(false))
   }
 
   const gettUserInfo = async () => {
     setLoading(true)
     const url = "https://www.googleapis.com/oauth2/v1/userinfo?access_token=";
     try {
       if (response?.type == "success") {
         console.log("response", response)
         const userInfoResponse = await fetch(url + response?.authentication?.accessToken);
         const userInfoJson = await userInfoResponse.json();
         const userInfo = {
           email: userInfoJson?.email,
           name: userInfoJson?.name,
           photo: userInfoJson?.picture,
           gtoken: response?.authentication?.accessToken,
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
 */
  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={appStyles.centerify}>
        <Image source={require("../../assets/images/app-icon.png")} style={{ height: 300, width: 300, marginBottom: 50 }} />
        {isLoading ? <ActivityIndicator size="large" color={"black"} /> : <ThemedButton title="Sign in with Google" onPress={() => promptAsyc()} />}
      </View>
      {alertConfig?.visible && <Alert {...alertConfig} />}
    </ThemedView>
  )
}

export default AuthHome