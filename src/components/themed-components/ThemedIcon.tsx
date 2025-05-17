import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@/src/hooks/use-theme';

type IconProps = {
  name: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  color?: string;
  onPress?: () => void;
};

const iconMap: Record<string, any> = {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome,
};

function getIconComponent(name: string) {  
  const [lib, iconName] = name.split(':');
  const IconComponent = iconMap[lib] || MaterialIcons;
  return { IconComponent, iconName: iconName || name };
}

const ThemedIcon: React.FC<IconProps> = ({ name, size = 20, style, color, onPress }) => {
  const { colors } = useTheme();
  const { IconComponent, iconName } = getIconComponent(name);

  return (
    <View style={style}>
      <IconComponent name={iconName} size={size} color={color || colors.text} onPress={onPress} />
    </View>
  );
};

export default ThemedIcon;