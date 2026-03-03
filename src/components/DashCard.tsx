import React from 'react';
import { View, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/use-theme';

interface DashCardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    noPadding?: boolean;
}

const DashCard = ({ children, style, noPadding }: DashCardProps) => {
    const { colors } = useTheme();

    const localStyles: ViewStyle = {
        backgroundColor: colors.card,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
        marginBottom: 16,
        marginHorizontal: 16,
    }
    return (
        <View style={StyleSheet.flatten([localStyles, style])}>
            <View style={!noPadding ? { padding: 16 } : null}>
                {children}
            </View>
        </View>
    );
};

export default DashCard;
