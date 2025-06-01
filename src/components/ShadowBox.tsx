import { View, StyleSheet } from 'react-native'
import React from 'react'
import { useTheme } from '../hooks/use-theme';

const ShadowBox = (props: any) => {
    const { colors } = useTheme();
    return (
        <View style={{backgroundColor: colors.primary, ...styles.container,...props.style}}>
            {props.children}
        </View>
    )
}

export default ShadowBox



const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: "80%",
        borderColor: "#eee",
        alignItems: "center",
        alignSelf: "center",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        borderRadius: 5,
        padding: 10
    }
});
