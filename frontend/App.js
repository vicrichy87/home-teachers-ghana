import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { supabase } from "./lib/supabase";

export default function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    let { data, error } = await supabase.from("users").select("*");
    if (error) {
      console.error("Supabase Error:", error.message);
    } else {
      setUsers(data);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📘 Ghana Home Teachers</Text>
      {users.length === 0 ? (
        <Text>No users yet</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Text>{item.name} ({item.email})</Text>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
});