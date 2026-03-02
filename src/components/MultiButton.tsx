import React, { useRef } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import ThemedText from './themed-components/ThemedText';
import ThemedIcon from './themed-components/ThemedIcon';

interface MultiButtonProps {
  club?: any;
  label?: string;
  icon?: string;
  isSelected: boolean;
  onSelect: () => void;
  onGoToHome?: () => void;
  colors: any;
}

// Split Button Component for Club Selection with Arrow Animation
const MultiButton: React.FC<MultiButtonProps> = ({ club, label, icon, isSelected, onSelect, onGoToHome, colors }) => {
  const arrowAnimation = useRef(new Animated.Value(0)).current;

  const animateArrow = () => {
    Animated.sequence([
      Animated.timing(arrowAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(arrowAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNamePress = () => {
    animateArrow();
    onSelect();
  };

  const arrowTranslateX = arrowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 5],
  });

  const arrowScale = arrowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const displayText = label || club?.clubName || '';
  const showArrow = !!onGoToHome && !!club;

  return (
    <View style={{ 
      flexDirection: 'row',
      borderRadius: 20,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
      // Shadow for iOS
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      // Shadow for Android
      elevation: 6,
    }}>
      {/* Main Button Part */}
      <TouchableOpacity
        onPress={handleNamePress}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          backgroundColor: isSelected ? colors.button : colors.primary,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          gap: 6,
        }}
      >
        {icon && (
          <ThemedIcon 
            name={icon}
            size={16} 
            color={isSelected ? 'white' : colors.text}
          />
        )}
        <ThemedText style={{ 
          fontWeight: isSelected ? 'bold' : 'normal',
          color: isSelected ? 'white' : colors.text
        }}>
          {displayText}
        </ThemedText>
      </TouchableOpacity>

      {/* Arrow Part - Only for club buttons */}
      {showArrow && (
        <TouchableOpacity
          onPress={onGoToHome}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            backgroundColor: colors.primary,
            borderLeftWidth: 1,
            borderLeftColor: colors.border,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Animated.View
            style={{
              transform: [
                { translateX: arrowTranslateX },
                { scale: arrowScale }
              ]
            }}
          >
            <ThemedIcon 
              name="MaterialIcons:arrow-forward" 
              size={18} 
              color={colors.text}
            />
          </Animated.View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MultiButton;
