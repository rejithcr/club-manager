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
    success: "#5ac983",
    button: "#007acc",
    nav: "#000000",
    add: "#5ac983",
    heading: "#5ac983",
  },
  dark:{
    statusbar: "light",
    primary: "#333333",
    secondary: "#252526",
    background: "#1e1e1e",
    text: "#ffffff",
    error: "#ff6b6b",
    warning: "#fdb924",
    disabled: "#869c98",
    success: "#5ac983",
    button: "#007acc",
    nav: "#ffffff", //"#007acc",
    add: "#5ac983",
    heading: "#5ac983",
  }
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
        flexWrap:"wrap",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        borderRadius: 5
    },
    centerItems: {
        flex: 1,
        justifyContent: "center"
    },
    centerify: {flex:1, alignItems:"center", justifyContent:"center"}
})
