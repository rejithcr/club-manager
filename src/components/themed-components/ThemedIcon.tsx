import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';
import { useTheme } from '@/src/hooks/use-theme';
import ThemedText from './ThemedText';
import Spacer from '../Spacer';

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
  AntDesign
};

function getIconComponent(name: string) {  
  const [lib, iconName] = name.split(':');
  const IconComponent = iconMap[lib] || MaterialIcons;
  return { IconComponent, iconName: iconName || name };
}

const ThemedIcon: React.FC<IconProps & { text?: string, style?: any }> = ({ name, size = 20, style, color, onPress, text }) => {
  const { colors } = useTheme();
  const { IconComponent, iconName } = getIconComponent(name);

  return (
    <View style={{display:"flex", flexDirection:"row", ...style}}>
      <IconComponent name={iconName} size={size} color={color || colors.text} onPress={onPress} />
      <Spacer hspace={2} />
      {text && <ThemedText>{text}</ThemedText>}
    </View>
  );
};

export default ThemedIcon;