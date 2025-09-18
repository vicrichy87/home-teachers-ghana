import React, { useState } from 'react';
import { SafeAreaView, ScrollView, TextInput, Button, Text, StyleSheet } from 'react-native';
import Banner from './Banner';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: Add Supabase authentication logic here
    console.log('Logging in with:', email, password);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Banner />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Button title="Login" onPress={handleLogin} color="#004aad" />

        <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
          Don’t have an account? Register
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#004aad',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  link: {
    marginTop: 15,
    fontSize: 16,
    color: '#004aad',
    textAlign: 'center',
  },
});
