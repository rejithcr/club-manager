import { View } from "react-native";
import React from "react";
import { useTheme } from "../hooks/use-theme";
import { sizes } from "../utils/styles";

const Banner = (props: { backgroundColor?: string | undefined; children: React.ReactNode }) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        paddingHorizontal: 25,
        paddingVertical: 15,
        backgroundColor: props.backgroundColor || colors.info,
        display: "flex",
        width: "85%",
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: sizes.borderRadius,
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      }}
    >
      {props.children}
    </View>
  );
};

export default Banner;
