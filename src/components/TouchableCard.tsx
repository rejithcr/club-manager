import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { ReactNode } from 'react'
import ShadowBox from './ShadowBox';
import ThemedIcon from './themed-components/ThemedIcon';
import { useTheme } from '../hooks/use-theme';

const TouchableCard = (props: {
    id?: any;
    style?: any;
    children: ReactNode | undefined; onPress?: any;
    icon?: any
}) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity onPress={() => props.onPress && props.onPress(props.id)}>
            <ShadowBox style={{ ...styles.container, ...props.style }}>  
                {props.children}       
                {props.onPress && (props.icon ? props.icon : <ThemedIcon style={styles.icon} name="MaterialCommunityIcons:chevron-right-circle" color={colors.nav}/>) }
            </ShadowBox>
        </TouchableOpacity>
    )
}

export default TouchableCard


const styles = StyleSheet.create({
    container: {
        padding: 10,
        width: "85%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    icon: {
        position: "absolute",
        right: 10,
        width: 20
    }
});
