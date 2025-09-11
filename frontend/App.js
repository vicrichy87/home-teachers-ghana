import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { supabase } from './lib/supabase';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Teachers Ghana - MVP</Text>
      <Text style={styles.text}>This is a minimal starter app. Replace supabase keys in lib/supabase.ts</Text>
      <Button title="Open Demo" onPress={() => alert('Demo placeholder')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, alignItems:'center', justifyContent:'center', padding:20 },
  title: { fontSize:22, fontWeight:'700', marginBottom:12 },
  text: { fontSize:16, marginBottom:12 }
});
