import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { appStyles } from '../utils/styles'
import { useTheme } from '../hooks/use-theme';

const LoadingSpinner = () => {
  const { theme } = useTheme();
  return (
    <View style={{...appStyles.centerify}}>
      <ActivityIndicator size="small" color={theme.background} />
    </View>
  )
}

export default LoadingSpinner