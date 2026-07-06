"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseVoiceRecorderOptions {
  lang?: string;
}

export function useVoiceRecorder({ lang = "en-US" }: UseVoiceRecorderOptions = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [finalText, setFinalText] = useState("");
  const [interimText, setInterimText] = useState("");

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTextRef = useRef("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    // Deferred to an effect (not a lazy initializer) so server and first client
    // render match — the API is only detectable once we're in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSupported(Boolean(Ctor));
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    clearTimer();
    setIsRecording(false);
  }, [clearTimer]);

  const start = useCallback(() => {
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Ctor) {
      setIsSupported(false);
      return;
    }

    setError(null);
    finalTextRef.current = "";
    setFinalText("");
    setInterimText("");
    setElapsedSeconds(0);

    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0]?.transcript ?? "";
        if (result.isFinal) {
          finalTextRef.current = `${finalTextRef.current} ${text}`.trim();
        } else {
          interim += text;
        }
      }
      setFinalText(finalTextRef.current);
      setInterimText(interim);
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setError("Microphone permission was denied. Allow access and try again.");
      } else if (event.error === "no-speech") {
        setError("No speech detected. Try speaking closer to the mic.");
      } else {
        setError("Voice recognition ran into a problem. Please try again.");
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
      clearTimer();
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    timerRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
  }, [lang, clearTimer]);

  const toggle = useCallback(() => {
    if (isRecording) stop();
    else start();
  }, [isRecording, start, stop]);

  const reset = useCallback(() => {
    finalTextRef.current = "";
    setFinalText("");
    setInterimText("");
    setElapsedSeconds(0);
    setError(null);
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const transcript = `${finalText} ${interimText}`.trim();

  return {
    isRecording,
    isSupported,
    error,
    elapsedSeconds,
    transcript,
    start,
    stop,
    toggle,
    reset,
  };
}
