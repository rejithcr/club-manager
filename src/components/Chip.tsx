import { StyleSheet, TouchableOpacity } from 'react-native'
import React, { ReactNode } from 'react'
import { useTheme } from '../hooks/use-theme';
import Spacer from './Spacer';
import ThemedCheckBox from './themed-components/ThemedCheckBox';

const Chip = (props: {
    style?: any;
    selected?: boolean;
    children: ReactNode | undefined; onPress?: any;
}) => {
    const { colors } = useTheme();
    return (
        <TouchableOpacity style={{ ...styles.chip, backgroundColor: colors.primary, ...props.style }} onPress={props.onPress}>
            {props.children}
            {props.selected && <><Spacer hspace={5} /><ThemedCheckBox checked={true} /></>}
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