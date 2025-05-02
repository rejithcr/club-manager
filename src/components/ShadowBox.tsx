import { View, StyleSheet } from 'react-native'
import React from 'react'

const ShadowBox = (props: any) => {
    return (
        <View style={{...styles.container,...props.style}}>
            {props.children}
        </View>
    )
}

export default ShadowBox



const styles = StyleSheet.create({
    container: {
        width: "80%",
        borderColor: "#eee",
        alignItems: "center",
        alignSelf: "center",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        borderRadius: 5
    }
});
