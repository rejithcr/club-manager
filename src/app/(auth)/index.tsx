import React, { useContext, useEffect, useState } from 'react'
import ThemedButton from '@/src/components/ThemedButton'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Image, View } from 'react-native'
import { appStyles } from '@/src/utils/styles'
import { UserContext } from '../../context/UserContext';
import ThemedView from '@/src/components/themed-components/ThemedView'
import Alert, { AlertProps } from '@/src/components/Alert'
import { authenticateMember } from '@/src/helpers/auth_helper'
import * as AuthSession from 'expo-auth-session';
import LoadingSpinner from '@/src/components/LoadingSpinner'

WebBrowser.maybeCompleteAuthSession();

const AuthHome = () => {
  const { setUserInfo } = useContext(UserContext)
  const [alertConfig, setAlertConfig] = useState<AlertProps>();
  const [isLoading, setLoading] = useState(false)

  const redirectUri = AuthSession.makeRedirectUri({
    path: '/',
  });

  const [_, response, promptAsyc] = Google.useAuthRequest({
    scopes: ['profile', 'email'],
    //scopes: ['https://www.googleapis.com/auth/user.phonenumbers.read'],
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    iosClientId: "",
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    redirectUri: redirectUri
  })
  const router = useRouter()

  useEffect(() => {
    if (response?.type === 'success') {
      authenticate()
    } else {
      login()
    }
  }, [response])

  const login = async () => {
    const userInfoFromAsyncStorage = await AsyncStorage.getItem("userInfo");
    const accessToken = await AsyncStorage.getItem("accessToken");
    const userInfoFromAsyncStorageParsed = userInfoFromAsyncStorage ? JSON.parse(userInfoFromAsyncStorage) : null;
    if (accessToken) {
      setUserInfo(userInfoFromAsyncStorageParsed)
      router.replace('/(main)')
    } 
  }

  const authenticate = async () => {
      setLoading(true)
      const gInfo = await getGoogleProfile();
      authenticateMember(gInfo.email, gInfo.gtoken)
        .then(authResponse => {
          if (authResponse.data?.isRegistered === 1) {
            setUserInfo({ ...gInfo, ...authResponse.data })
            router.replace('/(main)')
          } else if (authResponse.data?.isRegistered === 0) {
            const memberInfo = { ...authResponse.data, photo: gInfo.photo }
            router.replace(`/(auth)/verify?memberInfo=${JSON.stringify(memberInfo)}`)
          } else {
            setUserInfo(gInfo)
            router.replace(`/(main)/(members)/addmember?createMember=true&name=${gInfo.name}&email=${gInfo.email}`)
          }
          delete gInfo.gtoken; // Remove gtoken from user info before saving
          AsyncStorage.setItem("userInfo", JSON.stringify({
            ...gInfo,
            memberId: authResponse.data['memberId'],
            isSuperUser: authResponse.data['isSuperUser']
          }))
          AsyncStorage.setItem("accessToken", authResponse.data['accessToken'])
          AsyncStorage.setItem("refreshToken", authResponse.data['refreshToken'])
        })
        .catch(error => {
          setAlertConfig({
            visible: true,
            title: 'Error',
            message: error.response.data.error,
            buttons: [{ text: 'OK', onPress: () => setAlertConfig({ visible: false }) }]
          })
        })
        .finally(() => setLoading(false))    
  }

  const getGoogleProfile = async () => {
    if (!response || response.type !== 'success') {
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
      phone: undefined
    }
    return gInfo;
  }
  
  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={appStyles.centerify}>
        <Image source={require("../../assets/images/app-icon.png")} style={{ height: 300, width: 300, marginBottom: 50 }} />
        {isLoading ? <LoadingSpinner /> : <ThemedButton title="Sign in with Google" onPress={() => promptAsyc()} />}
      </View>
      {alertConfig?.visible && <Alert {...alertConfig} />}
    </ThemedView>
  )
}

export default AuthHome