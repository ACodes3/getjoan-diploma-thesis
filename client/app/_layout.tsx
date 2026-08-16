import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

import { useEffect, useState } from "react";
import "react-native-reanimated";

import { onAuthStateChanged, User } from "firebase/auth";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { auth } from "../firebase";

import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [user, setUser] = useState<User | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  const [loaded, error] = useFonts({
    "GreatVibes-Regular": require("../assets/fonts/GreatVibes-Regular.ttf"),
  });

  // Firebase authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoaded(true);
    });

    return unsubscribe;
  }, []);

  // Hide splash only when fonts AND auth are ready
  useEffect(() => {
    if ((loaded || error) && authLoaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error, authLoaded]);

  if ((!loaded && !error) || !authLoaded) {
    return null;
  }

  return (
    <>
    <ThemeProvider
      value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <Stack>
        {/* User is NOT logged in */}
        <Stack.Protected guard={!user}>
          <Stack.Screen
            name="login"
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="register"
            options={{ headerShown: false }}
          />
        </Stack.Protected>

        {/* User IS logged in */}
        <Stack.Protected guard={!!user}>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="modal"
            options={{
              presentation: "modal",
              title: "Modal",
            }}
          />
        </Stack.Protected>
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
    <Toast />
    </>
  );
}