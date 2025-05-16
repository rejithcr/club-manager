import { View, Text, TouchableOpacity, GestureResponderEvent } from 'react-native'
import React from 'react'
import { appStyles } from '../utils/styles'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import ThemedText from './themed-components/ThemedText'
import { useTheme } from '../hooks/use-theme'

const KeyValueTouchableBox = (props: { 
    onPress: ((event: GestureResponderEvent) => void) | undefined; 
    edit?: boolean;
    goto?: boolean;
    keyName: string | null | undefined; 
    keyValue: string | number | null | undefined }) => {
    
    const { theme } = useTheme();

    return (        
        <TouchableOpacity onPress={props.onPress}>
            <View style={{ backgroundColor: theme.primary, 
                ...appStyles.shadowBox, width: "80%", marginBottom: 15, flexWrap: "wrap",
                flexBasis: "auto"
            }}>
                <ThemedText numberOfLines={1} style={{ width: "60%", fontSize: 15, paddingLeft: 5, textAlign: "left" }}>{props.keyName}</ThemedText>
                <ThemedText style={{ width: "30%", fontSize: 15, textAlign: "right" }}>{props.keyValue}</ThemedText>
                {props.edit && <MaterialCommunityIcons style={{ width: "10%", fontSize: 15, textAlign: "right" }} name='square-edit-outline' /> }
                {props.goto && <MaterialCommunityIcons style={{ width: "10%", fontSize: 15, textAlign: "right" }} name='chevron-right-circle' /> }
            </View>
        </TouchableOpacity>
    )
}

export default KeyValueTouchableBox