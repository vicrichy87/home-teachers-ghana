import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Banner() {
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>Home Teachers Ghana</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    backgroundColor: '#004aad', // deep blue
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4, // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
