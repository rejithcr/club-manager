import { StyleSheet, Text, Pressable, TouchableOpacity } from 'react-native'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const ThemedButton = (props: { title: string; opnPress: any }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={props.opnPress}>
            <Text style={styles.text}>{props.title}</Text>
        </TouchableOpacity>
    )
}

export default ThemedButton;

const styles = StyleSheet.create({
    button: {
        backgroundColor: "black",
        height: 50,
        alignSelf: "center",
        color: "white",
        justifyContent: "center",
        alignItems: "center",
        padding: 15
    },
    text: {
        color: "white",
        fontWeight: "bold",
        fontSize: 15
    }
})