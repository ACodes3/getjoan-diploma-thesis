import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function AddDeviceScreen() {
  const router = useRouter();

  const [friendlyName, setFriendlyName] = useState("Joan Display");
  const [deviceUid, setDeviceUid] = useState("36001a00-1851-3739-3536-0000000000");
  const [deviceUrl, setDeviceUrl] = useState("http://localhost:5173");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    if (!friendlyName.trim()) {
      Toast.show({
        type: "info",
        text1: "Device name required",
        text2: "Please give your device a friendly name.",
        position: "top",
        topOffset: 70,
        visibilityTime: 2500,
      });
      return;
    }

    if (!deviceUrl.trim()) {
      Toast.show({
        type: "info",
        text1: "Display URL required",
        text2: "Paste the URL that this device should show.",
        position: "top",
        topOffset: 70,
        visibilityTime: 2500,
      });
      return;
    }

    setConnecting(true);

    try {
      Toast.show({
        type: "success",
        text1: "Device connected",
        text2: `${friendlyName} is ready to display the configured page.`,
        position: "top",
        topOffset: 70,
        visibilityTime: 3000,
      });

      setTimeout(() => {
        router.back();
      }, 500);
    } finally {
      setTimeout(() => setConnecting(false), 600);
    }
  };

  const handleAdvancedAction = (action: "configure" | "reboot") => {
    Toast.show({
      type: action === "configure" ? "info" : "success",
      text1: action === "configure" ? "Open device settings" : "Reboot started",
      text2:
        action === "configure"
          ? "Use the device’s local admin page to adjust configuration."
          : "The connected device reboot command has been issued.",
      position: "top",
      topOffset: 70,
      visibilityTime: 3000,
    });
  };

  return (
    <LinearGradient
      colors={["#f8e7f5", "#e9dcfa", "#f6e4ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, padding: 12 }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButtonSmall}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={22} color="#333" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Add Device</Text>

          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Friendly name</Text>
              <TextInput
                style={styles.input}
                value={friendlyName}
                onChangeText={setFriendlyName}
                placeholder="Joan Display"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Device UID</Text>
              <TextInput
                style={styles.input}
                value={deviceUid}
                onChangeText={setDeviceUid}
                placeholder="36001a00-1851-..."
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Device login</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
                autoCapitalize="none"
              />
              <TextInput
                style={[styles.input, styles.inputSpacing]}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Display URL</Text>
              <TextInput
                style={styles.input}
                value={deviceUrl}
                onChangeText={setDeviceUrl}
                placeholder="http://localhost:5173"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={styles.advancedToggle}
              onPress={() => setShowAdvanced((prev) => !prev)}
            >
              <Text style={styles.advancedToggleText}>Advanced settings</Text>
              <Ionicons
                name={showAdvanced ? "chevron-up" : "chevron-down"}
                size={18}
                color="#333"
              />
            </TouchableOpacity>

            {showAdvanced && (
              <View style={styles.advancedPanel}>
                <TouchableOpacity
                  style={styles.advancedAction}
                  onPress={() => handleAdvancedAction("configure")}
                >
                  <MaterialIcons name="tune" size={18} color="#333" />
                  <Text style={styles.advancedActionText}>Configure device</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.advancedAction}
                  onPress={() => handleAdvancedAction("reboot")}
                >
                  <Ionicons name="refresh-circle-outline" size={18} color="#333" />
                  <Text style={styles.advancedActionText}>Reboot device</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={[styles.connectButton, connecting && styles.connectButtonDisabled]}
              onPress={handleConnect}
              disabled={connecting}
            >
              <Ionicons name="link-outline" size={20} color="#fff" />
              <Text style={styles.connectButtonText}>
                {connecting ? "Connecting..." : "Connect device"}
              </Text>
            </TouchableOpacity>
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
    paddingTop: 12,
    paddingBottom: 20,
  },
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
  scrollContent: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.45)",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#444",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(101, 5, 138, 0.15)",
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#111",
  },
  inputSpacing: {
    marginTop: 8,
  },
  advancedToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  advancedToggleText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  advancedPanel: {
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: 14,
    padding: 8,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  advancedAction: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 6,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  advancedActionText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#222",
  },
  connectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#65058aff",
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 6,
  },
  connectButtonDisabled: {
    opacity: 0.7,
  },
  connectButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
});
