// The Web Speech API's SpeechRecognition interface isn't part of TypeScript's
// standard DOM lib (it's non-standard, Chromium/Safari only — not Firefox).
// Minimal ambient types for the subset MessageInput.tsx actually uses.
export {};

declare global {
  interface SpeechRecognitionAlternative {
    transcript: string;
  }

  interface SpeechRecognitionResultLike {
    readonly length: number;
    [index: number]: SpeechRecognitionAlternative;
    isFinal: boolean;
  }

  interface SpeechRecognitionResultList {
    readonly length: number;
    [index: number]: SpeechRecognitionResultLike;
  }

  interface SpeechRecognitionEventLike extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionErrorEventLike extends Event {
    error: string;
    message?: string;
  }

  interface SpeechRecognitionLike extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onresult: ((event: SpeechRecognitionEventLike) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
    onend: (() => void) | null;
    start: () => void;
    stop: () => void;
  }

  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }

  // Brave's own documented self-identification API — the `SpeechRecognition`
  // constructor exists in Brave (it's Chromium), but Brave silently blocks
  // the Google backend it depends on, so a plain feature-detect isn't enough.
  interface Navigator {
    brave?: {
      isBrave: () => Promise<boolean>;
    };
  }
}
