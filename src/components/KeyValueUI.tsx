import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { camelCaseToWords } from '../utils/string'
import ThemedView from './themed-components/ThemedView';
import ThemedText from './themed-components/ThemedText';

const KeyValueUI = (props: { data: any; hideKeys?: string[] }) => {
    const list = Object.keys(props?.data || {})
        .filter(key => !props?.hideKeys?.includes(key))
        .map((key: string, _index) => { return { "key": key, "value": props?.data[key] } })
    return (
        <ThemedView style={styles.detailsTable}>
            {list.map(item =>
                <View key={item.key} style={styles.item}>
                    <ThemedText style={styles.label}>{camelCaseToWords(item.key)}</ThemedText>
                    <ThemedText style={styles.value}>{item.value}</ThemedText>
                    <ThemedView style={styles.divider} />
                </View>
            )}
        </ThemedView>
    )
}

export default KeyValueUI


const styles = StyleSheet.create({
    detailsTable: {
        width: "80%",
        alignSelf: "center",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        borderRadius: 5
    },
    item: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between"
    },
    label: {
       // width: "30%",
        padding: 10,
    },
    value: {
       // width: "70%",
        padding: 10,
    },
    divider: {
        borderBottomColor: 'rgba(136, 136, 136, 0.2)',
        borderBottomWidth: StyleSheet.hairlineWidth,
        width: "100%"
    }
});