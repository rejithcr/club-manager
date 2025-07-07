import { StyleSheet, View } from 'react-native'
import React from 'react'
import { useTheme } from '../hooks/use-theme';

const Card = (props: any) => {
    const { colors } = useTheme();
    return (
        <View style={{backgroundColor: colors.primary, ...styles.container, ...props.style}}>
            {props.children}
        </View>
    )
}

export default Card



const styles = StyleSheet.create({
    container: {
        minWidth: 100,
        borderColor: "#eee",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        borderRadius: 5,
        padding: 10,
        margin: 10
    }
});