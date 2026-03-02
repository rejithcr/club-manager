import { TextInput, StyleSheet, View, Animated } from 'react-native'
import React, { useState, useRef } from 'react'
import ThemedText from './themed-components/ThemedText';
import { useTheme } from '../hooks/use-theme';
import ThemedView from './themed-components/ThemedView';

const InputText = (props: {
  label?: string;
  placeholder?: string;
  defaultValue?: any;
  value?: any;
  keyboardType?: any;
  ref?: any;
  onSubmitEditing?: any;
  editable?: boolean;
  onChangeText?: any;
  blurOnSubmit?: any;
  multiline?: boolean;
  error?: string;
  secureTextEntry?: boolean;
  style?: any;
  containerStyle?: any;
}) => {

  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const animatedBorder = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedBorder, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(animatedBorder, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = animatedBorder.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.button],
  });

  const isDisabled = props.editable === false;

  return (
    <ThemedView style={{ ...styles.container, ...props.containerStyle }}>
      {props.label && (
        <ThemedText style={{ ...styles.label, color: colors.subText }}>
          {props.label}
        </ThemedText>
      )}

      <Animated.View style={[
        styles.inputContainer,
        {
          backgroundColor: colors.primary,
          borderColor: props.error ? colors.error : borderColor,
          opacity: isDisabled ? 0.6 : 1,
        },
        props.style
      ]}>
        <TextInput
          style={{
            ...styles.input,
            color: isDisabled ? colors.disabled : colors.text,
            height: props.multiline ? 80 : 50
          }}
          {...props}
          onChangeText={props.onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={colors.disabled}
          multiline={props.multiline}
          textAlignVertical={props.multiline ? 'top' : 'center'}
          secureTextEntry={props.secureTextEntry}
        />
      </Animated.View>

      {props.error && (
        <ThemedText style={{ ...styles.errorText, color: colors.error }}>
          {props.error}
        </ThemedText>
      )}
    </ThemedView>
  )
}

export default InputText

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
    marginVertical: 8
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  inputContainer: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
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
  input: {
    width: "100%",
    fontSize: 16,
    margin: 0,
    padding: 0,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
})