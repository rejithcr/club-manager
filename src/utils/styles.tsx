import { StyleSheet } from "react-native"


export const colors = {
  light: {
    statusbar: "dark",
    primary: "#ffffff",
    secondary: "#03dac6",
    background: "#f5f5f5",
    text: "#000000",
    error: "#b00020",
    warning: "#fdb924",
    disabled: "#869c98",
    success: "#16a149",
    button: "#007acc",
    info: "#007acc",
    nav: "#000000",
    add: "#5ac983",
    heading: "#111827", // Darker for modern look
    border: "#e5e7eb", // Subtle gray border
    subText: "#6b7280", // Standard gray subtext
    card: "#ffffff",
    muted: "#f3f4f6",
  },
  dark: {
    statusbar: "light",
    primary: "#333333",
    secondary: "#252526",
    background: "#111827", // Deep navy/black
    text: "#ffffff",
    error: "#ff6b6b",
    warning: "#fdb924",
    disabled: "#374151",
    success: "#10b981",
    button: "#3b82f6",
    info: "#3b82f6",
    nav: "#ffffff",
    add: "#10b981",
    heading: "#f9fafb",
    border: "#374151",
    subText: "#9ca3af",
    card: "#1f2937",
    muted: "#374151",
  }
}

export const sizes = {
  borderRadius: 12, // More modern, slightly less rounded than 25
  textFontSize: 14, // Denser text
  headerFontSize: 24,
  subHeaderFontSize: 18,
  subTextFontSize: 12,
  padding: 16,
}

export const appStyles = StyleSheet.create({
  title: {
    marginVertical: 10,
    fontWeight: "bold",
    fontSize: 25,
    width: "90%",
    alignSelf: "center",
  },
  heading: {
    marginVertical: 10,
    fontWeight: "bold",
    fontSize: 20,
    width: "90%",
    alignSelf: "center",
  },
  shadowBox: {
    padding: 10,
    flexDirection: "row",
    borderColor: "#eee",
    alignSelf: "center",
    alignItems: "center",
    flexWrap: "wrap",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    borderRadius: 5
  },
  centerItems: {
    flex: 1,
    justifyContent: "center"
  },
  centerify: { flex: 1, alignItems: "center", justifyContent: "center" }
})
