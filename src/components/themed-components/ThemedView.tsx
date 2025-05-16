import { View } from 'react-native'
import React from 'react'
import { useTheme } from '@/src/hooks/use-theme'

const ThemedView = (props:any) => {
    const {theme} = useTheme()

    return (
        <View {...props} style={{ backgroundColor: theme.background, ...props?.style }} />
    )
}

export default ThemedView