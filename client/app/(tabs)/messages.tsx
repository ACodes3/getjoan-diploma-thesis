import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Toast from "react-native-toast-message";
import { getApiBase } from "../../functions/apiBase.ts";
import { saveHistory } from "../../functions/saveHistory";
import { saveNotification } from "../../functions/saveNotifications";

export default function Messages() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const categories = [
    { id: "1", label: "I'll be late" },
    { id: "2", label: "Meeting started" },
    { id: "3", label: "Arrived at location" },
    { id: "4", label: "Need assistance" },
  ];

  const optionsByCategory: Record<string, string[]> = {
    "I'll be late": ["5 minutes", "10 minutes", "15 minutes", "20 minutes"],
    "Meeting started": ["Now", "In 5 minutes", "In 10 minutes"],
    "Arrived at location": ["At office", "At client site", "At home"],
    "Need assistance": ["Call me", "Send help", "Running late"],
  };

  const handleCategorySelect = (label: string) => {
    setSelectedCategory(label);
    setStep(2);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setStep(3);
  };

  const handleSend = async () => {
    if (!selectedCategory || !selectedOption) {
      Toast.show({
        type: "info",
        text1: "Message not ready",
        text2: "Please select a category and an option first.",
        position: "top",
        topOffset: 70,
        visibilityTime: 3000,
      });

      return;
    }

    const message = `${selectedCategory} — ${selectedOption}`;
    const apiBase = getApiBase();

    try {
      console.log("📤 Sending to GetJoan:", message);
      console.log("🌐 API base:", apiBase);

      const response = await fetch(`${apiBase}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          `Server ${response.status}: ${errorText}`
        );
      }

      console.log("✅ Message sent successfully");

      Toast.show({
        type: "success",
        text1: "Message sent",
        text2: "Your message was successfully sent to Joan.",
        position: "top",
        topOffset: 70,
        visibilityTime: 3000,
      });

      await saveNotification(
        "success",
        "Message sent",
        message
      );
      await saveHistory(
        "manual",
        message
      );

      router.back();
    } catch (error: any) {
      console.error(
        "❌ Failed to send message:",
        error
      );

      let message =
        "Your message could not be sent to Joan.";

      if (
        error?.message?.includes("Network request failed") ||
        error?.message?.includes("Failed to fetch")
      ) {
        message =
          "Could not connect to the server. Check your connection.";
      }

      Toast.show({
        type: "error",
        text1: "Message failed",
        text2: message,
        position: "top",
        topOffset: 70,
        visibilityTime: 3500,
      });
      await saveNotification(
        "error",
        "Message failed",
        "The message could not be sent to Joan."
      );
      await saveHistory(
        "manual",
        message
      );
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
          <Text style={styles.headerTitle}>Quick Messages</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* === STEPPER INDICATOR === */}
        <View style={styles.stepper}>
          {[1, 2, 3].map((i) => (
            <View
              key={i}
              style={[
                styles.stepDot,
                i <= step && styles.stepDotActive,
              ]}
            />
          ))}
        </View>

        {/* === STEP 1 === */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Select a message category</Text>
            {categories.map((cat) => (
              <BlurView
                key={cat.id}
                intensity={70}
                tint="light"
                style={styles.optionCard}
              >
                <TouchableOpacity
                  style={styles.optionInner}
                  onPress={() => handleCategorySelect(cat.label)}
                >
                  <Ionicons name="chatbubble-outline" size={22} color="#333" />
                  <Text style={styles.optionText}>{cat.label}</Text>
                </TouchableOpacity>
              </BlurView>
            ))}
          </View>
        )}

        {/* === STEP 2 === */}
        {step === 2 && selectedCategory && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>
              How long or which option for{" "}
              <Text style={{ fontWeight: "700" }}>{selectedCategory}</Text>?
            </Text>

            {optionsByCategory[selectedCategory].map((opt, index) => (
              <BlurView
                key={index}
                intensity={70}
                tint="light"
                style={styles.optionCard}
              >
                <TouchableOpacity
                  style={styles.optionInner}
                  onPress={() => handleOptionSelect(opt)}
                >
                  <Ionicons name="time-outline" size={22} color="#333" />
                  <Text style={styles.optionText}>{opt}</Text>
                </TouchableOpacity>
              </BlurView>
            ))}

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setStep(1)}
            >
              <Ionicons name="arrow-back" size={18} color="#555" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* === STEP 3 === */}
        {step === 3 && selectedCategory && selectedOption && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Confirm and Send</Text>
            <BlurView intensity={80} tint="light" style={styles.previewCard}>
              <Ionicons name="send-outline" size={22} color="#333" />
              <Text style={styles.previewText}>
                {selectedCategory} — {selectedOption}
              </Text>
            </BlurView>

            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Ionicons name="paper-plane-outline" size={22} color="#fff" />
              <Text style={styles.sendText}>Send to GetJoan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setStep(2)}
            >
              <Ionicons name="arrow-back" size={18} color="#555" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </View>
        )}
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
    marginBottom: 20,
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

  // === STEPPER ===
  stepper: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(0,0,0,0.2)",
    marginHorizontal: 5,
  },
  stepDotActive: {
    backgroundColor: "#65058aff",
  },

  // === STEPS ===
  stepContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    color: "#111",
  },

  // === OPTIONS ===
  optionCard: {
    borderRadius: 20,
    marginVertical: 6,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  optionInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
    marginLeft: 10,
  },

  // === PREVIEW + BUTTONS ===
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    marginBottom: 20,
  },
  previewText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#65058aff",
    borderRadius: 30,
    paddingVertical: 14,
    shadowColor: "#65058aff",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  sendText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  backText: {
    color: "#555",
    marginLeft: 6,
    fontSize: 15,
  },
});
