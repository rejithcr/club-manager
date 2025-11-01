import React from "react";
import ThemedView from "./themed-components/ThemedView";
import { useTheme } from "../hooks/use-theme";
import { sizes } from "../utils/styles";

const RoundedContainer = (props: any) => {
  const { colors } = useTheme();
  if (props.visible === false) {
    return <>{props.children}</>;
  }  
  return (
    <ThemedView
      style={{
        alignSelf: "center",
        width: "85%",
        backgroundColor: colors.primary,
        borderRadius: sizes.borderRadius,
        paddingVertical: 5,
        border: `1px solid ${colors.border}`,
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        // Shadow for Android
        elevation: 6,
        ...props.style,
      }}
    >
      {props.children}
    </ThemedView>
  );
};

export default RoundedContainer;
