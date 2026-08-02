// src/Hooks/useUserPreferences.js
import React, { createContext, useContext, useState, useCallback } from "react";

const STORAGE_KEY = "userSettings";

const DEFAULT_PREFS = {
  mode: "light",
  variant: "standard",
  color: "primary",
  themeVariant: "mxm", // paleta de colores (ver Config/theme.js)
};

function readStoredPrefs() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...DEFAULT_PREFS, ...JSON.parse(stored) } : DEFAULT_PREFS;
  } catch {
    // localStorage corrupto o inaccesible (modo privado, etc.): no explota,
    // arranca con los defaults.
    return DEFAULT_PREFS;
  }
}

const UserPreferencesContext = createContext(null);

// Se monta UNA sola vez, arriba de todo (en App.js, junto al resto de los
// providers). Todos los componentes que llamen a useUserPreferences() de
// acá en adelante comparten el MISMO estado en memoria — por eso savePrefs()
// en cualquier componente se ve reflejado al instante en cualquier otro,
// sin necesidad de recargar la página.
export function UserPreferencesProvider({ children }) {
  const [prefs, setPrefs] = useState(readStoredPrefs);

  const savePrefs = useCallback((values) => {
    setPrefs((prev) => {
      const next = { ...DEFAULT_PREFS, ...prev, ...values };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next; // dispara re-render en TODOS los que usan el context
    });
  }, []);

  return (
    <UserPreferencesContext.Provider value={{ prefs, savePrefs }}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

// Mismo nombre, misma forma de siempre: { prefs, savePrefs }. Profile.jsx
// y cualquier otro componente que ya lo use no necesita cambiar ni una
// línea — solo hace falta que <UserPreferencesProvider> esté montado
// arriba en el árbol (ver instrucciones para App.js).
export const useUserPreferences = () => {
  const ctx = useContext(UserPreferencesContext);
  if (!ctx) {
    throw new Error(
      "useUserPreferences debe usarse dentro de <UserPreferencesProvider>. " +
        "¿Falta envolver App.js con el provider?",
    );
  }
  return ctx;
};
