import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Image, ScrollView, Platform, Alert, SafeAreaView 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import Banner from "./Banner"; 
import { supabase } from "../lib/supabase"; 
import { useNavigation } from "@react-navigation/native"; 

export default function RegisterScreen() {
  const navigation = useNavigation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sex, setSex] = useState('');
  const [dob, setDob] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [city, setCity] = useState('');
  const [userType, setUserType] = useState('');
  const [image, setImage] = useState(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

  const handleRegister = async () => {
    if (!fullName || !email || !phone || !sex || !dob || !city || !userType || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    // 🔍 Check if email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      Alert.alert("Error", "Email already registered. Please login.");
      return;
    }

    if (checkError && checkError.code !== "PGRST116") {
      Alert.alert("Error", checkError.message);
      return;
    }

    let uploadedImageUrl = null;

    if (image) {
      try {
        const response = await fetch(image);
        const blob = await response.blob();   // ✅ FIXED HERE

        const fileExt = image.split('.').pop().toLowerCase();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `users/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars') // 👈 bucket must exist in Supabase
          .upload(filePath, blob, { contentType: blob.type });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase
          .storage
          .from('avatars')
          .getPublicUrl(filePath);

        uploadedImageUrl = publicUrlData.publicUrl;
      } catch (err) {
        Alert.alert("Error Image upload", err.message);
        return;
      }
    }

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          full_name: fullName,
          email: email,
          phone: phone,
          sex: sex,
          dob: dob,
          city: city,
          user_type: userType,
          password: password,
          avatar_url: uploadedImageUrl, // 👈 save uploaded image
        },
      ]);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Registration successful!");
      navigation.replace("Login");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f8ff" }}>
      <Banner />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Register</Text>

        <TextInput
          placeholder="Full Name"
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
        />

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Phone Number"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

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

        <TouchableOpacity 
          style={styles.detectBtn} 
          onPress={() => setLocationEnabled(true)}
        >
          <Text style={styles.detectText}>📍 Auto-detect Location</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Enter City"
          style={styles.input}
          value={city}
          onChangeText={setCity}
        />

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

        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          placeholder="Confirm Password"
          style={styles.input}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
