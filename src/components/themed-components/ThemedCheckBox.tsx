import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { useTheme } from '@/src/hooks/use-theme'

const ThemedCheckBox = (props: { checked?: boolean }) => {
    const { theme } = useTheme()
    return (
        <MaterialIcons name={props.checked ? 'check-circle' : 'circle'} size={20} color={props.checked ? theme.success : theme.text} />
    )
}

export default ThemedCheckBox