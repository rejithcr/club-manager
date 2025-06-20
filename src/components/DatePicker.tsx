import { View, StyleSheet, Pressable, Platform } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import ThemedIcon from './themed-components/ThemedIcon';
import ThemedText from './themed-components/ThemedText';
import { useTheme } from '../hooks/use-theme';

const DatePicker = (props: { date: Date | null; setDate: any, label?: string }) => {
    const [show, setShow] = useState(false);
    const { colors } = useTheme()

    const onChange = (event: any, selectedDate?: Date) => {
        setShow(false);
        if (event.type === 'neutralButtonPressed') {
            props.setDate(null); // Clear date if picker is dismissed
            return;
        }
        props.setDate(selectedDate);
    };

    const showDatepicker = () => {
        setShow(true);
    };

    const getWebFormattedDate = (date: Date | null) => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    if (Platform.OS == 'web') {
        return (
            <View style={styles.webContainer}>
                <div style={{ color: colors.text, fontFamily:"Roboto" }}>{props.label}</div>
                <input style={{ ...styles.webInput, backgroundColor: colors.background, color: colors.text }}
                    type='date' value={getWebFormattedDate(props.date)}
                    onChange={(e) => props.setDate(new Date(e.target.value))} />
            </View>
        )
    }
    return (
        <>
            <Pressable onPress={() => showDatepicker()}>
                <View style={{marginVertical: 10}}>
                    <ThemedText style={styles.label}>{props.label || ""}</ThemedText>
                    <View style={styles.container}>
                        <ThemedText>{props.date?.toLocaleDateString()} </ThemedText>
                        <ThemedIcon name={"MaterialIcons:edit-calendar"} size={32} />
                    </View>
                </View>
            </Pressable>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={props.date || new Date()}
                    mode={"date"}
                    neutralButton = {{ label: "Clear"}}
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