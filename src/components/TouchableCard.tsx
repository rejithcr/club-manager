import { View, StyleSheet, TouchableOpacity } from 'react-native'
import React, { ReactNode } from 'react'

const TouchableCard = (props: {
    id: any;
    children: ReactNode | undefined; showDetails?: any; 
}) => {
    return (
        <TouchableOpacity onPress={() => props.showDetails(props.id)}>
            <View style={styles.container}>
                {props.children}
            </View>
        </TouchableOpacity>
    )
}

export default TouchableCard


const styles = StyleSheet.create({
    container: {
        minHeight: 50,
        margin: 5,
        padding: 10,
        flex: 1,
        width: "80%",
        flexDirection: "row",
        borderColor: "#eee",
        alignItems: "center",
        alignSelf: "center",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        borderRadius: 5
    }});
