import { colors } from "../utils/styles";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useTheme = () => {
  const { theme, setTheme } = useContext(ThemeContext)
  const colorScheme = useColorScheme()
  const [themeColors, setThemeColors] = useState(colorScheme ? colors[colorScheme] : colors.light)

  useEffect(() => {
    if (theme) {
      AsyncStorage.setItem("theme", theme);
      if (theme === "system") {
        setThemeColors(colorScheme ? colors[colorScheme] : colors.light)
      } else if (theme === "dark") {
        setThemeColors(colors["dark"])
      } else {
        setThemeColors(colors["light"])
      }
    }
  }, [theme, colorScheme])

  useEffect(() => {
    AsyncStorage.getItem("theme")
      .then(storedTheme => storedTheme ? setTheme(storedTheme) : setTheme("system"))
  }, [])

  return {
    theme,
    colors: themeColors
  }
}