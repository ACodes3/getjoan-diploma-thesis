// transcribeSpeech.ts
import { Audio } from "expo-av";
import * as Device from "expo-device";
import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";
import { getApiBase } from "./apiBase";

export const transcribeSpeech = async (
  audioRecordingRef: React.MutableRefObject<Audio.Recording>
) => {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    playsInSilentModeIOS: true,
  });

  const status = await audioRecordingRef.current?.getStatusAsync();
  if (!status) return;

  if (status.isRecording) {
    try {
      await audioRecordingRef.current.stopAndUnloadAsync();
    } catch {}
  } else if (!status.isDoneRecording) {
    console.log("No finished recording to transcribe");
    return;
  }

  try {
    // ensure stopped
    try {
      await audioRecordingRef.current.stopAndUnloadAsync();
    } catch {}

    const uri = audioRecordingRef.current.getURI();
    if (!uri) throw new Error("No recording URI");

    const audioBase64 = await FileSystem.readAsStringAsync(uri, {
      encoding: "base64",
    });

    const rootOrigin =
      Platform.OS === "android"
        ? "10.0.2.2" // Android emulator -> host
        : Device.isDevice
        ? process.env.LOCAL_DEV_IP || "192.168.1.100" // <-- put your LAN IP here
        : "localhost";

    const serverUrl = getApiBase();

    console.log("Transcribing to:", `${serverUrl}/speech-to-text`);
    const resp = await fetch(`${serverUrl}/speech-to-text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audioBase64, config: { languageCode: "en" } }),
    });

    if (!resp.ok) {
      const msg = await resp.text();
      throw new Error(`Backend failed: ${resp.status} ${msg}`);
    }

    const data = await resp.json();
    // AssemblyAI-style response from our backend
    return (data?.text as string) || "";
  } catch (e) {
    console.log("Transcription error:", e);
    return undefined;
  }
};
