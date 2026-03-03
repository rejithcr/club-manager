import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { ReactNode } from 'react'
import { useTheme } from '../hooks/use-theme';
import Spacer from './Spacer';
import ThemedCheckBox from './themed-components/ThemedCheckBox';
import { MaterialIcons } from '@expo/vector-icons';

const Chip = (props: {
    style?: any;
    selected?: boolean;
    onRemove?: () => void;
    children: ReactNode | undefined;
    onPress?: any;
}) => {
    const { colors } = useTheme();
    return (
        <TouchableOpacity
            style={StyleSheet.flatten([styles.chip, { backgroundColor: colors.primary }, props.style])}
            onPress={props.onPress}
        >
            {props.children}
            {props.selected && <><Spacer hspace={5} /><ThemedCheckBox checked={true} /></>}
            {props.onRemove && (
                <TouchableOpacity onPress={props.onRemove} style={{ marginLeft: 5 }}>
                    <MaterialIcons name="close" size={16} color={colors.text} />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    )
}

export default Chip

const styles = StyleSheet.create({
    chip: {
        borderRadius: 50, paddingVertical: 10, paddingHorizontal: 15, alignItems: "center",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", flexDirection: "row"
    }
});