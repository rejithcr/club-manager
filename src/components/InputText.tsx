import { View, TextInput, Text, StyleSheet } from 'react-native'
import React from 'react'
import ThemedText from './themed-components/ThemedText';
import { useTheme } from '../hooks/use-theme';
import ThemedView from './themed-components/ThemedView';

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
    
        const { colors } = useTheme();
        
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>{props.label || props.placeholder }</ThemedText>
      <TextInput style={{color:colors.text, ...styles.input}} {...props} onChangeText={props.onChangeText} />
    </ThemedView>
  )
}

export default InputText

const styles = StyleSheet.create({
  container:{
    width: "80%",
    alignSelf: "center",
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    margin: 10,
    
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