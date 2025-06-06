import { View, TouchableOpacity, GestureResponderEvent } from 'react-native'
import React from 'react'
import { appStyles } from '../utils/styles'
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
                ...appStyles.shadowBox, width: "80%", flexWrap: "wrap"
            }}>
                <ThemedText numberOfLines={1} style={{ width: "60%", fontSize: 15, paddingLeft: 5, textAlign: "left" }}>{props.keyName}</ThemedText>
                <ThemedText style={{ width: "30%", fontSize: 15, textAlign: "right" }}>{props.keyValue}  </ThemedText>
                <ThemedIcon style={{ width: "10%", paddingLeft: 5}} name={props.edit ? 'MaterialCommunityIcons:square-edit-outline': 'MaterialCommunityIcons:chevron-right-circle'} color={props.edit ? colors.warning : colors.nav}/>                
            </View>
        </TouchableOpacity>
    )
}

export default KeyValueTouchableBox