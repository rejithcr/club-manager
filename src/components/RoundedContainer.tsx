import React from "react";
import ThemedView from "./themed-components/ThemedView";
import { useTheme } from "../hooks/use-theme";
import { borderRadius } from "../utils/styles";

const RoundedContainer = (props: any) => {
  const { colors } = useTheme();
  return (
    <ThemedView
      style={{
        alignSelf: "center",
        width: "85%",
        backgroundColor: colors.primary,
        borderRadius,
        paddingVertical: 5,
        border: `1px solid ${colors.border}`,
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      }}
    >
      {props.children}
    </ThemedView>
  );
};

export default RoundedContainer;
