import { View } from "react-native";
import ThemedText from "./themed-components/ThemedText";

export const StackHeader = (props: { header: string | undefined; rightText?: string | null | undefined; }) => {
  
  return (
    <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
      <View>
      <ThemedText style={{fontSize:20, fontWeight:"bold"}}>{props.header}</ThemedText>
      {props?.rightText && <ThemedText style={{fontSize:12}} >{props?.rightText}</ThemedText>}
      </View>
    </View>
  )
}