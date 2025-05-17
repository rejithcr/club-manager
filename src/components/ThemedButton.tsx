import { Pressable, StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTheme } from '../hooks/use-theme';

const ThemedButton = (props: { title: string; onPress: any; disabled?: boolean; style?: any}) => {
    const { colors } = useTheme();
    return (
        <TouchableOpacity style={{...styles.button, backgroundColor: props?.disabled ? colors.disabled : colors.button, ...props.style}} onPress={props?.onPress}>
            <Text style={{...styles.text}}>{props.title}</Text>
        </TouchableOpacity>
    )
}

export default ThemedButton;

const styles = StyleSheet.create({
    button: {
        height: 40,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        borderRadius: 5
    },
    text: {
        color: "white",
        fontSize: 15
    }
})