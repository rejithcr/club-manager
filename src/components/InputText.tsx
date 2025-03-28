import { View, TextInput, StyleSheet } from 'react-native'
import React from 'react'

const InputText = (props: { 
  placeholder: string; 
  value?: string; 
  ref?: any; 
  onSubmitEditing?: any; 
  blurOnSubmit?: any }) => {
  return (
    <View>
      <TextInput style={styles.input} {...props} />
    </View>
  )
}

export default InputText

const styles = StyleSheet.create({
  input: {
    width: "80%",
    fontSize: 15,
    height: 40,
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    alignSelf: "center",
    margin: 10,
    paddingLeft: 5
  }
})