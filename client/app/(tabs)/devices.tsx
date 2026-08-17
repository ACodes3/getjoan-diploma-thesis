import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";

import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface Device {
  id: string;
  name: string;
  model: string;
  location: string;
  status: "online" | "offline";
}

export default function Devices() {
  const router = useRouter();

  const [devices] = useState<Device[]>([
    {
      id: "JOAN-001",
      name: "Main Office Joan",
      model: "Joan 6",
      location: "Main Office",
      status: "online",
    },
    {
      id: "JOAN-002",
      name: "Meeting Room Joan",
      model: "Joan 6",
      location: "Meeting Room",
      status: "offline",
    },
  ]);

  return (
    <LinearGradient
      colors={["#f8e7f5", "#e9dcfa", "#f6e4ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, { padding: 12 }]}
    >
      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButtonSmall}
            onPress={() => router.back()}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color="#333"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Devices
          </Text>

          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* INTRO */}
          <View style={styles.intro}>
            <View style={styles.deviceIconLarge}>
              <Ionicons
                name="desktop-outline"
                size={31}
                color="#65058a"
              />
            </View>

            <Text style={styles.title}>
              Your Joan Devices
            </Text>

            <Text style={styles.subtitle}>
              View and manage devices connected to GetJoan Talk.
            </Text>
          </View>

          {/* DEVICES */}
          {devices.map((device) => (
            <View
              key={device.id}
              style={styles.deviceWrapper}
            >
              <BlurView
                intensity={70}
                tint="light"
                style={styles.deviceCard}
              >
                <View style={styles.cardTop}>
                  <View style={styles.deviceInfo}>
                    <View style={styles.deviceIcon}>
                      <Ionicons
                        name="hardware-chip-outline"
                        size={25}
                        color="#333"
                      />
                    </View>

                    <View style={styles.deviceNameContainer}>
                      <Text style={styles.deviceName}>
                        {device.name}
                      </Text>

                      <Text style={styles.deviceModel}>
                        {device.model}
                      </Text>
                    </View>
                  </View>

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
                      {device.status === "online"
                        ? "Online"
                        : "Offline"}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailRow}>
                  <Ionicons
                    name="location-outline"
                    size={19}
                    color="#555"
                  />

                  <Text style={styles.detailText}>
                    {device.location}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons
                    name="key-outline"
                    size={19}
                    color="#555"
                  />

                  <Text style={styles.detailText}>
                    {device.id}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.manageButton}
                  onPress={() =>
                    console.log(
                      "Selected:",
                      device.id
                    )
                  }
                >
                  <Text style={styles.manageText}>
                    Device details
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color="#65058a"
                  />
                </TouchableOpacity>
              </BlurView>
            </View>
          ))}

          {/* ADD DEVICE */}
          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.85}
            onPress={() =>
              console.log("Add device")
            }
          >
            <Ionicons
              name="add-circle-outline"
              size={22}
              color="#fff"
            />

            <Text style={styles.addButtonText}>
              Add Device
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 40,
    paddingBottom: 24,
  },

  scrollContent: {
    paddingBottom: 50,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
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

  intro: {
    alignItems: "center",
    marginBottom: 28,
  },

  deviceIconLarge: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: "rgba(255,255,255,0.65)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
  },

  subtitle: {
    fontSize: 15,
    color: "#666",
    marginTop: 6,
    textAlign: "center",
    paddingHorizontal: 25,
  },

  deviceWrapper: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 16,
  },

  deviceCard: {
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.45)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  deviceInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  deviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  deviceNameContainer: {
    marginLeft: 12,
    flex: 1,
  },

  deviceName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },

  deviceModel: {
    fontSize: 14,
    color: "#666",
    marginTop: 3,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "600",
  },

  statusTextOnline: {
    color: "#218c4f",
  },

  statusTextOffline: {
    color: "#777",
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.06)",
    marginVertical: 15,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  detailText: {
    fontSize: 14,
    color: "#444",
    marginLeft: 10,
  },

  manageButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },

  manageText: {
    color: "#65058a",
    fontSize: 14,
    fontWeight: "600",
  },

  addButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#65058a",
    borderRadius: 28,
    paddingVertical: 15,
    shadowColor: "#65058a",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});