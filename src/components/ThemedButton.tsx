import { Pressable, StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const ThemedButton = (props: { title: string; onPress: any; disabled?: boolean; style?: any}) => {
    return (
        <TouchableOpacity style={{...styles.button, backgroundColor: props?.disabled ? "grey": "black", ...props.style}} onPress={props?.onPress}>
            <Text style={styles.text}>{props.title}</Text>
        </TouchableOpacity>
    )
}

export default ThemedButton;

const styles = StyleSheet.create({
    button: {
        height: 50,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        borderRadius: 5
    },
    text: {
        color: "white",
        fontWeight: "bold",
        fontSize: 15
    }
})