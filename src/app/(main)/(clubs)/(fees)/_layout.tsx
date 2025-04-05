import { Stack } from 'expo-router';
import React from "react";

export default function FeesLayout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="index" // This is the name of the page and must match the url from root
        options={{
          title: 'Fees',
          headerShown:true
        }}
      />      
      <Stack.Screen
        name="clubdues" // This is the name of the page and must match the url from root
        options={{
          title: 'Club Dues',
          headerShown:true
        }}
      />      
      <Stack.Screen
        name="payments" // This is the name of the page and must match the url from root
        options={{
          title: 'Fee Payment',
          headerShown:true
        }}
      />     
    </Stack>
  )
}
