import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import React, { useState } from "react";
import Toast from "react-native-toast-message";

import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { auth, db } from "../firebase";

const workPositions = [
  "Developer",
  "Manager",
  "Designer",
  "Product Manager",
  "HR",
  "Marketing",
  "Administration",
  "Other",
];

export default function Register() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [workPosition, setWorkPosition] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showPositions, setShowPositions] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();
    const cleanAddress = address.trim();

    // === MISSING FIELDS ===
    if (
        !cleanEmail ||
        !cleanPhone ||
        !cleanAddress ||
        !workPosition ||
        !password ||
        !confirmPassword
    ) {
        const message = "Please fill in all required fields.";

        setError(message);

        Toast.show({
        type: "info",
        text1: "Missing information",
        text2: message,
        position: "top",
        topOffset: 70,
        visibilityTime: 3000,
        });

        return;
    }

    // === SIMPLE EMAIL VALIDATION ===
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
        const message = "Please enter a valid email address.";

        setError(message);

        Toast.show({
        type: "info",
        text1: "Invalid email",
        text2: message,
        position: "top",
        topOffset: 70,
        visibilityTime: 3000,
        });

        return;
    }

    // === PASSWORD MISMATCH ===
    if (password !== confirmPassword) {
        const message =
        "Please enter the same password in both fields.";

        setError("Passwords do not match.");

        Toast.show({
        type: "error",
        text1: "Passwords do not match",
        text2: message,
        position: "top",
        topOffset: 70,
        visibilityTime: 3000,
        });

        return;
    }

    // === PASSWORD TOO SHORT ===
    if (password.length < 6) {
        const message =
        "Your password must contain at least 6 characters.";

        setError(message);

        Toast.show({
        type: "info",
        text1: "Password too short",
        text2: message,
        position: "top",
        topOffset: 70,
        visibilityTime: 3000,
        });

        return;
    }

    try {
        setLoading(true);
        setError("");

        // === CREATE AUTH USER ===
        const userCredential =
        await createUserWithEmailAndPassword(
            auth,
            cleanEmail,
            password
        );

        const user = userCredential.user;

        // === SAVE PROFILE DATA ===
        await set(ref(db, `users/${user.uid}`), {
        email: cleanEmail,
        phone: cleanPhone,
        address: cleanAddress,
        workPosition,
        createdAt: new Date().toISOString(),
        });

        console.log("✅ Account created:", user.uid);

        // === SUCCESS ===
        Toast.show({
        type: "success",
        text1: "Account created!",
        text2: "Welcome to GetJoan Talk.",
        position: "top",
        topOffset: 70,
        visibilityTime: 3500,
        });

        router.replace("/(tabs)");
    } catch (error: any) {
        console.error(
        "Registration error:",
        error?.code,
        error
        );

        let title = "Registration failed";
        let errorMessage =
        "Could not create your account. Please try again.";

        switch (error?.code) {
        // === EMAIL ALREADY EXISTS ===
        case "auth/email-already-in-use":
            title = "Email already registered";
            errorMessage =
            "An account with this email already exists.";
            break;

        // === INVALID EMAIL ===
        case "auth/invalid-email":
            title = "Invalid email";
            errorMessage =
            "Please enter a valid email address.";
            break;

        // === WEAK / INVALID PASSWORD ===
        case "auth/weak-password":
            title = "Weak password";
            errorMessage =
            "Please choose a stronger password.";
            break;

        case "auth/password-does-not-meet-requirements":
            title = "Password requirements";
            errorMessage =
            "Your password does not meet the required security rules.";
            break;

        // === EMAIL/PASSWORD AUTH DISABLED ===
        case "auth/operation-not-allowed":
            title = "Registration unavailable";
            errorMessage =
            "Email and password registration is currently unavailable.";
            break;

        // === TOO MANY REQUESTS ===
        case "auth/too-many-requests":
            title = "Too many attempts";
            errorMessage =
            "Too many registration attempts. Please try again later.";
            break;

        // === NETWORK ===
        case "auth/network-request-failed":
            title = "Network error";
            errorMessage =
            "Please check your internet connection and try again.";
            break;

        // === APP / FIREBASE CONFIG ISSUE ===
        case "auth/app-not-authorized":
            title = "App not authorized";
            errorMessage =
            "This application is not authorized to use Firebase Authentication.";
            break;

        case "auth/invalid-api-key":
            title = "Configuration error";
            errorMessage =
            "Firebase Authentication is not configured correctly.";
            break;

        // === GENERIC ===
        default:
            title = "Registration failed";
            errorMessage =
            "Could not create your account. Please try again.";
            break;
        }

        setError(errorMessage);

        Toast.show({
        type: "error",
        text1: title,
        text2: errorMessage,
        position: "top",
        topOffset: 70,
        visibilityTime: 4000,
        });
    } finally {
        setLoading(false);
    }
    };

  return (
    <LinearGradient
      colors={["#f8e7f5", "#e9dcfa", "#f6e4ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Back */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons
                name="chevron-back"
                size={22}
                color="#333"
              />
            </TouchableOpacity>

            {/* Branding */}
            <View style={styles.header}>
              <View style={styles.logoCircle}>
                <Ionicons
                  name="person-add-outline"
                  size={32}
                  color="#65058a"
                />
              </View>

              <Text style={styles.welcome}>
                Join
              </Text>

              <Text style={styles.brand}>
                GetJoan Talk
              </Text>

              <Text style={styles.subtitle}>
                Create your account to get started
              </Text>
            </View>

            {/* Register Card */}
            <BlurView
              intensity={70}
              tint="light"
              style={styles.card}
            >
              <Text style={styles.registerTitle}>
                Create account
              </Text>

              <Text style={styles.registerSubtitle}>
                Enter your details below
              </Text>

              {/* Email */}
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={21}
                  color="#555"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#777"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                />
              </View>

              {/* Phone */}
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="call-outline"
                  size={21}
                  color="#555"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Phone"
                  placeholderTextColor="#777"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Address */}
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="location-outline"
                  size={21}
                  color="#555"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  placeholderTextColor="#777"
                  value={address}
                  onChangeText={setAddress}
                />
              </View>

              {/* Work Position */}
              <TouchableOpacity
                style={styles.inputWrapper}
                activeOpacity={0.8}
                onPress={() =>
                  setShowPositions(!showPositions)
                }
              >
                <Ionicons
                  name="briefcase-outline"
                  size={21}
                  color="#555"
                />

                <Text
                  style={[
                    styles.positionText,
                    !workPosition &&
                      styles.positionPlaceholder,
                  ]}
                >
                  {workPosition || "Work position"}
                </Text>

                <Ionicons
                  name={
                    showPositions
                      ? "chevron-up"
                      : "chevron-down"
                  }
                  size={19}
                  color="#555"
                />
              </TouchableOpacity>

              {showPositions && (
                <View style={styles.positionMenu}>
                  {workPositions.map((position) => (
                    <TouchableOpacity
                      key={position}
                      style={styles.positionOption}
                      onPress={() => {
                        setWorkPosition(position);
                        setShowPositions(false);
                      }}
                    >
                      <Text style={styles.positionOptionText}>
                        {position}
                      </Text>

                      {workPosition === position && (
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color="#65058a"
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Password */}
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={21}
                  color="#555"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#777"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />

                <TouchableOpacity
                  onPress={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  <Ionicons
                    name={
                      showPassword
                        ? "eye-off-outline"
                        : "eye-outline"
                    }
                    size={21}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password */}
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={21}
                  color="#555"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Confirm password"
                  placeholderTextColor="#777"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                />
              </View>

              {error !== "" && (
                <Text style={styles.error}>
                  {error}
                </Text>
              )}

              {/* Register */}
              <TouchableOpacity
                style={[
                  styles.registerButton,
                  loading &&
                    styles.registerButtonDisabled,
                ]}
                activeOpacity={0.85}
                disabled={loading}
                onPress={handleRegister}
              >
                <Ionicons
                  name="person-add-outline"
                  size={21}
                  color="#fff"
                />

                <Text style={styles.registerButtonText}>
                  {loading
                    ? "Creating account..."
                    : "Create account"}
                </Text>
              </TouchableOpacity>

              {/* Back to login */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>
                  Already have an account?{" "}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    router.replace("/login")
                  }
                >
                  <Text style={styles.loginLink}>
                    Log in
                  </Text>
                </TouchableOpacity>
              </View>
            </BlurView>

            <Text style={styles.footer}>
              Smart communication made simple.
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
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
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 40,
    justifyContent: "center",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.6)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  // === BRANDING ===
  header: {
    alignItems: "center",
    marginBottom: 24,
  },

  logoCircle: {
    width: 66,
    height: 66,
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

  welcome: {
    fontSize: 21,
    fontWeight: "700",
    color: "#111",
  },

  brand: {
    fontFamily: "GreatVibes-Regular",
    fontSize: 43,
    color: "#FF69B4",
    letterSpacing: 1,

    textShadowColor: "rgba(255,105,180,0.25)",
    textShadowOffset: {
      width: 0,
      height: 3,
    },
    textShadowRadius: 6,
  },

  subtitle: {
    marginTop: 2,
    fontSize: 15,
    color: "#555",
    fontWeight: "500",
  },

  // === CARD ===
  card: {
    borderRadius: 28,
    padding: 24,
    overflow: "hidden",

    backgroundColor: "rgba(255,255,255,0.45)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  registerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
  },

  registerSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 24,
  },

  // === INPUTS ===
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "rgba(255,255,255,0.65)",

    borderRadius: 18,
    paddingHorizontal: 15,
    marginBottom: 14,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
  },

  input: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#111",
  },

  positionText: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#111",
  },

  positionPlaceholder: {
    color: "#777",
  },

  // === WORK POSITION MENU ===
  positionMenu: {
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 18,
    marginTop: -5,
    marginBottom: 14,
    overflow: "hidden",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
  },

  positionOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingVertical: 12,
    paddingHorizontal: 17,

    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },

  positionOptionText: {
    fontSize: 15,
    color: "#222",
  },

  // === ERROR ===
  error: {
    color: "#c0392b",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },

  // === BUTTON ===
  registerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#65058a",

    paddingVertical: 15,
    borderRadius: 28,

    marginTop: 6,

    shadowColor: "#65058a",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },

  registerButtonDisabled: {
    opacity: 0.6,
  },

  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },

  // === LOGIN LINK ===
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  loginText: {
    fontSize: 14,
    color: "#555",
  },

  loginLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "#65058a",
  },

  footer: {
    textAlign: "center",
    color: "#777",
    fontSize: 13,
    marginTop: 24,
  },
});