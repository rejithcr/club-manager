import { View, ActivityIndicator } from 'react-native'
import React, { useRef, useEffect, useState } from 'react'
import { appStyles } from '../utils/styles'
import { useTheme } from '../hooks/use-theme';

const spinnerColors = ['#FF9800', '#2196F3', '#4CAF50', '#E91E63', '#FFC107'];

const LoadingSpinner = () => {
  const { colors } = useTheme();
  const [colorIndex, setColorIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % spinnerColors.length);
    }, 400);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);


  return (
      <ActivityIndicator
        size="small"
        color={spinnerColors[colorIndex] || colors.text}
      />
  );
};

export default LoadingSpinner