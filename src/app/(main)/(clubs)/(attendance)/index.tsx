import { View, Text } from 'react-native'
import React from 'react'
import ThemedView from '@/src/components/themed-components/ThemedView'
import ThemedText from '@/src/components/themed-components/ThemedText'

const Attendance = () => {
  return (
    <ThemedView style={{flex:1}}>
      <ThemedText>Attendance</ThemedText>
    </ThemedView>
  )
}

export default Attendance