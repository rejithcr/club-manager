import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import InputText from '@/src/components/InputText';
import ThemedButton from '@/src/components/ThemedButton';
import { MaterialIcons } from '@expo/vector-icons';
import { useSearchParams } from 'expo-router/build/hooks';
import ThemedView from '@/src/components/themed-components/ThemedView';

const MemberAttributes = () => {
  const [inputs, setInputs] = useState(['1']);
  const [values, setValues] = useState<any>({});
  const inputRef = useRef(1)
  const params = useSearchParams()

  useEffect(()=> {
    
  },[])

  const addInput = () => {
    inputRef.current  = inputRef.current + 1
    setInputs(prev => [...prev, `${inputRef.current + 1}`]);
  };

  const removeInput = (inputToRemove: string) => {
    setInputs(inputs.filter(input => input !== inputToRemove));
    const { [inputToRemove]: removedValue, ...remainingValues } = values;
    setValues(remainingValues);
  };

  const handleInputChange = (inputName: string, text: string) => {
    setValues({ ...values, [inputName]: text });
  };

  const handleSubmit = () => {
    console.log('Form values:', values);
  };

  return (
    <ThemedView style={{ flex: 1 }}>
    <ScrollView>
      <Text style={{textAlign:"right",margin: 15}}>{params.get("clubName")}</Text>
      <View>
        {inputs.map((input, _) => (
          <View key={input} style={styles.attributeContainer}>
            <View style={styles.input}>
              <InputText
                onChangeText={(text: string) => handleInputChange(input, text)}
                //value={values[input] || ''}
                label={`Enter text for ${input}`}
              />
            </View>
            {inputs.length > 1 && (
              <TouchableOpacity style={styles.icon} onPress={() => removeInput(input)}>
                <MaterialIcons name={"delete"} size={25} />
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity style={{ alignSelf: "center" }} onPress={addInput}>
          <MaterialIcons name={"add-circle"} size={50} />
        </TouchableOpacity>
        <View style={{marginBottom: 30}}/>
        <ThemedButton title="Submit" onPress={handleSubmit} />
      </View>
    </ScrollView>
    </ThemedView>
  );
};


export default MemberAttributes


const styles = StyleSheet.create({
  attributeContainer: {
    width: "80%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center"
  },
  icon: {
    width: "10%",
  },
  input: {
    width: "90%",
  }
});