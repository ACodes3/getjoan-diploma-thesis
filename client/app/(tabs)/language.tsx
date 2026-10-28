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

export default function LanguageScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState("English");

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Japanese",
    "Korean",
    "Chinese (Simplified)",
    "Hindi",
  ];

  const handleSelect = (lang: string) => {
    setSelected(lang);
    // Navigate back to settings with language as a query param
    setTimeout(() => {
      router.push(`/settings?lang=${encodeURIComponent(lang)}`);
    }, 200);
  };

  return (
    <LinearGradient
      colors={["#f8e7f5", "#e9dcfa", "#f6e4ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, padding: 12 }}
    >
      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButtonSmall}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={22} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Language</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* LANGUAGE LIST */}
        <FlatList
          data={languages}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={styles.itemWrapper}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleSelect(item)}
              >
                <BlurView
                  intensity={70}
                  tint="light"
                  style={[
                    styles.languageCard,
                    selected === item && styles.selectedCard,
                  ]}
                >
                  <Text
                    style={[
                      styles.languageText,
                      selected === item && styles.selectedText,
                    ]}
                  >
                    {item}
                  </Text>
                  {selected === item && (
                    <Ionicons name="checkmark" size={20} color="#65058aff" />
                  )}
                </BlurView>
              </TouchableOpacity>
            </View>
          )}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 40,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: {
    paddingVertical: 10,
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
  itemWrapper: {
    borderRadius: 20,
    overflow: "hidden",
    marginVertical: 6,
  },
  languageCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  selectedCard: {
    borderColor: "#65058aff",
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 22,
  },
  languageText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
  },
  selectedText: {
    color: "#65058aff",
    fontWeight: "700",
  },
});
