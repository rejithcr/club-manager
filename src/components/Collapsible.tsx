import { TouchableOpacity, View } from "react-native";
import React from "react";
import ThemedIcon from "./themed-components/ThemedIcon";
import { useTheme } from "../hooks/use-theme";
import RoundedContainer from "./RoundedContainer";

const Collapsible = (props: { children: any; header: React.ReactNode }) => {
  const [collapsed, setCollpsed] = React.useState(true);
  const { colors } = useTheme();
  return (
    <View>
      <RoundedContainer>
        <TouchableOpacity
          onPress={() => setCollpsed((prev) => !prev)}
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 15, paddingHorizontal: 20
          }}
        >
          <ThemedIcon
            size={20}
            name={
              !collapsed ? "MaterialCommunityIcons:chevron-down-circle" : "MaterialCommunityIcons:chevron-right-circle"
            }
            color={colors.nav}
          />
          {props.header}
        </TouchableOpacity>
      </RoundedContainer>
      {!collapsed && <View>{props.children}</View>}
    </View>
  );
};

export default Collapsible;
