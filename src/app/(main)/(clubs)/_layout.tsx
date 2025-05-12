import { StackHeader } from '@/src/components/StackHeader';
import { ClubContext } from '@/src/context/ClubContext';
import { Stack } from 'expo-router';
import React, { useContext } from "react";

export default function ClubLayout() {
  const { clubInfo } = useContext(ClubContext)
  return (
      <Stack>
        <Stack.Screen name="index" options={{title: 'My Clubs', headerShown:true}}/>     
        <Stack.Screen
          name="clubdetails" // This is the name of the page and must match the url from root
          options={{
            headerTitle: () => <StackHeader header={"Club details"} clubName={clubInfo?.clubName} />,
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
        <Stack.Screen
          name="(attendance)" // This is the name of the page and must match the url from root
          options={{
            title: 'Attendance',
            headerShown:false
          }}
        />              
        <Stack.Screen
          name="(transactions)" // This is the name of the page and must match the url from root
          options={{
            title: 'Transactions',
            headerShown:false
          }}
        />   
      </Stack>
  )
}
