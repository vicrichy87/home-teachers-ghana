import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Picker } from "@react-native-picker/picker";

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [sex, setSex] = useState("Male");
  const [dob, setDob] = useState("");
  const [city, setCity] = useState("");
  const [userType, setUserType] = useState("Student");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);

  // Pick Image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Get Location
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Fill in your details</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />

      <Picker
        selectedValue={sex}
        style={styles.picker}
        onValueChange={(itemValue) => setSex(itemValue)}
      >
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={dob}
        onChangeText={setDob}
      />

      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />

      <Picker
        selectedValue={userType}
        style={styles.picker}
        onValueChange={(itemValue) => setUserType(itemValue)}
      >
        <Picker.Item label="Student" value="Student" />
        <Picker.Item label="Teacher" value="Teacher" />
      </Picker>

      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadText}>
          {image ? "Change Picture" : "Upload Picture"}
        </Text>
      </TouchableOpacity>
      {image && (
        <Image source={{ uri: image }} style={{ width: 80, height: 80, marginBottom: 15, borderRadius: 40 }} />
      )}

      <TouchableOpacity style={styles.uploadButton} onPress={getLocation}>
        <Text style={styles.uploadText}>
          {location ? "Location Saved ✅" : "Allow Location"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#636e72",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  picker: {
    width: "100%",
    height: 50,
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  uploadButton: {
    backgroundColor: "#dfe6e9",
    width: "100%",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  uploadText: {
    color: "#2d3436",
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#0984e3",
    width: "100%",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
