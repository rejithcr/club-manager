import { View, Text } from 'react-native'
import React from 'react'
import { useTheme } from '@/src/hooks/use-theme'
import { appStyles } from '@/src/utils/styles'

const ThemedHeading = (props: any) => {
    const { colors } = useTheme()

  return (
    <View>
      <Text style={{...appStyles.heading, color: colors.text, ...props.style}}>{props.children}</Text>
    </View>
  )
}

export default ThemedHeading