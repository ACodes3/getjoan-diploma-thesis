import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { MutableRefObject } from "react";
import { Platform } from "react-native";

export const recordSpeech = async (
  audioRecordingRef: MutableRefObject<Audio.Recording | null>,
  setIsRecording: (v: boolean) => void,
  _alreadyReceivedPermission?: boolean // not needed anymore
) => {
  try {
    // 0) Safely stop & unload any previous recorder
    if (audioRecordingRef.current) {
      try {
        const prevStatus = await audioRecordingRef.current.getStatusAsync();
        if (prevStatus?.isRecording) {
          console.log("[recordSpeech] stopping previous recording...");
          await audioRecordingRef.current.stopAndUnloadAsync();
        }
      } catch (err) {
        // avoid throwing if already unloaded
        console.warn(
          "[recordSpeech] previous recorder cleanup issue:",
          (err as any)?.message || err
        );
      } finally {
        audioRecordingRef.current = null;
      }
    }

    // 1) Configure audio mode
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      shouldDuckAndroid: true,
      staysActiveInBackground: false,
    });

    // 2) Request mic permission (Expo Go may revoke between runs)
    if (Platform.OS !== "web") {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status !== "granted") {
        throw new Error("Mic permission not granted");
      }
    }

    // 3) Fresh instance + prepare
    audioRecordingRef.current = new Audio.Recording();
    await audioRecordingRef.current.prepareToRecordAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    console.log("prepared:", await audioRecordingRef.current.getStatusAsync());

    // 4) Start recording
    await audioRecordingRef.current.startAsync();

    // 5) Verify start
    const started = await audioRecordingRef.current.getStatusAsync();
    if (!started?.isRecording) throw new Error("Recorder did not start");

    setIsRecording(true);
    console.log("started:", started);
  } catch (err: any) {
    console.error("Failed to start recording", err);

    // keep UI consistent
    setIsRecording(false);

    // Optional: show a friendly message
    const raw = String(err?.message || err);
    let msg = "Couldn't start recording.";
    if (/permission/i.test(raw)) {
      msg = "Microphone permission was not granted.";
    } else if (/setAudioModeAsync|Audio mode/i.test(raw)) {
      msg = "Failed to configure audio mode.";
    } else if (/prepare/i.test(raw)) {
      msg = "Failed to prepare the recorder.";
    } else if (/start/i.test(raw)) {
      msg = "Failed to start the recorder.";
    }

    if (__DEV__ && Platform.OS === "android") {
      console.log(
        "[recordSpeech] tips:",
        '- Ensure app.json includes android.permissions: ["RECORD_AUDIO"].',
        "- On emulator: Extended controls → Microphone → enable host audio.",
        "- Try a real device if emulator mic is disabled.",
        "- Avoid double-tapping the button."
      );
    }

    try {
      const { Alert } = await import("react-native");
      Alert.alert("Recording error", msg);
    } catch {}
  }
};
