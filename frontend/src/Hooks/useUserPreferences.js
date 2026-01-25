// src/Hooks/useUserPreferences.js
import { useState, useEffect, useContext } from "react";
import { json } from "react-router-dom";

const DEFAULT_PREFS = {
  mode: "light",
  variant: "standard",
  color: "primary",
};

export const useUserPreferences = () => {
  const [prefs, setPrefs] = useState(
    JSON.parse(localStorage.getItem("userSettings")),
  );

  useEffect(() => {
    const stored = localStorage.getItem("userSettings");
    if (stored) {
      setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(stored) });
    }
  }, []);

  const savePrefs = (values) => {
    const next = { ...DEFAULT_PREFS, ...values };
    localStorage.setItem("userSettings", JSON.stringify(next));
    setPrefs(next); // 🔥 esto dispara re-render inmediato
  };

  return { prefs, savePrefs };
};
