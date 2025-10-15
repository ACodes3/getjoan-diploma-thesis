import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Instructions() {
  const router = useRouter();

  const steps = [
    {
      id: "1",
      icon: "bluetooth-outline",
      title: "1. Connect to Your GetJoan Device",
      desc: "Make sure your phone’s Bluetooth is on, then pair it with your GetJoan device to start communication.",
    },
    {
      id: "2",
      icon: "mic-outline",
      title: "2. Use Voice Commands",
      desc: "Tap the microphone icon to speak directly to your GetJoan. Say your message naturally, and it’ll be sent instantly.",
    },
    {
      id: "3",
      icon: "chatbubbles-outline",
      title: "3. Choose Quick Messages",
      desc: "Prefer tapping? Use the Quick Messages section to send predefined messages like 'I’ll be late' or 'Meeting started.'",
    },
    {
      id: "4",
      icon: "settings-outline",
      title: "4. Customize Your Experience",
      desc: "Change language, toggle notifications, or adjust preferences in the Settings menu for a personalized setup.",
    },
    {
      id: "5",
      icon: "time-outline",
      title: "5. Review Message History",
      desc: "View your recent voice and quick messages to keep track of what’s been sent to GetJoan.",
    },
  ];

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

          <Text style={styles.headerTitle}>How Talk to Me Works</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* === CONTENT === */}
        <ScrollView
          contentContainerStyle={{ paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.introText}>
            Welcome to <Text style={styles.appName}>Talk to Me</Text> —
            your smart way to communicate quickly with your GetJoan device,
            whether by voice or with one tap.
          </Text>

          {steps.map((step) => (
            <BlurView
              key={step.id}
              intensity={70}
              tint="light"
              style={styles.stepCard}
            >
              <View style={styles.stepHeader}>
                <View style={styles.iconCircle}>
                  <Ionicons
                    name={step.icon as any}
                    size={24}
                    color="#65058aff"
                  />
                </View>
                <Text style={styles.stepTitle}>{step.title}</Text>
              </View>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </BlurView>
          ))}

          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => router.back()}
          >
            <Text style={styles.getStartedText}>Got it — let’s connect!</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </ScrollView>
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

  // === INTRO ===
  introText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    lineHeight: 22,
  },
  appName: {
    color: "#65058aff",
    fontWeight: "700",
  },

  // === STEP CARDS ===
  stepCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  stepDesc: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },

  // === BUTTON ===
  getStartedButton: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#65058aff",
    borderRadius: 25,
    paddingVertical: 14,
    shadowColor: "#65058aff",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  getStartedText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginRight: 6,
  },
});
