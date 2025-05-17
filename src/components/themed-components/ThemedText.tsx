import { Text, useColorScheme } from 'react-native'
import React from 'react'
import { colors } from '@/src/utils/styles'
import { useTheme } from '@/src/hooks/use-theme'

const ThemedText = (props: any) => {
    const {colors} = useTheme()

    return (
        <Text {...props} style={{ color: colors.text, ...props?.style }} />
    )
}

export default ThemedText