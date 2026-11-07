import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

// === Your helper imports ===
import { recordSpeech } from "@/functions/recordSpeech";
import { saveHistory } from "@/functions/saveHistory";
import { saveNotification } from "@/functions/saveNotifications";
import { transcribeSpeech } from "@/functions/transcribeSpeech";

const BubbleImg = require("../../assets/images/bubble.png");

export default function Microphone() {
  const router = useRouter();

  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const audioRecordingRef = useRef(new Audio.Recording());
  const webAudioPermissionsRef = useRef<MediaStream | null>(null);

  // === Animation setup ===
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.15,
          duration: 350,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 350,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulse = () => {
    scaleAnim.stopAnimation();
    scaleAnim.setValue(1);
  };

  const startRecording = async () => {
    if (isRecording || isTranscribing) return;

    try {
      await recordSpeech(
        audioRecordingRef,
        setIsRecording,
        !!webAudioPermissionsRef.current
      );

      startPulse();

      Toast.show({
        type: "info",
        text1: "Recording started",
        text2: "Speak clearly into your microphone.",
        position: "top",
        topOffset: 70,
        visibilityTime: 2500,
      });
    } catch (error: any) {
      console.log("Record error:", error);

      setIsRecording(false);
      stopPulse();

      let message =
        "Could not start the microphone. Please try again.";

      if (
        error?.message?.toLowerCase().includes("permission")
      ) {
        message =
          "Microphone permission is required to record your voice.";
      }

      Toast.show({
        type: "error",
        text1: "Recording failed",
        text2: message,
        position: "top",
        topOffset: 70,
        visibilityTime: 3500,
      });
      await saveNotification(
        "error",
        "Recording failed",
        message
      );

      await saveHistory(
        "voice",
        message
      );
    }
  };

  const stopRecording = async () => {
    if (isTranscribing) return;

    try {
      const status =
        await audioRecordingRef.current?.getStatusAsync();

      console.log(
        "Stop pressed. Status:",
        status
      );

      if (!status?.isRecording) {
        Toast.show({
          type: "info",
          text1: "Nothing to stop",
          text2: "There is no active recording.",
          position: "top",
          topOffset: 70,
          visibilityTime: 2500,
        });

        return;
      }

      setIsRecording(false);
      stopPulse();
      setIsTranscribing(true);

      Toast.show({
        type: "info",
        text1: "Processing voice",
        text2: "Your recording is being processed.",
        position: "top",
        topOffset: 70,
        visibilityTime: 2500,
      });

      // This is now the SAFE predefined command
      const commandText =
        await transcribeSpeech(
          audioRecordingRef
        );

      console.log(
        "Voice command:",
        commandText || "(no command)"
      );

      // Nothing returned
      if (
        !commandText ||
        !commandText.trim()
      ) {
        const noCommandMessage =
          "No supported voice command was detected. Please try again.";

        Toast.show({
          type: "info",
          text1: "Command not recognized",
          text2: noCommandMessage,
          position: "top",
          topOffset: 70,
          visibilityTime: 3500,
        });

        await saveNotification(
          "info",
          "Command not recognized",
          noCommandMessage
        );

        return;
      }

      // ================================
      // SUCCESS
      // ================================

      Toast.show({
        type: "success",
        text1: "Command sent",
        text2: commandText,
        position: "top",
        topOffset: 70,
        visibilityTime: 3000,
      });

      await saveNotification(
        "success",
        "Voice command sent",
        commandText
      );

      await saveHistory(
        "voice",
        commandText
      );

    } catch (error: any) {
      console.log(
        "Error during voice processing:",
        error
      );

      let errorMessage =
        "Your voice command could not be processed.";

      // Unknown / unsupported voice command
      if (
        error?.message?.includes("422") ||
        error?.message?.includes(
          "No supported voice command"
        )
      ) {
        errorMessage =
          "No supported voice command was detected. Please try a different phrase.";

        Toast.show({
          type: "info",
          text1: "Command not recognized",
          text2: errorMessage,
          position: "top",
          topOffset: 70,
          visibilityTime: 3500,
        });

        await saveNotification(
          "info",
          "Command not recognized",
          errorMessage
        );

        return;
      }

      // Network error
      if (
        error?.message?.includes(
          "Network request failed"
        ) ||
        error?.message?.includes(
          "Failed to fetch"
        )
      ) {
        errorMessage =
          "Could not connect to the server. Check your network connection.";
      }

      Toast.show({
        type: "error",
        text1: "Voice processing failed",
        text2: errorMessage,
        position: "top",
        topOffset: 70,
        visibilityTime: 4000,
      });

      await saveNotification(
        "error",
        "Voice processing failed",
        errorMessage
      );
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <LinearGradient
      colors={["#f8e7f5", "#e9dcfa", "#f6e4ff"]}
      style={[styles.container, { padding: 12 }]}
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
        <Text style={styles.title}>
          {isTranscribing ? "Transcribing..." : "AI Voice Recognition"}
        </Text>

        {/* === MAIN BUBBLE === */}
        <View style={styles.bubbleWrapper}>
          <View style={styles.bubbleShadow} />
          <Animated.Image
            source={require("../../assets/images/bubble.png")}
            style={[
              styles.mainBubble,
              { transform: [{ scale: scaleAnim }] }, // apply animated scale
            ]}
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
                <MaterialIcons name="record-voice-over" size={20} color="#333" />
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

          <TouchableOpacity
            style={[styles.micButton, { opacity: isTranscribing ? 0.5 : 1 }]}
            onPress={isRecording ? stopRecording : startRecording}
            disabled={isTranscribing}
          >
            <Ionicons
              name={isRecording ? "stop" : "mic"}
              size={34}
              color="#fff"
            />
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
    paddingHorizontal: 18,
    paddingTop: 40,
    paddingBottom: 24,
  },

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
  title: { fontSize: 25, fontWeight: "700", color: "#111", marginTop: 25 },
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
