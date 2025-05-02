import { View, StyleSheet, TouchableOpacity } from 'react-native'
import React, { ReactNode } from 'react'
import ShadowBox from './ShadowBox';

const TouchableCard = (props: {
    id: any;
    styles?: any; 
    children: ReactNode | undefined; showDetails?: any; 
}) => {
    return (
        <TouchableOpacity onPress={() => props.showDetails(props.id)}>
            <ShadowBox style={{...styles.container, ...props.styles}}>
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
    }});
