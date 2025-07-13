import { useTheme } from '@/src/hooks/use-theme';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, DimensionValue } from 'react-native';

const ProgressBar = ({
    value = 60,
    height = 20,
    duration = 500,
    backgroundColor = '#e0e0e0',
    borderRadius = 10,
    showPercentage = true,
    textColor = '#000',
    barWidth = '80%',  // customize width
}) => {
    const [displayValue, setDisplayValue] = useState(0);
    const animatedValue = useRef(new Animated.Value(0)).current;
    const { colors } = useTheme();

    useEffect(() => {
        const animation = Animated.timing(animatedValue, {
            toValue: value,
            duration,
            useNativeDriver: false,
        });

        const listener = animatedValue.addListener(({ value }) => {
            setDisplayValue(Math.round(value));
        });

        animation.start();

        return () => {
            animatedValue.removeListener(listener);
        };
    }, [value]);

    const progressColor = animatedValue.interpolate({
        inputRange: [0, 25, 50, 100],
        outputRange: ['rgb(246, 255, 119)', 'rgb(255,165,0)', 'rgb(255, 248, 91)', 'rgb(90, 201, 131)'],
    });

    const widthInterpolated = animatedValue.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={[styles.wrapper]}>
            {/* Progress Bar */}
            <View style={[styles.container, { height, backgroundColor, borderRadius, width: barWidth as DimensionValue }]}>
                <Animated.View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            width: widthInterpolated,
                            backgroundColor: progressColor,
                            borderRadius,
                        },
                    ]}
                />
            </View>

            {/* Percentage Text */}
            {showPercentage && (
                <View style={styles.textWrapper}>
                    <Text style={[{ color: colors.text, fontSize: height * 70 / 100 }]}>
                        {displayValue}%
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    container: {
        overflow: 'hidden',
    },
    textWrapper: {
        alignItems: 'flex-end'
    }
});

export default ProgressBar;
