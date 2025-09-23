import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { ReactNode } from "react";
import ShadowBox from "./ShadowBox";
import ThemedIcon from "./themed-components/ThemedIcon";
import { useTheme } from "../hooks/use-theme";
import ThemedText from "./themed-components/ThemedText";

const TouchableCard = (props: {
  id?: any;
  style?: any;
  children: ReactNode | undefined;
  onPress?: any;
  rightComponent?: ReactNode | null | undefined;
  icon?: any;
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={() => props.onPress && props.onPress(props.id)}>
      <ShadowBox style={{ ...styles.container, ...props.style }}>
        {props.children}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {props.rightComponent}
          {props.onPress &&
            (props.icon ? (
              props.icon
            ) : (
              <ThemedIcon name="MaterialCommunityIcons:chevron-right-circle" color={colors.nav} />
            ))}
        </View>
      </ShadowBox>
    </TouchableOpacity>
  );
};

export default TouchableCard;

const styles = StyleSheet.create({
  container: {
    width: "85%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
