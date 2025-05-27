import { View, StyleSheet, Pressable } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import ThemedIcon from './themed-components/ThemedIcon';
import ThemedText from './themed-components/ThemedText';

const DatePicker = (props: { date: Date; setDate: any }) => {
    const [show, setShow] = useState(false);

    const onChange = (_: any, selectedDate?: Date) => {
        setShow(false);
        props.setDate(selectedDate);
    };

    const showDatepicker = () => {
        setShow(true);
    };

    return (
        <>
            <Pressable onPress={() => showDatepicker()}>
                <View style={styles.container}>
                    <ThemedText>{props.date.toLocaleDateString()} </ThemedText>
                    <ThemedIcon name={"MaterialIcons:edit-calendar"} size={32} />
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
        margin: 10,
        paddingLeft: 5
    }
})