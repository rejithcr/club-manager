import { useTheme } from '@/src/hooks/use-theme';
import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Animated,
    StyleSheet,
    Easing,
    Text,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

class CircleOmitter extends Circle {
    public override render() {
        const newProps = {
            ...this.props,
            collapsable: undefined
        };
        return <Circle {...newProps} />;
    }
}

const AnimatedCircle = Animated.createAnimatedComponent(CircleOmitter);

const CircularProgress = ({
    size = 120,
    strokeWidth = 10,
    value = 75,
    duration = 1000,
    color = null,
    ringBgColor = '#eee',
    fillBgColor = "transparent"
}) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [displayValue, setDisplayValue] = useState(0); // ✅ integer value for text
    const { colors } = useTheme();
    const halfSize = size / 2;
    const radius = halfSize - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        const animation = Animated.timing(animatedValue, {
            toValue: value,
            duration,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        });

        const listenerId = animatedValue.addListener(({ value }) => {
            setDisplayValue(Math.round(value));
        });

        animation.start();

        return () => {
            animatedValue.removeListener(listenerId);
        };
    }, [value]);

    const interpolatedColor = animatedValue.interpolate({
        inputRange: [0, 25, 50, 100],
        outputRange: ['rgb(246, 255, 119)', 'rgb(255,165,0)', 'rgb(255, 248, 91)', 'rgb(90, 201, 131)'],
    });

    const strokeDashoffset = animatedValue.interpolate({
        inputRange: [0, 100],
        outputRange: [circumference, 0],
    });

    return (
        <View style={styles.container}>
            <Svg width={size} height={size}>
                <Circle
                    cx={halfSize}
                    cy={halfSize}
                    r={radius}
                    fill={fillBgColor}
                />
                <Circle
                    stroke={ringBgColor}
                    fill="none"
                    cx={halfSize}
                    cy={halfSize}
                    r={radius}
                    strokeWidth={strokeWidth}
                    transform={`rotate(-90 ${halfSize} ${halfSize})`}
                />
                <AnimatedCircle
                    stroke={color || interpolatedColor}
                    fill="none"
                    cx={halfSize}
                    cy={halfSize}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${halfSize} ${halfSize})`}
                />
            </Svg>

            <View style={[StyleSheet.absoluteFillObject, styles.center]}>
                <Text style={[styles.text, { color: colors.text, fontSize: size / 5 }]}>
                    {displayValue}%
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: '600',
    },
});

export default CircularProgress;