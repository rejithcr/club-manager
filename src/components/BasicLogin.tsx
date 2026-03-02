import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ThemedButton from '@/src/components/ThemedButton';
import InputText from '@/src/components/InputText';
import Spacer from '@/src/components/Spacer';
import { showSnackbar } from '@/src/components/snackbar/snackbarService';

interface BasicLoginProps {
  onLogin: (email: string, password: string) => void;
  isLoading?: boolean;
}

export default function BasicLogin({ onLogin, isLoading = false }: BasicLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      showSnackbar("Please enter both email and password", "error");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showSnackbar("Please enter a valid email address", "error");
      return;
    }

    onLogin(email, password);
  };

  return (
    <View style={styles.container}>
      <InputText
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        editable={!isLoading}
      />
      <Spacer space={5} />
      <InputText
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />
      <Spacer space={12} />
      <ThemedButton 
        title="Login" 
        onPress={handleLogin}
        disabled={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
