import { Text, StyleSheet } from 'react-native'
import React from 'react'
import { useTheme } from '@/src/hooks/use-theme'

const ThemedText = (props: any) => {
    const { colors } = useTheme()

    return (
        <Text {...props} style={StyleSheet.flatten([{ color: colors.text }, props?.style])} />
    )
}

export default ThemedText