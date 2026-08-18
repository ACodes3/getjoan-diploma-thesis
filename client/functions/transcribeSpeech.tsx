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
    const requestUrl = `${serverUrl}/speech-to-text`;

    console.log(
      "[transcribeSpeech] serverUrl:",
      serverUrl
    );
    console.log(
      "[transcribeSpeech] requestUrl:",
      requestUrl
    );
    console.log(
      "[transcribeSpeech] audio length:",
      audioBase64.length
    );

    const resp = await fetch(requestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audioBase64,
        config: {
          languageCode: "en",
        },
      }),
    });

    const responseText = await resp.text();
    console.log(
      "[transcribeSpeech] backend status:",
      resp.status
    );
    console.log(
      "[transcribeSpeech] backend raw response:",
      responseText
    );

    if (!resp.ok) {
      throw new Error(
        `Backend failed: ${resp.status} ${responseText}`
      );
    }

    const data = JSON.parse(responseText);

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