import { View, StyleSheet } from 'react-native'
import React from 'react'
import { camelCaseToWords } from '../utils/string'
import ThemedView from './themed-components/ThemedView';
import ThemedText from './themed-components/ThemedText';
import Divider from './Divider';
import { useTheme } from '../hooks/use-theme';

const KeyValueUI = (props: { data: any; hideKeys?: string[] }) => {
    const { colors } = useTheme();
    const list = Object.keys(props?.data || {})
        .filter(key => !props?.hideKeys?.includes(key))
        .map((key: string, _index) => { return { "key": key, "value": props?.data[key] } })

    return (
        <ThemedView style={styles.container}>
            {list.map((item, index) =>
                <ThemedView key={item.key} style={StyleSheet.flatten([styles.item, { backgroundColor: colors.primary }])}>
                    <View style={styles.row}>
                        <ThemedText style={StyleSheet.flatten([styles.label, { color: colors.subText }])}>
                            {camelCaseToWords(item.key)}
                        </ThemedText>
                        <ThemedText style={StyleSheet.flatten([styles.value, { color: colors.text }])}>
                            {item.value || 'Not specified'}
                        </ThemedText>
                    </View>
                    {index < list.length - 1 && <Divider style={styles.divider} />}
                </ThemedView>
            )}
        </ThemedView>
    )
}

export default KeyValueUI

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    item: {
        paddingVertical: 8,
    },
    row: {
        flexDirection: "column",
        gap: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
    },
    value: {
        fontSize: 16,
        fontWeight: '400',
    },
    divider: {
        marginTop: 8,
        opacity: 0.3,
    }
});