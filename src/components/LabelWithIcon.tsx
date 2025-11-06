import { View, Text } from "react-native";
import React from "react";
import ThemedIcon from "./themed-components/ThemedIcon";
import { useTheme } from "../hooks/use-theme";
import ThemedText from "./themed-components/ThemedText";

const LabelWithIcon = ({ icon, size = 40, color = "#007acc", label, text, iconSize = 20, textSize = 14 }: { icon?: string; size?: number; color?: string; label?: string; text: string; iconSize?: number; textSize?: number }) => {
  const { colors } = useTheme();
  return (
    <View style={{ 
            flexDirection: "row", 
            alignItems: "center"
          }}>
            <View style={{
              width: size,
              height: size,
              borderRadius: 20,
              backgroundColor: color + '20',
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: 4,
              marginRight: 8
            }}>
              <ThemedIcon name={icon || 'MaterialIcons:question-mark'} size={iconSize} color={color} />
            </View>
            <View>
              <ThemedText style={{ 
                fontSize: 12, 
                color: colors.subText,
                marginBottom: 2
              }}>
                {label}
              </ThemedText>
              <ThemedText style={{ 
                fontSize: textSize,
                fontWeight: '500',
                color: colors.text
              }}>
                {text}
              </ThemedText>
            </View>
          </View>
  );
};

export default LabelWithIcon;
