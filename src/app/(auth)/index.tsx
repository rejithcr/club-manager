import { View, Text } from 'react-native'
import React, { useState } from 'react'
import InputText from '@/src/components/InputText'
import ThemedButton from '@/src/components/ThemedButton'
import { useRouter } from 'expo-router'
import { ScrollView } from 'react-native-gesture-handler'

const AuthHome = () => {
  const [enableLogin, setEnableLogin] = useState(true)
  const [phoneNumber, setPhoneNumber] = useState<number>()
  const [otp, setOTP] = useState<number>()
  const router = useRouter()

  const sendOTP = () => {
    if (isResgisteredUser(phoneNumber)) {
      setOTP(1234)
      router.replace(`/(main)`)
    } else {
      router.push(`/(auth)/register`)
    setEnableLogin(false)
    }
  }
  const isResgisteredUser = (phoneNumber: number | undefined) => {
    console.log('phone', phoneNumber)
    return false
  }

  const login = () => {
    if (otp == 1234) {
      if (isResgisteredUser(phoneNumber)) {
        router.replace(`/(main)`)
      } else {
        router.push(`/(auth)/register`)
      }
    }
  }

  return (
    <ScrollView>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <InputText placeholder='Enter phone number' keyboardType="numeric"
          onChangeText={(text: any) => setPhoneNumber(text)} />
        <ThemedButton title={otp ? "Resend OTP": "Get OTP"} opnPress={() => sendOTP()} />
        {otp &&
          <View style={{ marginTop: 100 }}>
            <InputText placeholder='Enter OTP' keyboardType="numeric" />
            <ThemedButton title="Login" disabled={enableLogin} opnPress={() => login()} />
          </View>
        }
      </View>
    </ScrollView>
  )
}

export default AuthHome