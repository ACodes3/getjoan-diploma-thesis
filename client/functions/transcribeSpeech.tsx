// transcribeSpeech.ts
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system/legacy";
import { getApiBase } from "./apiBase";

export const transcribeSpeech = async (
  audioRecordingRef: React.MutableRefObject<Audio.Recording>
) => {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    playsInSilentModeIOS: true,
  });

  const status =
    await audioRecordingRef.current?.getStatusAsync();

  if (!status) return;

  if (status.isRecording) {
    try {
      await audioRecordingRef.current.stopAndUnloadAsync();
    } catch {}
  } else if (!status.isDoneRecording) {
    console.log(
      "No finished recording to transcribe"
    );
    return;
  }

  try {
    // Ensure recording is stopped
    try {
      await audioRecordingRef.current.stopAndUnloadAsync();
    } catch {}

    const uri =
      audioRecordingRef.current.getURI();

    if (!uri) {
      throw new Error(
        "No recording URI"
      );
    }

    const audioBase64 =
      await FileSystem.readAsStringAsync(
        uri,
        {
          encoding: "base64",
        }
      );

    const serverUrl =
      getApiBase();

    console.log(
      "Transcribing to:",
      `${serverUrl}/speech-to-text`
    );

    const resp = await fetch(
      `${serverUrl}/speech-to-text`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          audioBase64,

          config: {
            languageCode: "en",
          },
        }),
      }
    );

    // Backend returned an error
    if (!resp.ok) {
      const msg =
        await resp.text();

      throw new Error(
        `Backend failed: ${resp.status} ${msg}`
      );
    }

    const data =
      await resp.json();

    console.log(
      "🔥 BACKEND RESPONSE:",
      data
    );

    const commandMessage =
      data?.command?.message;

    console.log(
      "🔥 COMMAND MESSAGE:",
      commandMessage
    );

    // Return the predefined command,
    // NOT the raw transcription
    return commandMessage || "";
  } catch (e) {
    console.log(
      "Transcription error:",
      e
    );

    throw e;
  }
};