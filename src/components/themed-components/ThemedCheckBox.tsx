import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { useTheme } from '@/src/hooks/use-theme'

const ThemedCheckBox = (props: { checked?: boolean }) => {
    const { colors } = useTheme()
    return (
       <MaterialIcons name={props.checked ? 'check-circle' : 'radio-button-unchecked'} size={20} color={props.checked ? colors.success : colors.text} />
    )
}

export default ThemedCheckBox