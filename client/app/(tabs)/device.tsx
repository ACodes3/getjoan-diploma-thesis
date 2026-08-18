import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface DeviceDetails {
  id: string;
  name: string;
  model: string;
  location: string;
  status: "online" | "offline";
  url?: string;
}

const defaultDevice: DeviceDetails = {
  id: "36001a00-1851-3739-3536-0000000000",
  name: "Main Office Joan",
  model: "Joan 6",
  location: "Main Office",
  status: "online",
  url: "http://localhost:5173",
};

export default function DeviceDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const statusParam = typeof params.status === "string" ? params.status : undefined;

  const device: DeviceDetails = {
    id: (params.id as string) || defaultDevice.id,
    name: (params.name as string) || defaultDevice.name,
    model: (params.model as string) || defaultDevice.model,
    location: (params.location as string) || defaultDevice.location,
    status: statusParam === "offline" ? "offline" : "online",
    url: (params.url as string) || defaultDevice.url,
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

          <Text style={styles.headerTitle}>Device details</Text>

          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.card}>
            <View style={styles.topRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="desktop-outline" size={28} color="#65058a" />
              </View>

              <View style={styles.titleWrap}>
                <Text style={styles.deviceName}>{device.name}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    device.status === "online"
                      ? styles.statusOnline
                      : styles.statusOffline,
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      device.status === "online"
                        ? styles.dotOnline
                        : styles.dotOffline,
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      device.status === "online"
                        ? styles.statusTextOnline
                        : styles.statusTextOffline,
                    ]}
                  >
                    {device.status === "online" ? "Online" : "Offline"}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="hardware-chip-outline" size={20} color="#333" />
                </View>
                <View style={styles.infoTextWrap}>
                  <Text style={styles.infoLabel}>Model</Text>
                  <Text style={styles.infoValue}>{device.model}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="location-outline" size={20} color="#333" />
                </View>
                <View style={styles.infoTextWrap}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>{device.location}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="key-outline" size={20} color="#333" />
                </View>
                <View style={styles.infoTextWrap}>
                  <Text style={styles.infoLabel}>UID</Text>
                  <Text style={styles.infoValue}>{device.id}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="globe-outline" size={20} color="#333" />
                </View>
                <View style={styles.infoTextWrap}>
                  <Text style={styles.infoLabel}>Display URL</Text>
                  <Text style={styles.infoValue}>{device.url || "Not configured"}</Text>
                </View>
              </View>
            </View>

            <View style={styles.actions}> 
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => router.push("/add-device")}
              >
                <MaterialIcons name="edit" size={18} color="#fff" />
                <Text style={styles.primaryButtonText}>Edit device</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => router.back()}
              >
                <Text style={styles.secondaryButtonText}>Back</Text>
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
    paddingBottom: 50,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.45)",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  iconCircle: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  titleWrap: {
    marginLeft: 14,
    flex: 1,
  },
  deviceName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  statusOnline: {
    backgroundColor: "rgba(46,204,113,0.12)",
  },
  statusOffline: {
    backgroundColor: "rgba(150,150,150,0.15)",
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  dotOnline: {
    backgroundColor: "#27ae60",
  },
  dotOffline: {
    backgroundColor: "#888",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  statusTextOnline: {
    color: "#218c4f",
  },
  statusTextOffline: {
    color: "#777",
  },
  infoSection: {
    gap: 14,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoTextWrap: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  infoValue: {
    fontSize: 15,
    color: "#111",
    fontWeight: "600",
  },
  actions: {
    marginTop: 26,
    gap: 12,
  },
  primaryButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#65058aff",
    paddingVertical: 14,
    borderRadius: 16,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  secondaryButton: {
    borderRadius: 16,
    paddingVertical: 14,
    backgroundColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#222",
    fontSize: 16,
    fontWeight: "600",
  },
});
