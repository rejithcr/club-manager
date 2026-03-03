import { View, Image, TouchableOpacity, Dimensions } from "react-native";
import ThemedText from "./themed-components/ThemedText";
import { useTheme } from "../hooks/use-theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

export const StackHeader = (props: {
  header: string | undefined;
  rightText?: string | null | undefined;
  logo?: string | null | undefined
}) => {
  const { colors } = useTheme();

  return (
    <View style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      height: 60,
      backgroundColor: colors.background,
      width: width - 32
    }}>
      {/* Left side: Breadcrumbs */}
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        {props.logo && (
          <Image
            source={{ uri: props.logo }}
            style={{ width: 24, height: 24, borderRadius: 4, marginRight: 8 }}
          />
        )}

        <View>
          <ThemedText style={{ fontSize: 16, fontWeight: "600", color: colors.text }}>
            {props.header}
          </ThemedText>
          {props.rightText && (
            <ThemedText style={{ fontSize: 11, color: colors.subText }} numberOfLines={1}>
              {props.rightText}
            </ThemedText>
          )}
        </View>
      </View>

      {/* Right side: Utilities */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        <TouchableOpacity>
          <MaterialCommunityIcons name="bell-outline" size={22} color={colors.text} />
        </TouchableOpacity>
        {/* <TouchableOpacity>
          <MaterialIcons name="menu" size={24} color={colors.text} />
        </TouchableOpacity>*/}
      </View>
    </View>
  );
};