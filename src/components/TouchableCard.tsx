import { StyleSheet, TouchableOpacity } from 'react-native'
import React, { ReactNode } from 'react'
import ShadowBox from './ShadowBox';

const TouchableCard = (props: {
    id: any;
    style?: any;
    children: ReactNode | undefined; onPress?: any;
}) => {
    return (
        <TouchableOpacity onPress={() => props.onPress(props.id)}>
            <ShadowBox style={{ ...styles.container, ...props.style }}>
                {props.children}
            </ShadowBox>
        </TouchableOpacity>
    )
}

export default TouchableCard


const styles = StyleSheet.create({
    container: {
        minHeight: 50,
        margin: 5,
        padding: 10,
        width: "80%",
        flexDirection: "row",
    }
});
