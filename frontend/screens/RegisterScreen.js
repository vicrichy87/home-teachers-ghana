import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [sex, setSex] = useState('');
  const [dob, setDob] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [city, setCity] = useState('');
  const [userType, setUserType] = useState('');
  const [image, setImage] = useState(null);
  const [locationEnabled, setLocationEnabled] = useState(false);

  useEffect(() => {
    if (locationEnabled) {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Allow location to auto-detect your city or enter manually.');
          setLocationEnabled(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        let reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (reverseGeocode.length > 0) {
          setCity(reverseGeocode[0].city || reverseGeocode[0].region || "Unknown");
        }
      })();
    }
  }, [locationEnabled]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Permission to access gallery is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onChangeDob = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setDob(formattedDate);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
      />

      {/* Sex Dropdown */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={sex}
          onValueChange={(value) => setSex(value)}
          style={styles.picker}
        >
          <Picker.Item label="Select Sex" value="" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
          <Picker.Item label="Other" value="other" />
        </Picker>
      </View>

      {/* Date Picker */}
      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text style={{ color: dob ? '#000' : '#888' }}>
          {dob || 'Select Date of Birth'}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dob ? new Date(dob) : new Date()}
          mode="date"
          display="default"
          onChange={onChangeDob}
        />
      )}

      {/* Auto-detect button */}
      <TouchableOpacity 
        style={styles.detectBtn} 
        onPress={() => setLocationEnabled(true)}
      >
        <Text style={styles.detectText}>📍 Auto-detect Location</Text>
      </TouchableOpacity>

      {/* City input (editable if auto-detect fails) */}
      <TextInput
        placeholder="Enter City"
        style={styles.input}
        value={city}
        onChangeText={setCity}
      />

      {/* User Type Dropdown */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={userType}
          onValueChange={(value) => setUserType(value)}
          style={styles.picker}
        >
          <Picker.Item label="Select User Type" value="" />
          <Picker.Item label="Teacher" value="teacher" />
          <Picker.Item label="Student" value="student" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
        <Text style={styles.uploadText}>Upload Picture</Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image }} style={styles.previewImage} />
      )}

      <TouchableOpacity style={styles.registerBtn}>
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e90ff',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pickerContainer: {
    width: '100%',
    backgroundColor: '#fff',
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  detectBtn: {
    backgroundColor: '#32cd32',
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  detectText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  uploadBtn: {
    backgroundColor: '#ff9800',
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  uploadText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 10,
  },
  registerBtn: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  registerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
