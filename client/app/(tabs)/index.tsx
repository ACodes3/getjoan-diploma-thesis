import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import React, { useState } from "react";

import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  let [fontsLoaded] = useFonts({
    "GreatVibes-Regular": require("../../assets/fonts/GreatVibes-Regular.ttf"),
  });

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  if (!fontsLoaded) {
    return null;
  }

  const chatHistory = [
    { id: "1", title: "I will be late - 15 minutes" },
    { id: "2", title: "Need assistance - Running late" },
    { id: "3", title: "I will be late - 30 minutes" },
  ];

  // state for dropdown
  const [showNotifications, setShowNotifications] = useState(false);

  // sample notifications
  const notifications = [
    { id: "1", title: "Message successfully sent" },
    { id: "2", title: "Error while sending message" },
    { id: "3", title: "Message successfully sent" },
  ];

  return (
    <LinearGradient
      colors={["#f8e7f5", "#e9dcfa", "#f6e4ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={() => setShowNotifications(false)}>
        <BlurView intensity={40} tint="light" style={{ flex: 1 }}>
          <SafeAreaView
            style={[styles.container, { paddingTop: insets.top + 10 }]}
          >
            {/* Header */}
            <View style={styles.header}>
              {/* Avatar */}
              <TouchableOpacity onPress={() => router.push("/profile")}>
                <Image
                  source={{ uri: "https://i.pravatar.cc/200" }}
                  style={styles.profileImage}
                />
              </TouchableOpacity>

              {/* Right Icons Group */}
              <View style={styles.rightIcons}>
                {/* Documentation Icon */}
                <TouchableOpacity
                  style={styles.iconCircle}
                  onPress={() => router.push("/instructions")}
                >
                  <Ionicons name="book-outline" size={24} color="#000" />
                </TouchableOpacity>

                {/* Notifications Icon */}
                <TouchableOpacity
                  style={styles.iconCircle}
                  onPress={() => setShowNotifications(!showNotifications)}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={24}
                    color="#000"
                  />
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>5</Text>
                  </View>
                </TouchableOpacity>
                {/* Dropdown */}
                {showNotifications && (
                  <BlurView intensity={80} tint="light" style={styles.dropdown}>
                    {notifications.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.notificationItem}
                      >
                        <Ionicons
                          name="alert-circle-outline"
                          size={18}
                          color="#333"
                          style={{ marginRight: 8 }}
                        />
                        <Text style={styles.notificationText}>
                          {item.title}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </BlurView>
                )}
              </View>
            </View>

            {/* Greeting */}
            <Text style={styles.greeting}>
              Welcome to{" "}
              <Text
                style={[styles.highlight, { fontFamily: "GreatVibes-Regular" }]}
              >
                GetJoan Talk
              </Text>
            </Text>
            <Text style={styles.subtitle}>
              Your Smart Voice & Message Assistant
            </Text>

            {/* Tabs */}
            <View style={styles.tabs}>
              <TouchableOpacity
                style={[styles.tab, pathname === "/" && styles.tabActive]}
                onPress={() => router.push("/")}
              >
                <Text
                  style={
                    pathname === "/" ? styles.tabTextActive : styles.tabText
                  }
                >
                  Smart Chat
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tab,
                  pathname === "/messages" && styles.tabActive,
                ]}
                onPress={() => router.push("/messages")}
              >
                <Ionicons
                  name={
                    pathname === "/messages"
                      ? "chatbubbles"
                      : "chatbubbles-outline"
                  }
                  size={25}
                  color={pathname === "/messages" ? "#000" : "#555"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tab,
                  pathname === "/settings" && styles.tabActive,
                ]}
                onPress={() => router.push("/settings")}
              >
                <Ionicons
                  name={
                    pathname === "/settings" ? "settings" : "settings-outline"
                  }
                  size={25}
                  color={pathname === "/settings" ? "#000" : "#555"}
                />
              </TouchableOpacity>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <ActionButton
                title="Begin Smart Talk"
                icon="mic-outline"
                onPress={() => router.push("/microphone")}
              />
            </View>

            {/* Chat History */}
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>History</Text>
              <Text
                style={styles.seeAll}
                onPress={() => router.push("/history")}
              >
                See All
              </Text>
            </View>

            <FlatList
              data={chatHistory}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.historyItem}>
                  <Text style={styles.historyText}>{item.title}</Text>
                  <Ionicons
                    name="arrow-forward-outline"
                    size={18}
                    color="#555"
                  />
                </TouchableOpacity>
              )}
            />
          </SafeAreaView>
        </BlurView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}

interface ActionButtonProps {
  title: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  onPress: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  icon,
  onPress,
}) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <Ionicons name={icon} size={20} color="#000" />
    <Text style={styles.actionText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10, // or use marginRight on children if gap not supported
  },

  iconCircle: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    position: "relative",
  },
  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 31,
  },
  notification: {
    position: "relative",
  },

  badge: {
    position: "absolute",
    top: -1,
    right: -1,
    backgroundColor: "#FF4D67",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 25,
    marginBottom: 4,
  },
  highlight: {
    color: "#FF69B4",
    fontSize: 33,
    fontFamily: "GreatVibes-Regular",
    letterSpacing: 1,
    textShadowColor: "rgba(255, 105, 180, 0.25)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 20,
    color: "#222",
    fontWeight: "700",
    marginBottom: 10,
  },
  tabs: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  tab: {
    paddingVertical: 20,
    paddingHorizontal: 36,
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 20,
    marginRight: 10,
  },
  tabActive: {
    backgroundColor: "rgba(255,255,255,0.7)",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabText: {
    fontSize: 16,
    color: "#555",
  },
  tabTextActive: {
    fontWeight: "600",
    color: "#000",
    fontSize: 16,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    backgroundColor: "rgba(255,255,255,0.5)",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    borderRadius: 16,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  actionText: {
    marginTop: 8,
    fontWeight: "500",
    fontSize: 16,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 10,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  seeAll: {
    color: "#B06FFB",
    fontWeight: "500",
    fontSize: 16,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.6)",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 14,
    backdropFilter: "blur(5px)",
  },
  historyText: {
    flex: 1,
    marginRight: 10,
    fontSize: 14,
  },
  dropdown: {
    position: "absolute",
    top: 55,
    right: 0,
    width: 250,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 50,
  },

  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.3)",
  },

  notificationText: {
    flex: 1,
    color: "#222",
    fontSize: 14,
  },
});
