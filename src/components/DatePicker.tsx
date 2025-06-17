import { View, StyleSheet, Pressable, Platform } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import ThemedIcon from './themed-components/ThemedIcon';
import ThemedText from './themed-components/ThemedText';
import { useTheme } from '../hooks/use-theme';

const DatePicker = (props: { date: Date; setDate: any, label?: string }) => {
    const [show, setShow] = useState(false);
    const { colors } = useTheme()

    const onChange = (_: any, selectedDate?: Date) => {
        setShow(false);
        props.setDate(selectedDate);
    };

    const showDatepicker = () => {
        setShow(true);
    };

    const getWebFormattedDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    if (Platform.OS == 'web') {
        console.log(props.date.toLocaleDateString())
        return (
            <View style={styles.webContainer}>
                <div>{props.label}</div>
                <input style={{ ...styles.webInput, backgroundColor: colors.background, color: colors.text }}
                    type='date' value={getWebFormattedDate(props.date)}
                    onChange={(e) => props.setDate(new Date(e.target.value))} />
            </View>
        )
    }
    return (
        <>
            <Pressable onPress={() => showDatepicker()}>
                <View style={{margin: 10}}>
                    <ThemedText style={styles.label}>{props.label || ""}</ThemedText>
                    <View style={styles.container}>
                        <ThemedText>{props.date.toLocaleDateString()} </ThemedText>
                        <ThemedIcon name={"MaterialIcons:edit-calendar"} size={32} />
                    </View>
                </View>
            </Pressable>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={props.date}
                    mode={"date"}
                    onChange={onChange}
                />
            )}
        </>
    )
}

export default DatePicker

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "80%",
        alignSelf: "center",
        fontSize: 15,
        height: 40,
        borderBottomColor: "grey",
        borderBottomWidth: 1,
        paddingLeft: 5
    },
    webContainer: {
        flexDirection: "row",
        width: "80%",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 20,
    },
    webInput: {
        padding: 10
    },
    label: {
        fontSize: 10,
        width: "80%",
        alignSelf: "center",
    },
})