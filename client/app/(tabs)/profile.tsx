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

export default function Profile() {
  const router = useRouter();

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
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* === PROFILE INFO === */}
        <View style={styles.profileSection}>
          <Image
            source={{ uri: "https://i.pravatar.cc/200" }}
            style={styles.avatar}
          />
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.role}>AI Enthusiast</Text>
        </View>

        {/* === INFO CARDS === */}
        <View style={styles.infoContainer}>
          <View style={styles.infoWrapper}>
            <BlurView intensity={70} tint="light" style={styles.infoCard}>
              <Ionicons name="mail-outline" size={22} color="#333" />
              <Text style={styles.infoText}>johndoe@email.com</Text>
            </BlurView>
          </View>

          <View style={styles.infoWrapper}>
            <BlurView intensity={70} tint="light" style={styles.infoCard}>
              <Feather name="phone" size={22} color="#333" />
              <Text style={styles.infoText}>+1 (555) 123-4567</Text>
            </BlurView>
          </View>

          <View style={styles.infoWrapper}>
            <BlurView intensity={70} tint="light" style={styles.infoCard}>
              <Ionicons name="location-outline" size={22} color="#333" />
              <Text style={styles.infoText}>Los Angeles, CA</Text>
            </BlurView>
          </View>

          <View style={styles.infoWrapper}>
            <BlurView intensity={70} tint="light" style={styles.infoCard}>
              <MaterialIcons name="work-outline" size={22} color="#333" />
              <Text style={styles.infoText}>Freelance Developer</Text>
            </BlurView>
          </View>
        </View>

        {/* === EDIT BUTTON === */}
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
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

  // === PROFILE SECTION ===
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },
  role: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },

  // === INFO CARDS ===
  infoContainer: {
    marginBottom: 40,
  },
  infoWrapper: {
    borderRadius: 20,
    overflow: "hidden",
    marginVertical: 6,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
  },

  // === EDIT BUTTON ===
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#65058aff",
    paddingVertical: 14,
    borderRadius: 25,
    shadowColor: "#65058aff",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  editText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
});
