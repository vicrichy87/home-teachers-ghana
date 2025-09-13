import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Welcome to Home!</Text>
      <Text style={styles.subtitle}>You are logged in successfully.</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#007bff', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#555', marginBottom: 30 },
  button: { backgroundColor: '#dc3545', padding: 15, borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
