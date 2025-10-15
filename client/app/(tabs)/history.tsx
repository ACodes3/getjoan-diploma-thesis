import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function History() {
  const router = useRouter();

  // Mocked history data (replace with real saved data later)
  const [history, setHistory] = useState([
    { id: "1", title: "Write script to automate email reports", date: "Oct 10, 2025" },
    { id: "2", title: "Design landing page for coffee brand", date: "Oct 8, 2025" },
    { id: "3", title: "Create presentation for AI strategy", date: "Oct 6, 2025" },
  ]);

  const clearHistory = () => setHistory([]);

  return (
    <LinearGradient
      colors={["#f8e7f5", "#e9dcfa", "#f6e4ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        {/* === HEADER === */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButtonSmall}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={22} color="#333" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>History</Text>

          <TouchableOpacity style={styles.iconButtonSmall} onPress={clearHistory}>
            <Ionicons name="trash-outline" size={22} color="#333" />
          </TouchableOpacity>
        </View>

        {/* === HISTORY LIST === */}
        {history.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={60} color="#aaa" />
            <Text style={styles.emptyText}>No history yet</Text>
          </View>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item }) => (
              <TouchableOpacity activeOpacity={0.9}>
                <BlurView intensity={60} tint="light" style={styles.historyCard}>
                  <View style={styles.cardLeft}>
                    <Ionicons name="chatbubble-outline" size={24} color="#65058aff" />
                    <View style={{ marginLeft: 10 }}>
                      <Text style={styles.historyTitle}>{item.title}</Text>
                      <Text style={styles.historyDate}>{item.date}</Text>
                    </View>
                  </View>
                  <Ionicons name="arrow-forward" size={18} color="#333" />
                </BlurView>
              </TouchableOpacity>
            )}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  // === HEADER ===
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },
  iconButtonSmall: {
    backgroundColor: "rgba(255,255,255,0.6)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  // === HISTORY CARDS ===
  historyCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111",
  },
  historyDate: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },

  // === EMPTY STATE ===
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
    marginTop: 10,
  },
});
