import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import {
  onValue,
  ref,
  update,
} from "firebase/database";

import {
  updateProfile,
} from "firebase/auth";

import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { auth, db } from "@/firebase";

interface UserProfile {
  displayName: string;
  email: string;
  phone: string;
  address: string;
  workPosition: string;
}

export default function Profile() {
  const router = useRouter();

  const user = auth.currentUser;

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    displayName: "",
    email: "",
    phone: "",
    address: "",
    workPosition: "",
  });

  const [editedProfile, setEditedProfile] =
    useState<UserProfile>(profile);

  // Same automatically generated avatar as homepage
  const avatarUrl = user
    ? `https://api.dicebear.com/10.x/lorelei/png?seed=${encodeURIComponent(
        user.uid
      )}&size=200`
    : "";

  // Load profile from Firebase
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const userRef = ref(db, `users/${user.uid}`);

    const unsubscribe = onValue(
      userRef,
      (snapshot) => {
        const data = snapshot.val() || {};

        const fallbackName =
          user.displayName ||
          user.email?.split("@")[0] ||
          "GetJoan User";

        const loadedProfile: UserProfile = {
          displayName:
            data.displayName || fallbackName,
          email:
            user.email || data.email || "",
          phone:
            data.phone || "",
          address:
            data.address || "",
          workPosition:
            data.workPosition || "",
        };

        setProfile(loadedProfile);
        setEditedProfile(loadedProfile);
        setLoading(false);
      },
      (error) => {
        console.error(
          "Profile read error:",
          error
        );

        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const handleEdit = () => {
    setEditedProfile(profile);
    setEditing(true);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setEditing(false);

    Toast.show({
      type: "info",
      text1: "Editing cancelled",
      text2: "Your changes were not saved.",
      position: "top",
      topOffset: 70,
      visibilityTime: 2500,
    });
  };

  const handleSave = async () => {
    if (!user) {
      Toast.show({
        type: "error",
        text1: "User not available",
        text2: "Please log in again and try again.",
        position: "top",
        topOffset: 70,
        visibilityTime: 3500,
      });

      return;
    }

    // === NAME REQUIRED ===
    if (!editedProfile.displayName.trim()) {
      Toast.show({
        type: "info",
        text1: "Missing name",
        text2: "Please enter your name.",
        position: "top",
        topOffset: 70,
        visibilityTime: 3000,
      });

      return;
    }

    // === CHECK IF ANYTHING ACTUALLY CHANGED ===
    const noChanges =
      editedProfile.displayName.trim() === profile.displayName &&
      editedProfile.phone.trim() === profile.phone &&
      editedProfile.address.trim() === profile.address &&
      editedProfile.workPosition.trim() === profile.workPosition;

    if (noChanges) {
      Toast.show({
        type: "info",
        text1: "No changes",
        text2: "You haven't changed any profile information.",
        position: "top",
        topOffset: 70,
        visibilityTime: 3000,
      });

      return;
    }

    try {
      setSaving(true);

      const updated = {
        ...editedProfile,
        displayName: editedProfile.displayName.trim(),
        phone: editedProfile.phone.trim(),
        address: editedProfile.address.trim(),
        workPosition: editedProfile.workPosition.trim(),
      };

      // === UPDATE FIREBASE DATABASE ===
      await update(
        ref(db, `users/${user.uid}`),
        {
          displayName: updated.displayName,
          phone: updated.phone,
          address: updated.address,
          workPosition: updated.workPosition,
        }
      );

      // === UPDATE FIREBASE AUTH NAME ===
      await updateProfile(user, {
        displayName: updated.displayName,
      });

      setProfile(updated);
      setEditedProfile(updated);
      setEditing(false);

      // === SUCCESS ===
      Toast.show({
        type: "success",
        text1: "Profile updated",
        text2: "Your changes were saved successfully.",
        position: "top",
        topOffset: 70,
        visibilityTime: 3000,
      });
    } catch (error: any) {
      console.error(
        "Profile update error:",
        error?.code,
        error
      );

      let title = "Update failed";
      let message =
        "Could not update your profile. Please try again.";

      // === NETWORK ===
      if (
        error?.code === "auth/network-request-failed"
      ) {
        title = "Network error";
        message =
          "Please check your internet connection and try again.";
      }

      // === AUTH USER TOO OLD / REAUTH NEEDED ===
      else if (
        error?.code === "auth/requires-recent-login"
      ) {
        title = "Authentication required";
        message =
          "Please log in again before changing your profile.";
      }

      // === FIREBASE PERMISSION ===
      else if (
        error?.code === "PERMISSION_DENIED" ||
        error?.code === "permission-denied"
      ) {
        title = "Permission denied";
        message =
          "You do not have permission to update this profile.";
      }

      Toast.show({
        type: "error",
        text1: title,
        text2: message,
        position: "top",
        topOffset: 70,
        visibilityTime: 4000,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={[
          "#f8e7f5",
          "#e9dcfa",
          "#f6e4ff",
        ]}
        style={styles.loadingContainer}
      >
        <ActivityIndicator
          size="large"
          color="#65058a"
        />
      </LinearGradient>
    );
  }

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
      <SafeAreaView style={styles.container}>
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
            Profile
          </Text>

          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.scrollContent
          }
        >
          {/* === PROFILE INFO === */}
          <View style={styles.profileSection}>
            <Image
              source={{ uri: avatarUrl }}
              style={styles.avatar}
            />

            {!editing ? (
              <>
                <Text style={styles.name}>
                  {profile.displayName}
                </Text>

                <Text style={styles.role}>
                  {profile.workPosition ||
                    "GetJoan user"}
                </Text>
              </>
            ) : (
              <View style={styles.nameEditContainer}>
                <TextInput
                  style={styles.nameInput}
                  value={
                    editedProfile.displayName
                  }
                  onChangeText={(value) =>
                    setEditedProfile({
                      ...editedProfile,
                      displayName: value,
                    })
                  }
                  placeholder="Your name"
                />
              </View>
            )}
          </View>

          {/* === INFO CARDS === */}
          <View style={styles.infoContainer}>
            {/* EMAIL */}
            <View style={styles.infoWrapper}>
              <BlurView
                intensity={70}
                tint="light"
                style={styles.infoCard}
              >
                <Ionicons
                  name="mail-outline"
                  size={22}
                  color="#333"
                />

                <Text style={styles.infoText}>
                  {profile.email}
                </Text>
              </BlurView>
            </View>

            {/* PHONE */}
            <View style={styles.infoWrapper}>
              <BlurView
                intensity={70}
                tint="light"
                style={styles.infoCard}
              >
                <Feather
                  name="phone"
                  size={22}
                  color="#333"
                />

                {editing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={
                      editedProfile.phone
                    }
                    onChangeText={(value) =>
                      setEditedProfile({
                        ...editedProfile,
                        phone: value,
                      })
                    }
                    placeholder="Phone number"
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text style={styles.infoText}>
                    {profile.phone ||
                      "No phone number"}
                  </Text>
                )}
              </BlurView>
            </View>

            {/* ADDRESS */}
            <View style={styles.infoWrapper}>
              <BlurView
                intensity={70}
                tint="light"
                style={styles.infoCard}
              >
                <Ionicons
                  name="location-outline"
                  size={22}
                  color="#333"
                />

                {editing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={
                      editedProfile.address
                    }
                    onChangeText={(value) =>
                      setEditedProfile({
                        ...editedProfile,
                        address: value,
                      })
                    }
                    placeholder="Address"
                  />
                ) : (
                  <Text style={styles.infoText}>
                    {profile.address ||
                      "No address"}
                  </Text>
                )}
              </BlurView>
            </View>

            {/* WORK POSITION */}
            <View style={styles.infoWrapper}>
              <BlurView
                intensity={70}
                tint="light"
                style={styles.infoCard}
              >
                <MaterialIcons
                  name="work-outline"
                  size={22}
                  color="#333"
                />

                {editing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={
                      editedProfile.workPosition
                    }
                    onChangeText={(value) =>
                      setEditedProfile({
                        ...editedProfile,
                        workPosition: value,
                      })
                    }
                    placeholder="Developer, Manager..."
                  />
                ) : (
                  <Text style={styles.infoText}>
                    {profile.workPosition ||
                      "No work position"}
                  </Text>
                )}
              </BlurView>
            </View>
          </View>

          {/* === BUTTONS === */}

          {!editing ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEdit}
            >
              <Ionicons
                name="create-outline"
                size={20}
                color="#fff"
              />

              <Text style={styles.editText}>
                Edit Profile
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={[
                  styles.editButton,
                  saving &&
                    styles.disabledButton,
                ]}
                onPress={handleSave}
                disabled={saving}
              >
                <Ionicons
                  name="checkmark-outline"
                  size={22}
                  color="#fff"
                />

                <Text style={styles.editText}>
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                disabled={saving}
              >
                <Text style={styles.cancelText}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
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

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollContent: {
    paddingBottom: 40,
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
    backgroundColor:
      "rgba(255,255,255,0.6)",
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
    borderColor:
      "rgba(255,255,255,0.7)",
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

  nameEditContainer: {
    width: "75%",
    marginTop: 5,
  },

  nameInput: {
    backgroundColor:
      "rgba(255,255,255,0.65)",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },

  // === INFO CARDS ===
  infoContainer: {
    marginBottom: 30,
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
    backgroundColor:
      "rgba(255,255,255,0.5)",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.4)",
  },

  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
  },

  infoInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#111",
    paddingVertical: 0,
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

  disabledButton: {
    opacity: 0.6,
  },

  editText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },

  cancelButton: {
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 8,
  },

  cancelText: {
    color: "#65058a",
    fontWeight: "600",
    fontSize: 15,
  },
});