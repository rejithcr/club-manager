import { View, Image } from "react-native";
import ThemedText from "./themed-components/ThemedText";
import { useTheme } from "../hooks/use-theme";

export const StackHeader = (props: { header: string | undefined; rightText?: string | null | undefined; logo?: string | null | undefined }) => {
  const { colors } = useTheme();

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      {props.logo && (
        <View style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          borderRadius: 25,
          marginRight: 15,
          marginVertical: 5
        }}>
          <View style={{
            borderWidth: 4,
            borderColor: colors.primary,
            borderRadius: 25,
            padding: 2,
            backgroundColor: colors.background,
          }}>
            <Image
              source={{ uri: props.logo }}
              style={{ width: 36, height: 36, borderRadius: 18 }}
            />
          </View>
        </View>
      )}
      <View style={{ marginRight: 10 }}>
        <ThemedText style={{ fontSize: 20, fontWeight: "bold" }}>{props.header}</ThemedText>
        {props?.rightText && <ThemedText style={{ fontSize: 12 }} >{props?.rightText}</ThemedText>}
      </View>
    </View>
  )
}