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
import ThemedText from '@/src/components/themed-components/ThemedText'
import { ScrollView } from 'react-native'

WebBrowser.maybeCompleteAuthSession();

const AuthHome = () => {
  const [log, setLog] = useState('')
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
    clientId: process.env.EXPO_PUBLIC_EXPO_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    redirectUri: redirectUri
  })
  const router = useRouter()

  useEffect(() => {
    localLogin();
    setLog(prev => prev + `\n\nresponse: ${JSON.stringify(response)}`)
    if (response?.type === 'success') {
      setLog(prev => prev + `\n\n gauth success`)
      authenticate()
    } else {
      setLog(prev => prev + `\n\n gauth failed`)
      login();
    }
  }, [response])

  const localLogin = async () => {
    const localUserInfo = {
        "email": "rejithramakrishnan@gmail.com",
        "name": "Rejith Ramakrishnan",
        "photo": "https://lh3.googleusercontent.com/a/ACg8ocIEBPi8qcH6-hff2XfpPAjdzfsGpmm9x0ZfuaZL2UayIdkwG92zLg=s96-c",
        "memberId": 10,
        "isSuperUser": "1"
    };
    const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1MjU4NzE4OCwianRpIjoiOWM0NzI2ZmEtMDcxYS00MDQyLWIxMzgtMzkzYjhiNzNjZjIwIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6InJlaml0aHJhbWFrcmlzaG5hbkBnbWFpbC5jb20iLCJuYmYiOjE3NTI1ODcxODgsImNzcmYiOiJjZTJiZDFjNy0wOTcxLTQ2OTUtOGJjMi0wM2E1ODQ2MzllODkiLCJleHAiOjE3NTI1ODgwODh9.dVRzH0J3fgwU8-VaseNQg748FisbkhXBSueOqQd3Xl4";
    const refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1MjU3OTgzMiwianRpIjoiN2IwN2EzZmEtNGJjMy00ZjBhLTljZjctMzg1ZjAyOTFkZjdlIiwidHlwZSI6InJlZnJlc2giLCJzdWIiOiJyZWppdGhyYW1ha3Jpc2huYW5AZ21haWwuY29tIiwibmJmIjoxNzUyNTc5ODMyLCJjc3JmIjoiY2RjMDUzNDItZGNlYi00YzcyLWI0MzctNmU0YjUwMTk1MmIzIiwiZXhwIjoxNzg0MTE1ODMyfQ.QtBS8II0lqSQTirZyaFdG7OKUJxDB284Th9oRTZGs6o";
    await AsyncStorage.setItem("accessToken", accessToken);
    await AsyncStorage.setItem("refreshToken", refreshToken);
    await AsyncStorage.setItem("userInfo", JSON.stringify(localUserInfo));
    router.replace('/(main)')
  }
  const login = async () => {
    setLog(prev => prev + `\n\n inside login`)
    const userInfoFromAsyncStorage = await AsyncStorage.getItem("userInfo");
    const accessToken = await AsyncStorage.getItem("accessToken");
    const userInfoFromAsyncStorageParsed = userInfoFromAsyncStorage ? JSON.parse(userInfoFromAsyncStorage) : null;
    if (accessToken) {      
      setLog(prev => prev + `\n\n accessToken: ${accessToken}`)
      setUserInfo(userInfoFromAsyncStorageParsed)
      router.replace('/(main)')
    } 
     setLog(prev => prev + `\n\n access token not found`)
  }

  const authenticate = async () => {
      setLoading(true)
      try{
      const gInfo = await getGoogleProfile();  
      setLog(prev => prev + `\n\n gInfo: ${JSON.stringify(gInfo)}`)
      authenticateMember(gInfo.email, gInfo.gtoken)
        .then(authResponse => {
          setLog(prev => prev + `\n\n appAuthResponse: ${JSON.stringify(authResponse.data)}`)
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
          setLog(prev => prev + `\n\n inside catch: ${JSON.stringify(error)}`)
          setAlertConfig({
            visible: true,
            title: 'Error',
            message: error.response.data.error,
            buttons: [{ text: 'OK', onPress: () => setAlertConfig({ visible: false }) }]
          })
        })
        .finally(() => setLoading(false))   
      } catch (error) {
          setLog(prev => prev + `\n\n error: ${JSON.stringify(error)}`)
      }
  }

  const getGoogleProfile = async () => {
    if (!response || response.type !== 'success') {
      setLog(prev => prev + `\n\n gauth failed. Please try again.`);
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
    setLog(prev => prev + `\n\n get google profile: ${JSON.stringify(gInfo)}`);
    return gInfo;
  }
  
  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={appStyles.centerify}>
        {/* <Image source={require("../../assets/images/app-icon.png")} style={{ height: 300, width: 300, marginBottom: 50 }} /> */}
        <ScrollView style={{width: "90%"}}><ThemedText>{log}</ThemedText></ScrollView>
        {isLoading ? <LoadingSpinner /> : <ThemedButton title="Sign in with Google" onPress={() => promptAsyc()} />}
      </View>
      {alertConfig?.visible && <Alert {...alertConfig} />}
    </ThemedView>
  )
}

export default AuthHome