import { StyleSheet } from "react-native"

export const appStyles = StyleSheet.create({
    title: {
        margin: 20,
        fontWeight: "bold",
        fontSize: 25,
        width: "80%",
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
    },
    centerItems: {
        flex: 1,
        justifyContent: "center"
    },
    centerify: {flex:1, alignItems:"center", justifyContent:"center"}
})