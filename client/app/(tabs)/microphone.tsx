import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
const BubbleImg = require("../../assets/images/bubble.png");

export default function Microphone() {
  const router = useRouter();
  return (
    <LinearGradient
      colors={["#f8e7f5", "#e9dcfa", "#f6e4ff"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.inner}>
        {/* === HEADER === */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButtonSmall}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={22} color="#333" />
          </TouchableOpacity>

          <View style={styles.centerChipWrapper}>
            <BlurView intensity={80} tint="light" style={styles.centerChip}>
              <Image source={BubbleImg} style={styles.bubbleImage} />
              <Text style={styles.centerChipText}>Voice Pulse</Text>
            </BlurView>
          </View>

          <TouchableOpacity style={styles.iconButtonSmall}>
            <Ionicons name="ellipsis-horizontal" size={22} color="#333" />
          </TouchableOpacity>
        </View>

        {/* === TITLE === */}
        <Text style={styles.title}>AI Voice Recognition</Text>

        {/* === MAIN BUBBLE === */}
        <View style={styles.bubbleWrapper}>
          <View style={styles.bubbleShadow} />
          <Image
            source={require("../../assets/images/bubble.png")}
            style={styles.mainBubble}
            resizeMode="cover"
          />
        </View>

        {/* === ACTION BUTTONS === */}
        <View style={styles.actionRow}>
          <BlurView intensity={70} tint="light" style={styles.actionCard}>
            <View style={styles.actionTopRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="pulse-outline" size={20} color="#333" />
              </View>
              <View style={styles.arrowContainer}>
                <Feather name="arrow-up-right" size={20} color="#333" />
              </View>
            </View>
            <Text style={styles.actionTitle}>Voice Clarity Boost</Text>
          </BlurView>

          <BlurView intensity={70} tint="light" style={styles.actionCard}>
            <View style={styles.actionTopRow}>
              <View style={styles.iconContainer}>
                <MaterialIcons
                  name="record-voice-over"
                  size={20}
                  color="#333"
                />
              </View>
              <View style={styles.arrowContainer}>
                <Feather name="arrow-up-right" size={20} color="#333" />
              </View>
            </View>
            <Text style={styles.actionTitle}>Instant Speech Capture</Text>
          </BlurView>
        </View>

        {/* === BOTTOM BUTTONS === */}
        <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="sparkles-outline" size={26} color="#555" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.micButton}>
            <Ionicons name="mic" size={34} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="close" size={28} color="#555" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 40,
  },

  // === HEADER ===
  header: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconButtonSmall: {
    backgroundColor: "rgba(255,255,255,0.6)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  centerChipWrapper: {
    borderRadius: 40,
    overflow: "hidden",
  },
  centerChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  bubbleImage: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 8,
  },
  centerChipText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
  },

  // === TITLE ===
  title: { fontSize: 25, fontWeight: "700", color: "#111", marginTop: 25 },

  // === MAIN BUBBLE ===
  bubbleWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 35,
  },
  mainBubble: {
    width: 250,
    height: 250,
    borderRadius: 100,
  },
  bubbleShadow: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 200,
    backgroundColor: "rgba(255,255,255,0.3)",
  },

  // === ACTION BUTTONS ===
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 25,
  },

  actionCard: {
    flex: 1,
    borderRadius: 30,
    overflow: "hidden",
    padding: 20,
    marginHorizontal: 8,
    backgroundColor: "rgba(255,255,255,0.4)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },

  actionTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  arrowContainer: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  actionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
  },

  // === BOTTOM CONTROLS ===
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "60%",
    marginBottom: 40,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#65058aff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#9b5de5",
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
  },
  iconButton: {
    backgroundColor: "rgba(255,255,255,0.5)",
    width: 55,
    height: 55,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
  },
});
