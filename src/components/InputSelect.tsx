import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Picker } from '@react-native-picker/picker'
import { useTheme } from '../hooks/use-theme';
import ThemedText from './themed-components/ThemedText';
import ThemedView from './themed-components/ThemedView';

const InputSelect = (props: any) => {
  const { colors } = useTheme();
  
  return (
    <ThemedView style={{...styles.container, marginVertical: props.style?.marginVertical || 8, width: props.style?.width || "90%"}}>
      {props.label && (
        <ThemedText style={{...styles.label, color: colors.subText }}>
          {props.label}
        </ThemedText>
      )}
      
      <View style={{
        ...styles.pickerContainer,
          backgroundColor: colors.primary,
          borderColor: colors.border,
      }}>
        <Picker 
          {...props}
          style={{...styles.picker, backgroundColor: colors.primary, color: colors.text, height: props.style?.height || 50}}
          dropdownIconColor={colors.subText}
        >
          {props.children}
        </Picker>
      </View>
      
      {props.error && (
        <ThemedText style={{...styles.errorText, color: colors.error }}>
          {props.error}
        </ThemedText>
      )}
    </ThemedView>
  )
}

export default InputSelect

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: "transparent",
    marginVertical: 8
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  pickerContainer: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 12,
    // React Native shadow properties
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    // Android shadow
    elevation: 1,
  },
  picker: {
    height: 50,
    borderColor: "transparent",
    borderWidth: 0,
    fontSize: 15,
    // width: "100%",
    // height: 50,
    // border: "none"
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
})