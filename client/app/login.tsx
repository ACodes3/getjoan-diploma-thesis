import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import Toast from "react-native-toast-message";

import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { auth } from "../firebase";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
        setError("Please enter your email and password.");

        Toast.show({
        type: "info",
        text1: "Missing information",
        text2: "Please enter your email and password.",
        position: "top",
        topOffset: 70,
        visibilityTime: 3000,
        });

        return;
    }

    try {
        setLoading(true);
        setError("");

        await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
        );

        Toast.show({
        type: "success",
        text1: "Welcome back!",
        text2: "You have successfully logged in.",
        position: "top",
        topOffset: 70,
        visibilityTime: 3000,
        });

        router.replace("/(tabs)");
    } catch (error: any) {
        console.error("Login error:", error);

        let message = "Incorrect email or password.";

        if (error?.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
        } else if (
        error?.code === "auth/user-disabled"
        ) {
        message = "This account has been disabled.";
        } else if (
        error?.code === "auth/too-many-requests"
        ) {
        message =
            "Too many login attempts. Please try again later.";
        } else if (
        error?.code === "auth/network-request-failed"
        ) {
        message =
            "Network error. Please check your internet connection.";
        }

        setError(message);

        Toast.show({
        type: "error",
        text1: "Login failed",
        text2: message,
        position: "top",
        topOffset: 70,
        visibilityTime: 3500,
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
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardView}
        >
          {/* Branding */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={34}
                color="#65058a"
              />
            </View>

            <Text style={styles.welcome}>Welcome to</Text>

            <Text style={styles.brand}>
              GetJoan Talk
            </Text>

            <Text style={styles.subtitle}>
              Your Smart Voice & Message Assistant
            </Text>
          </View>

          {/* Login card */}
          <BlurView
            intensity={70}
            tint="light"
            style={styles.card}
          >
            <Text style={styles.loginTitle}>
              Sign in
            </Text>

            <Text style={styles.loginSubtitle}>
              Sign in to continue to GetJoan
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
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

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
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
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

            {error !== "" && (
              <Text style={styles.error}>
                {error}
              </Text>
            )}

            {/* Login */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                loading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              <Ionicons
                name="log-in-outline"
                size={21}
                color="#fff"
              />

              <Text style={styles.loginButtonText}>
                {loading ? "Signing in..." : "Log in"}
              </Text>
            </TouchableOpacity>

            {/* Register */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>
                Don't have an account?{" "}
              </Text>

              <TouchableOpacity
                onPress={() => router.push("/register")}
              >
                <Text style={styles.registerLink}>
                  Sign up
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>

          <Text style={styles.footer}>
            Smart communication made simple.
          </Text>
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
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  // === BRANDING ===
  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.65)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  welcome: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },

  brand: {
    fontFamily: "GreatVibes-Regular",
    fontSize: 45,
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
    marginTop: 3,
    fontSize: 15,
    color: "#555",
    fontWeight: "500",
  },

  // === LOGIN CARD ===
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

  loginTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
  },

  loginSubtitle: {
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

  // === ERROR ===
  error: {
    color: "#c0392b",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },

  // === LOGIN BUTTON ===
  loginButton: {
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

  loginButtonDisabled: {
    opacity: 0.6,
  },

  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },

  // === REGISTER ===
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  registerText: {
    fontSize: 14,
    color: "#555",
  },

  registerLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "#65058a",
  },

  // === FOOTER ===
  footer: {
    textAlign: "center",
    color: "#777",
    fontSize: 13,
    marginTop: 24,
  },
});