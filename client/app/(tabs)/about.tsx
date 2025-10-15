import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function About() {
  const router = useRouter();

  const openWebsite = () => {
    Linking.openURL("https://aspasija.com");
  };

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
          <Text style={styles.headerTitle}>About</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* === CONTENT === */}
        <View style={styles.content}>
          {/* App Icon */}
          <View style={styles.iconWrapper}>
            <View style={styles.appIcon}>
              <Ionicons name="sparkles-outline" size={40} color="#65058aff" />
            </View>
          </View>

          {/* App Info */}
          <Text style={styles.appName}>GetJoan Talk</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>

          {/* Description */}
          <View style={styles.blurWrapper}>
            <BlurView intensity={70} tint="light" style={styles.descCard}>
              <Text style={styles.descText}>
                <Text style={{ fontWeight: "700" }}>GetJoan Talk</Text> is your
                companion app for seamless communication with your GetJoan
                device. Use speech recognition or predefined quick messages to
                send updates effortlessly — anytime, anywhere.
              </Text>
            </BlurView>
          </View>

          {/* Developer Info */}
          <View style={styles.blurWrapper}>
            <BlurView intensity={60} tint="light" style={styles.infoCard}>
              <Ionicons name="people-outline" size={22} color="#333" />
              <Text style={styles.infoText}>
                Developed by Aspasija Cvetkoska
              </Text>
            </BlurView>
          </View>

          <View style={styles.blurWrapper}>
            <BlurView intensity={60} tint="light" style={styles.infoCard}>
              <Ionicons name="mail-outline" size={22} color="#333" />
              <Text style={styles.infoText}>
                aspasija.cvetkoska.tech@gmail.com
              </Text>
            </BlurView>
          </View>

          {/* Website Button */}
          <TouchableOpacity style={styles.websiteButton} onPress={openWebsite}>
            <Ionicons name="globe-outline" size={20} color="#fff" />
            <Text style={styles.websiteText}>Visit Website</Text>
          </TouchableOpacity>
        </View>
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

  // === CONTENT ===
  content: {
    alignItems: "center",
  },
  iconWrapper: {
    marginBottom: 10,
  },
  appIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
    marginTop: 10,
  },
  appVersion: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },

  // === BLUR FIX WRAPPER ===
  blurWrapper: {
    borderRadius: 20,
    overflow: "hidden",
    width: "100%",
    marginBottom: 12,
  },

  descCard: {
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  descText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
    textAlign: "center",
  },

  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: "rgba(255,255,255,0.4)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  infoText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#111",
  },

  websiteButton: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#65058aff",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 26,
    shadowColor: "#65058aff",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  websiteText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
});
