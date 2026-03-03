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
                {props.label && (
                    <ThemedText style={[styles.label, { color: colors.subText }]}>
                        {props.label}
                    </ThemedText>
                )}
                <View style={[styles.webInputContainer, { backgroundColor: colors.primary, borderColor: colors.border }]}>
                    <input
                        style={{
                            ...styles.webInput,
                            backgroundColor: 'transparent',
                            color: colors.text,
                            border: 'none',
                            outline: 'none',
                        }}
                        type='date'
                        value={getWebFormattedDate(props.date)}
                        onChange={(e) => props.setDate(new Date(e.target.value))}
                    />
                </View>
            </View>
        )
    }
    return (
        <>
            <Pressable onPress={() => showDatepicker()}>
                <View style={styles.mobileContainer}>
                    {props.label && (
                        <ThemedText style={[styles.label, { color: colors.subText }]}>
                            {props.label}
                        </ThemedText>
                    )}
                    <View style={[styles.container, { backgroundColor: colors.primary, borderColor: colors.border }]}>
                        <ThemedText style={{ color: colors.text, fontSize: 16 }}>
                            {props.date ? props.date.toLocaleDateString() : 'Select date'}
                        </ThemedText>
                        <ThemedIcon name={"MaterialIcons:edit-calendar"} size={24} color={colors.subText} />
                    </View>
                </View>
            </Pressable>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={props.date || new Date()}
                    mode={"date"}
                    neutralButton={{ label: "Clear" }}
                    onChange={onChange}
                />
            )}
        </>
    )
}

export default DatePicker

const styles = StyleSheet.create({
    mobileContainer: {
        width: "90%",
        alignSelf: "center",
        marginVertical: 8,
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 2,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        // React Native shadow properties
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        // Android shadow
        elevation: 1,
    },
    webContainer: {
        width: "90%",
        alignSelf: "center",
        marginVertical: 8,
    },
    webInputContainer: {
        borderWidth: 2,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        // React Native shadow properties
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        // Android shadow
        elevation: 1,
    },
    webInput: {
        width: "100%",
        fontSize: 16,
        paddingVertical: 8,
        fontFamily: "inherit",
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 6,
    },
})