import { StyleSheet, View } from 'react-native'
import React from 'react'
import { useTheme } from '../hooks/use-theme';

const Card = (props: any) => {
    const { colors } = useTheme();
    return (
        <View style={StyleSheet.flatten([{ backgroundColor: colors.primary }, styles.container, props.style])}>
            {props.children}
        </View>
    )
}

export default Card



const styles = StyleSheet.create({
    container: {
        minWidth: 100,
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        // Shadow for Android
        elevation: 6,
        borderRadius: 25,
        padding: 15
    }
});