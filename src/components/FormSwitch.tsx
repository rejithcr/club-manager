import { View, Switch } from "react-native";
import React from "react";
import ThemedText from "./themed-components/ThemedText";

const FormSwitch = (props: any) => {
  return (
    <View style={{ flexDirection: "row", paddingVertical: 10, alignItems: "center", justifyContent: "space-between", width: "80%", alignSelf:"center"}}>
      <ThemedText>{props.label}</ThemedText>
      <Switch {...props} />
    </View>
  );
};

export default FormSwitch;
