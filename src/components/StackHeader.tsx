import { View, Image, TouchableOpacity, Dimensions, Platform } from "react-native";
import ThemedText from "./themed-components/ThemedText";
import { useTheme } from "../hooks/use-theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGetUnreadNotificationCountQuery } from "../services/memberApi";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useRouter } from "expo-router";

const { width } = Dimensions.get('window');

export const StackHeader = (props: {
  header: string | undefined;
  rightText?: string | null | undefined;
  logo?: string | null | undefined;
  hideNotificationIcon?: boolean;
}) => {
  const { colors } = useTheme();
  const { userInfo } = useContext(UserContext);
  const router = useRouter();

  const { data: unreadData } = useGetUnreadNotificationCountQuery(
    { memberId: userInfo?.memberId },
    { skip: !userInfo?.memberId }
  );

  const unreadCount = unreadData?.unreadCount || 0;

  const getHeaderWidth = () => {
    if (props.header == 'Club Manager') {
      return width - 35;
    } else {
      return Platform.OS == 'web' ? width - 75 : width - 100;
    }
  };
  return (
    <View style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      height: 60,
      backgroundColor: colors.background,
      width: getHeaderWidth()
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
        {!props.hideNotificationIcon && (
          <TouchableOpacity onPress={() => router.push("/(main)/notifications")}>
            <View>
              <MaterialCommunityIcons name="bell-outline" size={22} color={colors.text} />
              {unreadCount > 0 && (
                <View style={{
                  position: 'absolute',
                  right: -6,
                  top: -6,
                  backgroundColor: colors.error,
                  borderRadius: 10,
                  width: 18,
                  height: 18,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: colors.background
                }}>
                  <ThemedText style={{
                    color: 'white',
                    fontSize: 10,
                    fontWeight: 'bold',
                  }}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </ThemedText>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
        {/* <TouchableOpacity>
          <MaterialIcons name="menu" size={24} color={colors.text} />
        </TouchableOpacity>*/}
      </View>
    </View>
  );
};