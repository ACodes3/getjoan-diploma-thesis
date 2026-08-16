export interface SpeechCommand {
  category: string;
  option: string;
  message: string;
}

export function speechToCommand(
  transcript: string
): SpeechCommand | null {
  const text = transcript
    .toLowerCase()
    .trim();

  // ==================================
  // NEED ASSISTANCE
  // ==================================
  const needsAssistance =
    text.includes("help") ||
    text.includes("assistance") ||
    text.includes("need someone");

  if (needsAssistance) {
    if (
      text.includes("call me") ||
      text.includes("call") ||
      text.includes("phone me")
    ) {
      return {
        category: "Need assistance",
        option: "Call me",
        message: "Need assistance — Call me",
      };
    }

    if (
      text.includes("send help") ||
      text.includes("send someone") ||
      text.includes("need someone")
    ) {
      return {
        category: "Need assistance",
        option: "Send help",
        message: "Need assistance — Send help",
      };
    }

    if (
      text.includes("late") ||
      text.includes("delayed")
    ) {
      return {
        category: "Need assistance",
        option: "Running late",
        message: "Need assistance — Running late",
      };
    }
  }

  // ==================================
// I'LL BE LATE
// ==================================
const isLate =
  text.includes("late") ||
  text.includes("delayed") ||
  text.includes("delay");

if (isLate) {
  if (
    /\b(?:5|five)\s+minutes?\b/.test(text)
  ) {
    return {
      category: "I'll be late",
      option: "5 minutes",
      message: "I'll be late — 5 minutes",
    };
  }

  if (
    /\b(?:10|ten)\s+minutes?\b/.test(text)
  ) {
    return {
      category: "I'll be late",
      option: "10 minutes",
      message: "I'll be late — 10 minutes",
    };
  }

  if (
    /\b(?:15|fifteen)\s+minutes?\b/.test(text)
  ) {
    return {
      category: "I'll be late",
      option: "15 minutes",
      message: "I'll be late — 15 minutes",
    };
  }

  if (
    /\b(?:20|twenty)\s+minutes?\b/.test(text)
  ) {
    return {
      category: "I'll be late",
      option: "20 minutes",
      message: "I'll be late — 20 minutes",
    };
  }
}

  // ==================================
  // MEETING STARTED
  // ==================================
  const isMeeting =
    text.includes("meeting");

  if (isMeeting) {
    if (
      text.includes("10 minutes") ||
      text.includes("ten minutes")
    ) {
      return {
        category: "Meeting started",
        option: "In 10 minutes",
        message: "Meeting started — In 10 minutes",
      };
    }

    if (
      text.includes("5 minutes") ||
      text.includes("five minutes")
    ) {
      return {
        category: "Meeting started",
        option: "In 5 minutes",
        message: "Meeting started — In 5 minutes",
      };
    }

    if (
      text.includes("now") ||
      text.includes("started") ||
      text.includes("begin") ||
      text.includes("began")
    ) {
      return {
        category: "Meeting started",
        option: "Now",
        message: "Meeting started — Now",
      };
    }
  }

  // ==================================
  // ARRIVED AT LOCATION
  // ==================================
  const hasArrived =
    text.includes("arrived") ||
    text.includes("i am at") ||
    text.includes("i'm at") ||
    text.includes("reached") ||
    text.includes("got to");

  if (hasArrived) {
    if (
      text.includes("office") ||
      text.includes("work")
    ) {
      return {
        category: "Arrived at location",
        option: "At office",
        message: "Arrived at location — At office",
      };
    }

    if (
      text.includes("client site") ||
      text.includes("client")
    ) {
      return {
        category: "Arrived at location",
        option: "At client site",
        message: "Arrived at location — At client site",
      };
    }

    if (
      text.includes("home") ||
      text.includes("house")
    ) {
      return {
        category: "Arrived at location",
        option: "At home",
        message: "Arrived at location — At home",
      };
    }
  }

  // ==================================
  // NO SUPPORTED COMMAND FOUND
  // ==================================
  return null;
}