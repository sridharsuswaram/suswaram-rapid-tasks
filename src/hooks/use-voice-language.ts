"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "rapid-tasks:voice-language";
const DEFAULT_LANGUAGE = "en-US";

export function useVoiceLanguage() {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    // Deferred to an effect — localStorage isn't available during SSR, so the
    // default renders first and is corrected once mounted in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setLanguageState(stored);
  }, []);

  const setLanguage = useCallback((lang: string) => {
    setLanguageState(lang);
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, []);

  return { language, setLanguage };
}
