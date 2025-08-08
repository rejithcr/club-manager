import React, { useEffect, useRef } from "react";
import {
  Animated,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import { SnackbarType } from "./snackbarService";
import { useTheme } from "@/src/hooks/use-theme";

const AUTO_HIDE = 3500;
const ANIM_DURATION = 250;

export default function SnackbarItem({
  text,
  type,
  onHide
}: {
  id: string;
  text: string;
  type: SnackbarType;
  onHide: () => void;
  index?: number;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;
  const timerRef = useRef<number | null>(null);
  const { colors } = useTheme();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: ANIM_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: ANIM_DURATION,
        useNativeDriver: true,
      }),
    ]).start();

    // auto hide
    timerRef.current = global.setTimeout(() => {
      hide();
    }, AUTO_HIDE);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hide = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: ANIM_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 10,
        duration: ANIM_DURATION,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) onHide();
    });
  };

  const background =
    type === "success"
      ? colors.success
      : type === "error"
      ? colors.error
      : type === "warning"
      ? colors.warning
      : colors.info;

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity,
          transform: [{ translateY }],
          // small vertical offset so stacked items don't overlap visually
          marginBottom: 6,
        },
      ]}
    >
      <View style={[styles.container, { backgroundColor: background }]}>
        <Text style={styles.text} numberOfLines={3}>
          {text}
        </Text>
        <TouchableOpacity onPress={hide} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.close}>×</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: "80%",
    maxWidth: 900,
  },
  text: {
    color: "#fff",
    flex: 1,
    fontSize: 14,
  },
  close: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 12,
  },
});
