import { View, TouchableOpacity, GestureResponderEvent } from "react-native";
import React from "react";
import { appStyles } from "../utils/styles";
import ThemedText from "./themed-components/ThemedText";
import { useTheme } from "../hooks/use-theme";
import ThemedIcon from "./themed-components/ThemedIcon";
import ThemedView from "./themed-components/ThemedView";

const KeyValueTouchableBox = (props: {
  onPress: ((event: GestureResponderEvent) => void) | undefined;
  edit?: boolean;
  goto?: boolean;
  keyName: string | null | undefined;
  keyValue: string | number | null | undefined;
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View
        style={{
          width: "100%",
          flexWrap: "wrap",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingVertical: 10
        }}
      >
        <ThemedText numberOfLines={1} style={{ fontSize: 16}}>
          {props.keyName}
        </ThemedText>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
          <ThemedText style={{ fontSize: 16, textAlign: "right" }}>{props.keyValue} </ThemedText>
          <ThemedIcon
            style={{ paddingLeft: 5 }}
            name={
              props.edit ? "MaterialCommunityIcons:square-edit-outline" : "MaterialCommunityIcons:chevron-right-circle"
            }
            color={props.edit ? colors.warning : colors.nav}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default KeyValueTouchableBox;
