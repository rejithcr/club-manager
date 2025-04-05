import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { appStyles } from '../utils/styles'

const LoadingSpinner = () => {
  return (
    <View style={{...appStyles.centerify}}>
      <ActivityIndicator size="small" color={"black"} />
    </View>
  )
}

export default LoadingSpinner