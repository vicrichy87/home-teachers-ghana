import React from 'react';
import { SafeAreaView, ScrollView, Text, StyleSheet } from 'react-native';
import Banner from './Banner'; // Banner.js is in the same folder

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Sticky Banner at the top */}
      <Banner />

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Welcome to Home Teachers Ghana!</Text>
        <Text style={styles.paragraph}>
          Connecting students and teachers across Ghana for better education.
        </Text>
        <Text style={styles.paragraph}>
          Use this app to find qualified teachers, schedule lessons, and
          manage your learning journey with ease.
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
    color: '#004aad', // deep blue to match banner
    marginBottom: 15,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
    marginBottom: 10,
  },
});
