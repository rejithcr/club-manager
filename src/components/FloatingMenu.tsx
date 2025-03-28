import { View, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'

const FloatingMenu = (props: { onPress: any; icon?: any }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={props.onPress}>
                <MaterialIcons name={props.icon || "menu"} size={32} color={"white"} />
            </TouchableOpacity>
        </View>
    )
}

export default FloatingMenu

const styles = StyleSheet.create({
    container: {
        bottom: 30,
        left: 30,
        position: 'absolute',
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'black',
        justifyContent: "center",
        alignItems: "center"
    }

})