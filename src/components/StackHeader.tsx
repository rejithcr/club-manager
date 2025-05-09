import { View, Text } from "react-native";

export const StackHeader = (props: { header: string | undefined; clubName: string | null; }) => {
  return (
    <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
      <Text style={{fontSize:20, fontWeight:"bold"}}>{props.header}</Text>
      <Text>{props.clubName}</Text>
    </View>
  )
}