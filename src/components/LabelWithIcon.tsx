import { View, Text } from "react-native";
import React from "react";
import ThemedIcon from "./themed-components/ThemedIcon";
import { useTheme } from "../hooks/use-theme";
import ThemedText from "./themed-components/ThemedText";

const LabelWithIcon = (props: { icon?: string; size?: number; color?: string, text: string, iconSize?: number, textSize?: number }) => {
  const { colors } = useTheme();

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View
        style={{
          width: props.iconSize || 32,
          height: props.iconSize || 32,
          borderRadius: 50,
          paddingLeft: 5,
          backgroundColor: (props.color || colors.secondary) + "30",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 8,
        }}
      >
        <ThemedIcon name={props.icon || "Octicons:info"} size={(props.iconSize || 32)/2} color={props.color || colors.text} />
      </View>
      <ThemedText
        style={{
          fontSize: props.textSize || 14,
          color: colors.text,
          flex: 1,
        }}
      >
        {props.text}
      </ThemedText>
    </View>
  );
};

export default LabelWithIcon;
