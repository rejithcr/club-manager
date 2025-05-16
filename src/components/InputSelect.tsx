import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Picker } from '@react-native-picker/picker'

const InputSelect = (props: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{props.label || props.placeholder}</Text>
      <Picker {...props}>
        {props.children}
      </Picker>
    </View>
  )
}

export default InputSelect

const styles = StyleSheet.create({
  container: {
    width: "80%",
    alignSelf: "center",
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    margin: 10
  },
  label: {
    fontSize: 10
  },
  input: {
    width: "100%",
    fontSize: 15,
    height: 35,
  }
})