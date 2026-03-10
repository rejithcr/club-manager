import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    interpolate,
    interpolateColor,
    Easing,
    FadeIn,
    FadeOut,
    LinearTransition
} from 'react-native-reanimated';
import { useTheme } from '../hooks/use-theme';
import ThemedText from './themed-components/ThemedText';
import ThemedIcon from './themed-components/ThemedIcon';

interface ExpandableCardProps {
    statusIconName?: string;
    statusIconColor?: string;
    actionIconName?: string;
    onActionPress?: () => void;
    title: string;
    subtitle?: string;
    isExpandable?: boolean;
    children?: React.ReactNode;
    onPress?: () => void;
    containerStyle?: any;
}

const ExpandableCard: React.FC<ExpandableCardProps> = ({
    statusIconName,
    statusIconColor,
    actionIconName,
    onActionPress,
    title,
    subtitle,
    isExpandable = false,
    children,
    onPress,
    containerStyle
}) => {
    const { colors } = useTheme();
    const [isExpanded, setIsExpanded] = useState(false);

    const expansion = useSharedValue(0);

    const toggleExpand = () => {
        if (!isExpandable) {
            onPress?.();
            return;
        }

        const newValue = isExpanded ? 0 : 1;
        expansion.value = withTiming(newValue, {
            duration: 300,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
        });
        setIsExpanded(!isExpanded);
    };

    const animatedContainerStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                expansion.value,
                [0, 1],
                ['transparent', colors.secondary + '40']
            )
        };
    });

    const animatedChevronStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${interpolate(expansion.value, [0, 1], [0, 90])}deg` }],
        };
    });

    return (
        <View style={[
            styles.container,
            containerStyle
        ]}>
            <Animated.View style={animatedContainerStyle}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={isExpandable ? toggleExpand : onPress}
                    style={styles.header}
                >
                    <View style={styles.leftSection}>
                        {isExpandable ? (
                            <Animated.View style={[styles.chevron, animatedChevronStyle]}>
                                <ThemedIcon name="MaterialIcons:keyboard-arrow-right" size={20} color={colors.subText} />
                            </Animated.View>
                        ) : (
                            <View style={styles.chevronPlaceholder} />
                        )}

                        {statusIconName && (
                            <View style={styles.statusIconContainer}>
                                <ThemedIcon
                                    name={statusIconName}
                                    size={20}
                                    color={statusIconColor || colors.success}
                                />
                            </View>
                        )}

                        <View style={styles.textContainer}>
                            <ThemedText style={styles.title}>{title}</ThemedText>
                            {subtitle && (
                                <ThemedText style={[styles.subtitle, { color: colors.subText }]}>
                                    {subtitle}
                                </ThemedText>
                            )}
                        </View>
                    </View>

                    {actionIconName && (
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: colors.secondary + '60' }]}
                            onPress={onActionPress}
                        >
                            <ThemedIcon name={actionIconName} size={16} color={colors.text} />
                        </TouchableOpacity>
                    )}
                </TouchableOpacity>
            </Animated.View>

            {isExpandable && isExpanded && (
                <Animated.View
                    entering={FadeIn.duration(300)}
                    exiting={FadeOut.duration(300)}
                    layout={LinearTransition.duration(300)}
                    style={styles.content}
                >
                    {children}
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    chevron: {
        marginRight: 8,
    },
    chevronPlaceholder: {
        width: 28,
    },
    statusIconContainer: {
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontWeight: '500',
    },
    subtitle: {
        fontSize: 12,
        marginTop: 1,
    },
    actionButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    content: {
        paddingLeft: 56, // Align with the text
        paddingRight: 16,
        paddingBottom: 16,
    },
});

export default ExpandableCard;
