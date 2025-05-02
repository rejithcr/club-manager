import { Stack } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';
import React, { useEffect } from "react";
import {Text, View} from 'react-native'

export default function FeesLayout() {
  const params = useSearchParams()

  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="index" // This is the name of the page and must match the url from root
        options={{
          headerTitle: (props) => <FeeHeader header={"Fees"} clubName={params.get("clubName")} />,
          headerShown:true
        }}
      />      
      <Stack.Screen
        name="clubdues" // This is the name of the page and must match the url from root
        options={{
          headerTitle: (props) => <FeeHeader header={"Club Dues"} clubName={params.get("clubName")} />,
          headerShown:true
        }}
      />      
      <Stack.Screen
        name="payments" // This is the name of the page and must match the url from root
        options={{
          headerTitle: (props) => <FeeHeader header={"Fee Payment"} clubName={params.get("clubName")} />,
          headerShown:true
        }}
      />     
      <Stack.Screen
        name="startcollection" // This is the name of the page and must match the url from root
        options={{
          headerTitle: (props) => <FeeHeader header={"Start Collection"} clubName={params.get("clubName")} />,
          headerShown:true
        }}
      />     
      <Stack.Screen
        name="definefee" // This is the name of the page and must match the url from root
        options={{
          headerTitle: (props) => <FeeHeader header={"Define Fee"} clubName={params.get("clubName")} />,
          headerShown:true
        }}
      />     
      <Stack.Screen
        name="feetypedetails" // This is the name of the page and must match the url from root
        options={{
          headerTitle: (props) => <FeeHeader header={"Fee Type"} clubName={params.get("clubName")} />,
          headerShown:true
        }}
      />     
      <Stack.Screen
        name="exception/addfeeexception" // This is the name of the page and must match the url from root
        options={{
          headerTitle: (props) => <FeeHeader header={"Add Fee Exception"} clubName={params.get("clubName")} />,
          headerShown:true
        }}
      />     
      <Stack.Screen
        name="exception/editfeeexception" // This is the name of the page and must match the url from root
        options={{
          headerTitle: (props) => <FeeHeader header={"Edit Fee Exception"} clubName={params.get("clubName")} />,
          headerShown:true
        }}
      />     
    </Stack>
  )
}

const FeeHeader = (props: { header: string | undefined; clubName: string | null; }) => {
  return (
    <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
      <Text style={{fontSize:20, fontWeight:"bold"}}>{props.header}</Text>
      <Text>{props.clubName}</Text>
    </View>
  )
}