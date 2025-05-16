import { View } from "react-native";
import ThemedText from "./themed-components/ThemedText";

export const StackHeader = (props: { header: string | undefined; rightText?: string | null | undefined; }) => {
  
  return (
    <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
      <ThemedText style={{fontSize:20, fontWeight:"bold"}}>{props.header}</ThemedText>
      <ThemedText>{props?.rightText}</ThemedText>
    </View>
  )
}