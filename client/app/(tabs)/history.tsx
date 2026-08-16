import { auth, db } from "@/firebase";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  onValue,
  ref,
  remove,
} from "firebase/database";
import React, {
  useEffect,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

interface HistoryItem {
  id: string;
  type: "manual" | "voice";
  message: string;
  createdAt: number;
}

export default function History() {
  const router = useRouter();

  const user = auth.currentUser;

  const [history, setHistory] =
    useState<HistoryItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [clearing, setClearing] =
    useState(false);

  // === LOAD HISTORY FROM FIREBASE ===
  useEffect(() => {
    if (!user) {
      setHistory([]);
      setLoading(false);
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
          setHistory([]);
          setLoading(false);
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

        setHistory(list);
        setLoading(false);
      },
      (error) => {
        console.error(
          "History read error:",
          error
        );

        setHistory([]);
        setLoading(false);

        Toast.show({
          type: "error",
          text1: "History unavailable",
          text2:
            "Could not load your message history.",
          position: "top",
          topOffset: 70,
          visibilityTime: 3500,
        });
      }
    );

    return unsubscribe;
  }, [user?.uid]);

  // === CLEAR ALL HISTORY ===
  const clearHistory = async () => {
    if (!user || history.length === 0) {
      Toast.show({
        type: "info",
        text1: "History is empty",
        text2:
          "There is no message history to clear.",
        position: "top",
        topOffset: 70,
        visibilityTime: 2500,
      });

      return;
    }

    try {
      setClearing(true);

      await remove(
        ref(db, `history/${user.uid}`)
      );

      Toast.show({
        type: "success",
        text1: "History cleared",
        text2:
          "Your message history was successfully deleted.",
        position: "top",
        topOffset: 70,
        visibilityTime: 3000,
      });
    } catch (error) {
      console.error(
        "History clear error:",
        error
      );

      Toast.show({
        type: "error",
        text1: "Could not clear history",
        text2:
          "Please try again.",
        position: "top",
        topOffset: 70,
        visibilityTime: 3500,
      });
    } finally {
      setClearing(false);
    }
  };

  // === FORMAT DATE ===
  const formatDate = (
    timestamp: number
  ) => {
    if (!timestamp) {
      return "";
    }

    return new Date(
      timestamp
    ).toLocaleString();
  };

  return (
    <LinearGradient
      colors={[
        "#f8e7f5",
        "#e9dcfa",
        "#f6e4ff",
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView
        style={styles.container}
      >
        {/* === HEADER === */}
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
            History
          </Text>

          <TouchableOpacity
            style={[
              styles.iconButtonSmall,
              (history.length === 0 ||
                clearing) &&
                styles.disabledButton,
            ]}
            onPress={clearHistory}
            disabled={
              history.length === 0 ||
              clearing
            }
          >
            <Ionicons
              name={
                clearing
                  ? "hourglass-outline"
                  : "trash-outline"
              }
              size={22}
              color="#333"
            />
          </TouchableOpacity>
        </View>

        {/* === LOADING === */}
        {loading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator
              size="large"
              color="#65058a"
            />

            <Text style={styles.loadingText}>
              Loading history...
            </Text>
          </View>
        ) : history.length === 0 ? (
          /* === EMPTY STATE === */
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="time-outline"
                size={45}
                color="#65058a"
              />
            </View>

            <Text style={styles.emptyTitle}>
              No history yet
            </Text>

            <Text style={styles.emptyText}>
              Your sent Quick Messages and
              voice messages will appear here.
            </Text>
          </View>
        ) : (
          /* === HISTORY LIST === */
          <FlatList
            data={history}
            keyExtractor={(item) =>
              item.id
            }
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={{
              paddingBottom: 40,
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.9}
              >
                <BlurView
                  intensity={60}
                  tint="light"
                  style={
                    styles.historyCard
                  }
                >
                  <View
                    style={styles.cardLeft}
                  >
                    {/* TYPE ICON */}
                    <View
                      style={
                        styles.historyIcon
                      }
                    >
                      <Ionicons
                        name={
                          item.type ===
                          "voice"
                            ? "mic-outline"
                            : "chatbubble-outline"
                        }
                        size={22}
                        color="#65058a"
                      />
                    </View>

                    <View
                      style={
                        styles.messageContainer
                      }
                    >
                      <Text
                        style={
                          styles.historyTitle
                        }
                      >
                        {item.message}
                      </Text>

                      <View
                        style={
                          styles.metaRow
                        }
                      >
                        <Text
                          style={
                            styles.typeText
                          }
                        >
                          {item.type ===
                          "voice"
                            ? "Voice message"
                            : "Quick message"}
                        </Text>

                        <Text
                          style={
                            styles.historyDate
                          }
                        >
                          {formatDate(
                            item.createdAt
                          )}
                        </Text>
                      </View>
                    </View>
                  </View>
                </BlurView>
              </TouchableOpacity>
            )}
          />
        )}
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
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },

  iconButtonSmall: {
    backgroundColor:
      "rgba(255,255,255,0.6)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.4,
  },

  // === HISTORY CARD ===
  historyCard: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 12,

    backgroundColor:
      "rgba(255,255,255,0.5)",

    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.4)",

    overflow: "hidden",
  },

  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  historyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",

    backgroundColor:
      "rgba(255,255,255,0.7)",
  },

  messageContainer: {
    flex: 1,
    marginLeft: 12,
  },

  historyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    marginBottom: 6,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },

  typeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#65058a",
    marginRight: 10,
  },

  historyDate: {
    fontSize: 12,
    color: "#777",
  },

  // === LOADING ===
  loadingState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#777",
    fontSize: 14,
    marginTop: 10,
  },

  // === EMPTY ===
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,

    backgroundColor:
      "rgba(255,255,255,0.55)",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 16,
  },

  emptyTitle: {
    color: "#222",
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 6,
  },

  emptyText: {
    color: "#777",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});