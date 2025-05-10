import { ClubContext } from '@/src/context/ClubContext';
import { Stack } from 'expo-router';
import React, { useContext } from "react";
import {Text, View} from 'react-native'

export default function FeesLayout() {
  const { clubInfo } = useContext(ClubContext)

  return (
    <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            headerTitle: () => <FeeHeader header={"Fees"} clubName={clubInfo?.clubName} />,
            headerShown: true
          }}
        />
        <Stack.Screen
          name="clubdues" // This is the name of the page and must match the url from root
          options={{
            headerTitle: () => <FeeHeader header={"Club Dues"} clubName={clubInfo?.clubName} />,
            headerShown: true
          }}
        />
        <Stack.Screen
          name="payments" // This is the name of the page and must match the url from root
          options={{
            headerTitle: () => <FeeHeader header={"Fee Payment"} clubName={clubInfo?.clubName} />,
            headerShown: true
          }}
        />
        <Stack.Screen
          name="startcollection" // This is the name of the page and must match the url from root
          options={{
            headerTitle: () => <FeeHeader header={"Start Collection"} clubName={clubInfo?.clubName} />,
            headerShown: true
          }}
        />
        <Stack.Screen
          name="definefee" // This is the name of the page and must match the url from root
          options={{
            headerTitle: () => <FeeHeader header={"Define Fee"} clubName={clubInfo?.clubName} />,
            headerShown: true
          }}
        />
        <Stack.Screen
          name="feetypedetails" // This is the name of the page and must match the url from root
          options={{
            headerTitle: () => <FeeHeader header={"Fee Type"} clubName={clubInfo?.clubName} />,
            headerShown: true
          }}
        />
        <Stack.Screen
          name="exception/addfeeexception" // This is the name of the page and must match the url from root
          options={{
            headerTitle: () => <FeeHeader header={"Add Fee Exception"} clubName={clubInfo?.clubName} />,
            headerShown: true
          }}
        />
        <Stack.Screen
          name="exception/editfeeexception" // This is the name of the page and must match the url from root
          options={{
            headerTitle: () => <FeeHeader header={"Edit Fee Exception"} clubName={clubInfo?.clubName} />,
            headerShown: true
          }}
        />
        <Stack.Screen
          name="editfeetype" // This is the name of the page and must match the url from root
          options={{
            headerTitle: () => <FeeHeader header={"Edit Fee type"} clubName={clubInfo?.clubName} />,
            headerShown: true
          }}
        />
        <Stack.Screen
          name="adhocfee/definefee" // This is the name of the page and must match the url from root
          options={{
            headerTitle: () => <FeeHeader header={"Adhoc fee"} clubName={clubInfo?.clubName} />,
            headerShown: true
          }}
        />
        <Stack.Screen
          name="adhocfee/payments" // This is the name of the page and must match the url from root
          options={{
            headerTitle: () => <FeeHeader header={"Adhoc fee payments"} clubName={clubInfo?.clubName} />,
            headerShown: true
          }}
        />
      </Stack>
  )
}

const FeeHeader = (props: { header: string | undefined; clubName: string | null; }) => {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>{props.header}</Text>
      <Text>{props.clubName}</Text>
    </View>
  )
}