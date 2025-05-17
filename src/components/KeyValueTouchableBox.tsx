import { View, Text, TouchableOpacity, GestureResponderEvent } from 'react-native'
import React from 'react'
import { appStyles } from '../utils/styles'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import ThemedText from './themed-components/ThemedText'
import { useTheme } from '../hooks/use-theme'
import ThemedIcon from './themed-components/ThemedIcon'

const KeyValueTouchableBox = (props: { 
    onPress: ((event: GestureResponderEvent) => void) | undefined; 
    edit?: boolean;
    goto?: boolean;
    keyName: string | null | undefined; 
    keyValue: string | number | null | undefined }) => {
    
    const { colors } = useTheme();

    return (        
        <TouchableOpacity onPress={props.onPress}>
            <View style={{ backgroundColor: colors.primary, 
                ...appStyles.shadowBox, width: "80%", marginBottom: 15, flexWrap: "wrap",
                flexBasis: "auto"
            }}>
                <ThemedText numberOfLines={1} style={{ width: "60%", fontSize: 15, paddingLeft: 5, textAlign: "left" }}>{props.keyName}</ThemedText>
                <ThemedText style={{ width: "30%", fontSize: 15, textAlign: "right" }}>{props.keyValue}</ThemedText>
                {props.edit && <ThemedIcon style={{ width: "10%", paddingLeft: 5}} name='MaterialCommunityIcons:square-edit-outline' /> }
                {props.goto && <ThemedIcon style={{ width: "10%", paddingLeft: 5}} name='MaterialCommunityIcons:chevron-right-circle' /> }
            </View>
        </TouchableOpacity>
    )
}

export default KeyValueTouchableBox