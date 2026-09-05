"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";

export default function MessageInput({
  onSend,
  disabled = false,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  // Starts disabled with no reason shown yet — feature/browser detection
  // below is async, and disabled-with-no-tooltip is the correct state for
  // both the server-rendered HTML and the client's first render, so there's
  // no hydration mismatch while that check is still in flight.
  const [micStatus, setMicStatus] = useState<{ available: boolean; blockedReason: string | null }>({
    available: false,
    blockedReason: null,
  });
  const [micError, setMicError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const dictationBaseRef = useRef("");

  useEffect(() => {
    // Feature detection has to happen post-mount, not during render — `window`
    // isn't available during SSR, and reading it at render time would make the
    // client's first render disagree with the server-rendered HTML.
    const constructorExists = Boolean(
      window.SpeechRecognition ?? window.webkitSpeechRecognition
    );

    if (!constructorExists) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMicStatus({
        available: false,
        blockedReason: "Voice input isn't supported in this browser — try Chrome or Edge.",
      });
    } else {
      // Brave IS Chromium, so the SpeechRecognition constructor exists there
      // too — but Brave blocks the Google backend it depends on by default,
      // with no settings toggle to re-enable it (confirmed: not in
      // brave://settings or brave://flags). Detect Brave specifically via
      // its own documented `navigator.brave.isBrave()` API so we can say
      // why up front, instead of letting every attempt fail with the same
      // generic "network" error.
      navigator.brave
        ?.isBrave()
        .then((isBrave) => {
          setMicStatus(
            isBrave
              ? {
                  available: false,
                  blockedReason:
                    "Voice input doesn't work in Brave — it blocks the speech service this depends on. Try Chrome or Edge instead.",
                }
              : { available: true, blockedReason: null }
          );
        })
        .catch(() => setMicStatus({ available: true, blockedReason: null }));
    }

    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const describeMicError = (error: string) => {
    switch (error) {
      case "not-allowed":
      case "permission-denied":
        return "Microphone access is blocked — allow it in your browser's site settings and try again.";
      case "no-speech":
        return "Didn't catch that — try again.";
      case "audio-capture":
        return "No microphone found — check one is connected and selected.";
      case "network":
        return "Voice input needs an internet connection.";
      case "aborted":
        return null;
      default:
        return "Voice input failed — try again.";
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    if (!micStatus.available) return;
    const SpeechRecognitionCtor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-GB";
    recognition.continuous = false;
    recognition.interimResults = true;

    dictationBaseRef.current = value.trim();
    setMicError(null);

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      const base = dictationBaseRef.current;
      setValue(base ? `${base} ${transcript}` : transcript);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setMicError(describeMicError(event.error));
    };
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  return (
    <div className="border-t border-black/10 bg-black/5 p-4 backdrop-blur-xl">
      <div className="flex items-end gap-1.5 rounded-2xl border border-black/10 bg-white/70 py-1.5 pl-3 pr-1.5">
        <button
          type="button"
          className="shrink-0 rounded-full p-2 text-zinc-600 transition-colors duration-300 ease-out hover:text-accent"
          aria-label="Attach file"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4.5 w-4.5"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
          </svg>
        </button>

        <textarea
          rows={1}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask WealthPilot anything about your money..."
          className="max-h-32 flex-1 resize-none bg-transparent py-2 text-sm text-zinc-900 placeholder:text-zinc-600 focus:outline-none"
        />

        <button
          type="button"
          onClick={handleMicClick}
          disabled={!micStatus.available}
          title={micStatus.blockedReason ?? undefined}
          aria-label={isListening ? "Stop voice input" : "Voice input"}
          className={`shrink-0 rounded-full p-2 transition-colors duration-300 ease-out disabled:cursor-not-allowed disabled:opacity-30 ${
            isListening
              ? "bg-accent-soft text-accent shadow-[0_0_16px_var(--accent-glow)]"
              : "text-zinc-600 hover:text-accent"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={`h-4.5 w-4.5 ${isListening ? "animate-pulse" : ""}`}
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
            <path d="M19 10v2a7 7 0 01-14 0v-2" />
            <path d="M12 19v4M8 23h8" />
          </svg>
        </button>

        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className="shrink-0 rounded-full bg-accent-soft p-2.5 text-accent shadow-[0_0_16px_var(--accent-glow)] transition-all duration-300 ease-out hover:bg-accent-border disabled:opacity-40 disabled:shadow-none"
          aria-label="Send message"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      {(micStatus.blockedReason ?? micError) && (
        <p className="mt-2 px-1 text-xs text-amber-400">
          {micStatus.blockedReason ?? micError}
        </p>
      )}
    </div>
  );
}
