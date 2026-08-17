import { auth, db } from "@/firebase";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  onValue,
  ref,
  update,
} from "firebase/database";

import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AppNotification {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
}

interface HistoryItem {
  id: string;
  type: "manual" | "voice";
  message: string;
  createdAt: number;
}

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    "GreatVibes-Regular": require(
      "../../assets/fonts/GreatVibes-Regular.ttf"
    ),
  });

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const user = auth.currentUser;

  // === STATES ===
  const [showNotifications, setShowNotifications] =
    useState(false);

  const [notifications, setNotifications] =
    useState<AppNotification[]>([]);

  const [chatHistory, setChatHistory] =
    useState<HistoryItem[]>([]);

  // === AVATAR ===
  const avatarSeed =
    user?.uid ||
    user?.email ||
    "GetJoanUser";

  const avatarUrl =
    `https://api.dicebear.com/10.x/lorelei/png?seed=${encodeURIComponent(
      avatarSeed
    )}&size=128`;

  // === FIREBASE NOTIFICATIONS ===
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const notificationsRef = ref(
      db,
      `notifications/${user.uid}`
    );

    const unsubscribe = onValue(
      notificationsRef,
      (snapshot) => {
        const data = snapshot.val();

        if (!data) {
          setNotifications([]);
          return;
        }

        const list: AppNotification[] =
          Object.entries(data).map(
            ([id, value]: any) => ({
              id,
              ...value,
            })
          );

        // newest first
        list.sort(
          (a, b) =>
            (b.createdAt || 0) -
            (a.createdAt || 0)
        );

        setNotifications(list);
      },
      (error) => {
        console.error(
          "Notification read error:",
          error
        );

        setNotifications([]);
      }
    );

    return unsubscribe;
  }, [user?.uid]);

      // === FIREBASE HISTORY ===
    useEffect(() => {
      if (!user) {
        setChatHistory([]);
        return;
      }

      const historyRef = ref(
        db,
        `history/${user.uid}`
      );

      const unsubscribe = onValue(
        historyRef,
        (snapshot) => {
          const data = snapshot.val();

          if (!data) {
            setChatHistory([]);
            return;
          }

          const list: HistoryItem[] =
            Object.entries(data).map(
              ([id, value]: any) => ({
                id,
                ...value,
              })
            );

          // newest first
          list.sort(
            (a, b) =>
              (b.createdAt || 0) -
              (a.createdAt || 0)
          );

          setChatHistory(list);
        },
        (error) => {
          console.error(
            "History read error:",
            error
          );

          setChatHistory([]);
        }
      );

      return unsubscribe;
    }, [user?.uid]);

  // === UNREAD COUNT ===
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  // === OPEN NOTIFICATIONS ===
  const handleNotificationsPress = async () => {
    const opening = !showNotifications;

    setShowNotifications(opening);

    if (
      !opening ||
      !user ||
      unreadCount === 0
    ) {
      return;
    }

    try {
      const updatesToMake: Record<
        string,
        boolean
      > = {};

      notifications.forEach(
        (notification) => {
          if (!notification.read) {
            updatesToMake[
              `notifications/${user.uid}/${notification.id}/read`
            ] = true;
          }
        }
      );

      if (
        Object.keys(updatesToMake).length > 0
      ) {
        await update(
          ref(db),
          updatesToMake
        );
      }
    } catch (error) {
      console.error(
        "Could not mark notifications as read:",
        error
      );
    }
  };

  // IMPORTANT:
  // This must come AFTER all hooks
  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient
      colors={["#f8e7f5", "#e9dcfa", "#f6e4ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, padding: 12 }}
    >
      <Pressable style={{ flex: 1 }} onPress={() => setShowNotifications(false)}>
        <BlurView intensity={40} tint="light" style={{ flex: 1 }}>
          <SafeAreaView
            style={[
              styles.container,
              {
                paddingTop: insets.top + 10,
                paddingBottom: insets.bottom + 18,
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              {/* Avatar */}
              <TouchableOpacity onPress={() => router.push("/profile")}>
                <Image
                  source={{ uri: avatarUrl }}
                  style={styles.profileImage}
                />
              </TouchableOpacity>

              {/* Right Icons Group */}
              <View style={styles.rightIcons}>
                {/* Devices Icon */}
                <TouchableOpacity
                  style={styles.iconCircle}
                  onPress={() => router.push("/devices")}
                >
                  <Ionicons
                    name="desktop-outline"
                    size={24}
                    color="#000"
                  />
                </TouchableOpacity>
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
                  onPress={handleNotificationsPress}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={24}
                    color="#000"
                  />
                  {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 9
                      ? "9+"
                      : unreadCount}
                  </Text>
                </View>
)}
                </TouchableOpacity>
                {/* Dropdown */}
                {showNotifications && (
                <View style={styles.dropdown}>
                  {notifications.length === 0 ? (
                    <View style={styles.emptyNotification}>
                      <Ionicons
                        name="notifications-off-outline"
                        size={22}
                        color="#777"
                      />

                      <Text style={styles.emptyNotificationText}>
                        No notifications
                      </Text>
                    </View>
                  ) : (
                    notifications
                      .slice(0, 5)
                      .map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          style={styles.notificationItem}
                        >
                          <Ionicons
                            name={
                              item.type === "success"
                                ? "checkmark-circle-outline"
                                : item.type === "error"
                                ? "alert-circle-outline"
                                : "information-circle-outline"
                            }
                            size={20}
                            color={
                              item.type === "success"
                                ? "#27ae60"
                                : item.type === "error"
                                ? "#c0392b"
                                : "#65058a"
                            }
                            style={{ marginRight: 10 }}
                          />

                          <View style={{ flex: 1 }}>
                            <Text style={styles.notificationTitle}>
                              {item.title}
                            </Text>

                            {!!item.message && (
                              <Text
                                style={styles.notificationText}
                                numberOfLines={2}
                              >
                                {item.message}
                              </Text>
                            )}
                          </View>

                          {!item.read && (
                            <View style={styles.unreadDot} />
                          )}
                        </TouchableOpacity>
                      ))
                  )}
                </View>
              )}
              </View>
            </View>

            {/* Greeting */}
            <Text style={styles.greeting}>
              Welcome to{" "}
              <Text style={styles.highlight}>
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
              data={chatHistory.slice(0, 3)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.historyItem}
                >
                  <View style={styles.historyLeft}>
                    <Ionicons
                      name={
                        item.type === "voice"
                          ? "mic-outline"
                          : "chatbubble-outline"
                      }
                      size={18}
                      color="#65058a"
                    />

                    <Text
                      style={styles.historyText}
                      numberOfLines={1}
                    >
                      {item.message}
                    </Text>
                  </View>

                  <Ionicons
                    name="arrow-forward-outline"
                    size={18}
                    color="#555"
                  />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyHistory}>
                  <Ionicons
                    name="chatbubbles-outline"
                    size={24}
                    color="#777"
                  />

                  <Text style={styles.emptyHistoryText}>
                    No messages yet
                  </Text>
                </View>
              }
            />
          </SafeAreaView>
        </BlurView>
      </Pressable>
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
    paddingHorizontal: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    position: "relative",
    zIndex: 1,
  },

  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    position: "relative",
    zIndex: 50,
    overflow: "visible",
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
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
    marginTop: 25,
    marginBottom: 4,
  },

  highlight: {
    fontFamily: "GreatVibes-Regular",
    fontWeight: "400", // IMPORTANT
    color: "#FF69B4",
    fontSize: 35,
    letterSpacing: 1,
    textShadowColor: "rgba(255,105,180,0.25)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },

  subtitle: {
    fontSize: 16,
    color: "#555",
    fontWeight: "500",
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
    marginLeft: 10,
    marginRight: 10,
    fontSize: 14,
    color: "#222",
  },

  historyLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  emptyHistory: {
    backgroundColor: "rgba(255,255,255,0.45)",
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyHistoryText: {
    marginTop: 6,
    fontSize: 14,
    color: "#777",
  },
  dropdown: {
    position: "absolute",
    top: 55,
    right: 0,
    width: 250,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#f7f1f6",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    zIndex: 999,
    elevation: 999,
  },

  notificationTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
    marginBottom: 2,
  },

  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },

  notificationText: {
    fontSize: 12,
    color: "#666",
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF4D67",
    marginLeft: 8,
  },

  emptyNotification: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 22,
  },

  emptyNotificationText: {
    color: "#777",
    fontSize: 14,
    marginTop: 6,
  },
});
