import { View, StyleSheet } from 'react-native'
import React from 'react'
import { useTheme } from '@/src/hooks/use-theme'

const ThemedView = (props: any) => {
    const { colors } = useTheme()

    return (
        <View {...props} style={StyleSheet.flatten([{ backgroundColor: colors.background }, props?.style])} />
    )
}

export default ThemedView