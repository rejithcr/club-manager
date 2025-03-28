import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'

const SimpleCard = (props: { id: number; name: string; showDetails?: any; }) => {
    return (
        <TouchableOpacity onPress={() => props.showDetails(props.id)}>
            <View style={styles.container}>
                <View style={styles.spend}>
                    <Text>
                        {props.name}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default SimpleCard


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
    },
    spend: {
        flex: 0.6,
    },
    amount: {
        flex: 0.2,
        textAlign: "right",
    },
    date: {
        fontSize: 9,
    },
    icon: {
        flex: 0.16,
    },
});
