import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Banner from "./Banner";
import { supabase } from "../supabase";

export default function TeacherScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // 👇 safer param extraction
  const userId = route.params?.userId || null;

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("TeacherScreen received userId:", userId);

    const fetchTeacher = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("full_name, email, phone, city, user_type, profile_image")
          .eq("id", userId)
          .single();

        if (error) throw error;
        setTeacher(data);
      } catch (err) {
        console.error("Error fetching teacher:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchTeacher();
    } else {
      setLoading(false); // stop spinner if no userId
    }
  }, [userId]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e90ff" />
      </View>
    );
  }

  if (!userId) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>
          ⚠️ No userId received. Check navigation params.
        </Text>
      </View>
    );
  }

  if (!teacher) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>Failed to load teacher info.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f0f8ff" }}>
      <Banner />

      <View style={styles.container}>
        <Image
          source={{
            uri: teacher.profile_image || "https://via.placeholder.com/150",
          }}
          style={styles.profileImage}
        />

        <Text style={styles.name}>{teacher.full_name}</Text>
        <Text style={styles.role}>{teacher.user_type?.toUpperCase()}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>📧 Email</Text>
          <Text style={styles.value}>{teacher.email}</Text>

          <Text style={styles.label}>📱 Phone</Text>
          <Text style={styles.value}>{teacher.phone}</Text>

          <Text style={styles.label}>🏙 City</Text>
          <Text style={styles.value}>{teacher.city}</Text>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e90ff",
  },
  role: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "100%",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  value: {
    fontSize: 14,
    color: "#555",
  },
  logoutBtn: {
    backgroundColor: "#e74c3c",
    padding: 12,
    borderRadius: 8,
    marginTop: 30,
    width: "100%",
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
