// app/_layout.tsx
import { Slot } from "expo-router";
import React from "react";
import Toast from "react-native-toast-message";

export default function Layout() {
  return (
    <>
      <Slot />
      <Toast />
    </>
  );
}