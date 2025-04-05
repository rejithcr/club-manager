import { Stack } from 'expo-router';
import React from "react";

export default function ClubLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index" // This is the name of the page and must match the url from root
        options={{
          title: 'My Clubs',
          headerShown:true
        }}
      />     
      <Stack.Screen
        name="clubdetails" // This is the name of the page and must match the url from root
        options={{
          title: 'Clubs details',
          headerShown:true
        }}
      />     
      <Stack.Screen
        name="createclub" // This is the name of the page and must match the url from root
        options={{
          title: 'Create new club',
          headerShown:true
        }}
      />              
      <Stack.Screen
        name="(fees)" // This is the name of the page and must match the url from root
        options={{
          title: 'Fees',
          headerShown:false
        }}
      />       
    </Stack>
  )
}
