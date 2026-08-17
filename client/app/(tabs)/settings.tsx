import { auth } from "@/firebase";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Settings() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const { lang } = useLocalSearchParams();
  const [selectedLanguage, setSelectedLanguage] = useState(lang || "English");
  const handleLogout = async () => {
  try {
    await signOut(auth);
    console.log("✅ User logged out");
  } catch (error) {
    console.error("❌ Logout error:", error);
  }
};

  return (
    <LinearGradient
      colors={["#f8e7f5", "#e9dcfa", "#f6e4ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, padding: 12 }}
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
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 40 }} />
        </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* === SETTINGS OPTIONS === */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          {/* Notifications */}
          <View style={styles.settingWrapper}>
            <BlurView intensity={60} tint="light" style={styles.settingCard}>
              <View style={styles.settingLeft}>
                <Ionicons name="notifications-outline" size={22} color="#333" />
                <Text style={styles.settingText}>Notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                thumbColor={notifications ? "#9b5de5" : "#ccc"}
              />
            </BlurView>
          </View>

          {/* Dark Mode */}
          <View style={styles.settingWrapper}>
            <BlurView intensity={60} tint="light" style={styles.settingCard}>
              <View style={styles.settingLeft}>
                <Ionicons name="moon-outline" size={22} color="#333" />
                <Text style={styles.settingText}>Dark Mode</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                thumbColor={darkMode ? "#9b5de5" : "#ccc"}
              />
            </BlurView>
          </View>

          {/* Language */}
          <View style={styles.settingWrapper}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push("/language")}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => router.push("/language")}
              >
                <BlurView
                  intensity={60}
                  tint="light"
                  style={styles.settingCard}
                >
                  <View style={styles.settingLeft}>
                    <Feather name="globe" size={22} color="#333" />
                    <Text style={styles.settingText}>Language</Text>
                  </View>

                  <View style={styles.settingRight}>
                    <Text style={styles.settingValue}>{selectedLanguage}</Text>
                    <Ionicons name="arrow-forward" size={20} color="#333" />
                  </View>
                </BlurView>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </View>

        {/* === APP SECTION === */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>

          {/* Profile */}
          <View style={styles.settingWrapper}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push("/profile")}
            >
              <BlurView intensity={60} tint="light" style={styles.settingCard}>
                <View style={styles.settingLeft}>
                  <Ionicons
                    name="person-circle-outline"
                    size={22}
                    color="#333"
                  />
                  <Text style={styles.settingText}>Profile</Text>
                </View>
                <Ionicons name="arrow-forward" size={20} color="#333" />
              </BlurView>
            </TouchableOpacity>
          </View>

          {/* About */}
          <View style={styles.settingWrapper}>
            <TouchableOpacity onPress={() => router.push("/about")}>
              <BlurView intensity={60} tint="light" style={styles.settingCard}>
                <View style={styles.settingLeft}>
                  <Ionicons
                    name="information-circle-outline"
                    size={22}
                    color="#333"
                  />
                  <Text style={styles.settingText}>About</Text>
                </View>
                <Ionicons name="arrow-forward" size={20} color="#333" />
              </BlurView>
            </TouchableOpacity>
          </View>

          {/* Privacy Policy */}
          <View style={styles.settingWrapper}>
            <BlurView intensity={60} tint="light" style={styles.settingCard}>
              <View style={styles.settingLeft}>
                <MaterialIcons name="lock-outline" size={22} color="#333" />
                <Text style={styles.settingText}>Privacy Policy</Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="arrow-forward" size={20} color="#333" />
              </TouchableOpacity>
            </BlurView>
          </View>
          {/* Logout */}
          <View style={styles.settingWrapper}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleLogout}
            >
              <BlurView
                intensity={60}
                tint="light"
                style={styles.settingCard}
              >
                <View style={styles.settingLeft}>
                  <Ionicons
                    name="log-out-outline"
                    size={22}
                    color="#c0392b"
                  />
                  <Text style={styles.logoutText}>
                    Log out
                  </Text>
                </View>
              </BlurView>
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
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

  // === HEADER ===
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

  // === SECTIONS ===
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 10,
  },

  // === SETTINGS CARD ===
  settingWrapper: {
    borderRadius: 20,
    overflow: "hidden",
    marginVertical: 6,
  },
  settingCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: "rgba(255,255,255,0.4)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
  },
  settingValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#65058aff",
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  // == Logout ==
  logoutText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#c0392b",
  },
});
