import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTheme } from '../hooks/use-theme';

const ThemedButton = (props: { title: string; onPress: any; disabled?: boolean; style?: any}) => {
    const { colors } = useTheme();
    return (
        <TouchableOpacity style={{...styles.button, backgroundColor: props?.disabled ? colors.disabled : colors.button, ...props.style}}
            onPress={!props?.disabled ? props?.onPress : undefined}>
            <Text style={{...styles.text}}>{props.title}</Text>
        </TouchableOpacity>
    )
}

export default ThemedButton;

const styles = StyleSheet.create({
    button: {
        minWidth:80,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 25,
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    },
    text: {
        color: "white",
        fontSize: 15
    }
})