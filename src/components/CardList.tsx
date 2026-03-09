import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/use-theme';
import Divider from './Divider';
import ThemedText from './themed-components/ThemedText';
import ThemedIcon from './themed-components/ThemedIcon';

interface CardListProps {
    headerIcon?: string;
    headerTitle?: string;
    headerRight?: React.ReactNode;
    onHeaderMenuPress?: () => void;
    children: React.ReactNode;
    containerStyle?: any;
}

const CardList: React.FC<CardListProps> = ({
    headerIcon,
    headerTitle,
    headerRight,
    onHeaderMenuPress,
    children,
    containerStyle
}) => {
    const { colors } = useTheme();
    const childrenArray = React.Children.toArray(children);

    return (
        <View style={[
            styles.mainContainer,
            { backgroundColor: colors.primary, borderColor: colors.border },
            containerStyle
        ]}>
            {headerTitle && (
                <>
                    <View style={styles.header}>
                        <View style={styles.headerTitleContainer}>
                            {headerIcon && (
                                <ThemedIcon name={headerIcon} size={24} color={colors.text} style={styles.headerIcon} />
                            )}
                            <ThemedText style={styles.headerLabel}>{headerTitle}</ThemedText>
                        </View>

                        <View style={styles.headerRightContainer}>
                            {headerRight}
                            {onHeaderMenuPress && (
                                <TouchableOpacity onPress={onHeaderMenuPress} style={styles.menuButton}>
                                    <ThemedIcon name="MaterialIcons:more-vert" size={24} color={colors.text} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                    <Divider />
                </>
            )}

            <View style={styles.listContainer}>
                {childrenArray.map((child, index) => (
                    <React.Fragment key={index}>
                        {child}
                        {index < childrenArray.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        // Shadow for Android
        elevation: 6,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        marginRight: 12,
    },
    headerLabel: {
        fontSize: 18,
        fontWeight: '600',
    },
    headerRightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuButton: {
        padding: 4,
        borderRadius: 20,
    },
    listContainer: {
        width: '100%',
    },
});

export default CardList;
