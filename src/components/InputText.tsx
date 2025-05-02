import { View, TextInput, Text, StyleSheet } from 'react-native'
import React from 'react'

const InputText = (props: { 
  label?: string; 
  placeholder?: string; 
  defaultValue?: any; 
  keyboardType?: any;
  ref?: any; 
  onSubmitEditing?: any; 
  editable?: boolean;
  onChangeText?: any;
  blurOnSubmit?: any }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{props.label || props.placeholder }</Text>
      <TextInput style={styles.input} {...props} onChangeText={props.onChangeText} />
    </View>
  )
}

export default InputText

const styles = StyleSheet.create({
  container:{
    width: "80%",
    alignSelf: "center",
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    margin: 10
  },
  label:{
    fontSize: 10
  },
  input: {
    width: "100%",
    fontSize: 15,
    height: 40
  }
})