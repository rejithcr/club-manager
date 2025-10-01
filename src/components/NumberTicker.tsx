import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, TextStyle, View, ViewStyle } from 'react-native';

type Props = {
  value: number;
  isLoading?: boolean;
  style?: TextStyle;
  containerStyle?: ViewStyle;
  duration?: number;
};

const formatNumber = (n: number) => {
  try {
    // always show rounded integer (no decimals)
    const rounded = Math.round(n);
    return new Intl.NumberFormat('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(rounded);
  } catch (e) {
    return String(Math.round(n));
  }
};

export default function NumberTicker({ value, isLoading = false, style, containerStyle, duration = 1200 }: Props) {
  const animated = useRef(new Animated.Value(Math.round(Number(value || 0)))).current;
  const [display, setDisplay] = useState<number>(Math.round(Number(value || 0)));
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    let listenerId: string | number | null = null;

    // keep animated value in sync with display when animating to final value
    listenerId = animated.addListener(({ value: v }) => {
      // round to nearest integer for display
      const rounded = Math.round(v);
      setDisplay(Math.max(0, rounded));
    });

    if (isLoading) {
      // during loading, show quick randomized rolling numbers (slot-machine effect)
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        // show random up-to a reasonable magnitude while loading
        const max = Math.max(1000, Math.floor((value || 0) * 1.5), 9999);
        const rand = Math.floor(Math.random() * max);
        setDisplay(rand);
      }, 70);
    } else {
      // stop the rolling interval and animate smoothly to the final value
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // set animated start point to current display, then animate to rounded target value
      const target = Math.max(0, Math.round(Number(value || 0)));
      animated.setValue(display);
      Animated.timing(animated, {
        toValue: target,
        duration,
        easing: Easing.out(Easing.exp),
        useNativeDriver: false,
      }).start(() => {
        // ensure final display equals the rounded prop exactly
        setDisplay(target);
        animated.setValue(target);
      });
    }

    return () => {
      try {
        if (listenerId != null) animated.removeListener(listenerId as any);
      } catch {}
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isLoading, value]);

  return (
    <View style={containerStyle}>
      <Animated.Text style={style}>₹ {formatNumber(display)}</Animated.Text>
    </View>
  );
}
