import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { supabase } from "../lib/supabase";
import Banner from "./Banner";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    try {
      // fetch user with matching email + password
      const { data, error } = await supabase
        .from("users")
        .select("id, email, user_type, password")
        .eq("email", email)
        .eq("password", password) // ⚠️ plain text for now
        .single();

      if (error || !data) {
        Alert.alert("Login Failed", "Invalid email or password");
        return;
      }

      console.log("✅ Login success, userId:", data.id);

      // check user type and navigate
      if (data.user_type === "student") {
        navigation.navigate("Student", { userId: data.id });
      } else if (data.user_type === "teacher") {
        navigation.navigate("Teacher", { userId: data.id });
      } else {
        Alert.alert("Error", "Unknown user type");
      }
    } catch (err) {
      console.error("Login error:", err.message);
      Alert.alert("Error", "Something went wrong. Try again.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f8ff" }}>
      <Banner />
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>Don’t have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e90ff",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  loginBtn: {
    backgroundColor: "#1e90ff",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    color: "#1e90ff",
    textDecorationLine: "underline",
  },
});
