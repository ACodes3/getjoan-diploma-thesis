// apiBase.ts
import * as Device from "expo-device";
import { NativeModules, Platform } from "react-native";

export function getApiBase() {
  // Simulators
  if (!Device.isDevice) {
    if (Platform.OS === "android") return "http://10.0.2.2:4000"; // Android emulator -> host
    return "http://localhost:4000"; // iOS simulator
  }

  // Real device (Expo Go) -> reuse Metro host
  // @ts-ignore
  const scriptURL: string | undefined = NativeModules?.SourceCode?.scriptURL;
  if (scriptURL) {
    try {
      const host = scriptURL.split("://")[1].split(":")[0];
      return `http://${host}:4000`;
    } catch {}
  }

  // Fallback: use .env (EXPO_PUBLIC_API_BASE). Optionally keep a hard default.
  const envBase = process.env.EXPO_PUBLIC_API_BASE;
  return envBase ? envBase.replace(/\/+$/, "") : "";
}
