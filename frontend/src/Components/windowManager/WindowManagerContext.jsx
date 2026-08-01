import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

const WindowManagerContext = createContext(null);

const BASE_Z_INDEX = 1210; // por encima del contenido normal, por debajo de Dialog/Modal de MUI (1300)

/**
 * Envolvé tu app (o la sección donde quieras habilitar ventanas flotantes) con este Provider.
 * Es el "cerebro": guarda posición, tamaño, z-index y estado (abierta / minimizada) de cada
 * ventana registrada, identificada por un id único.
 */
export function WindowManagerProvider({
  children,
  // Breakpoint de MUI por debajo del cual las ventanas dejan de flotar y
  // pasan a renderizarse en línea (grilla normal). 'sm' = se desactiva en xs.
  // Pasá `false` para que floten siempre, incluso en xs.
  disableFloatingBelow = 'sm',
  // Overrides de posición/tamaño/estado por id, típicamente cargados desde
  // preferencias guardadas (ver getLayoutSnapshot más abajo). Tiene prioridad
  // sobre los defaults que le pases a cada <FloatingWindow />.
  initialLayout = {},
}) {
  const [windows, setWindows] = useState({});
  const [canvasNode, setCanvasNode] = useState(null);
  const zCounter = useRef(BASE_Z_INDEX);

  const nextZIndex = useCallback(() => {
    zCounter.current += 1;
    return zCounter.current;
  }, []);

  // Registra una ventana la primera vez que se monta un <FloatingWindow />.
  // Si ya existe, no pisa su posición/tamaño actual (para no "resetear" la ventana
  // cada vez que el componente hijo se vuelve a renderizar).
  const registerWindow = useCallback((id, options = {}) => {
    setWindows((prev) => {
      if (prev[id]) return prev;
      const count = Object.keys(prev).length;
      const {
        title = id,
        x = 60 + (count % 6) * 28,
        y = 60 + (count % 6) * 28,
        width = 340,
        height = 420,
        minWidth = 240,
        minHeight = 160,
        icon = null,
        resizable = true,
        defaultOpen = true,
        defaultMinimized = false,
        defaultMaximized = false,
      } = options;

      // Si hay un layout guardado para este id (ej: cargado desde
      // preferencias del usuario), pisa los defaults de arriba.
      const saved = initialLayout[id] || {};

      return {
        ...prev,
        [id]: {
          id,
          title,
          x: saved.x ?? x,
          y: saved.y ?? y,
          width: saved.width ?? width,
          height: saved.height ?? height,
          minWidth,
          minHeight,
          icon,
          resizable,
          isOpen: saved.isOpen ?? defaultOpen,
          minimized: saved.minimized ?? defaultMinimized,
          maximized: saved.maximized ?? defaultMaximized,
          zIndex: nextZIndex(),
        },
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextZIndex]);

  // Devuelve un objeto liviano { [id]: { x, y, width, height, isOpen, minimized, maximized } }
  // listo para guardar en localStorage, backend, o el mismo useUserPreferences que ya tenés.
  const getLayoutSnapshot = useCallback(() => {
    return Object.fromEntries(
      Object.entries(windows).map(([id, w]) => [
        id,
        {
          x: w.x,
          y: w.y,
          width: w.width,
          height: w.height,
          isOpen: w.isOpen,
          minimized: w.minimized,
          maximized: w.maximized,
        },
      ])
    );
  }, [windows]);

  const unregisterWindow = useCallback((id) => {
    setWindows((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const openWindow = useCallback((id) => {
    setWindows((prev) => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: { ...prev[id], isOpen: true, minimized: false, zIndex: nextZIndex() },
      };
    });
  }, [nextZIndex]);

  const closeWindow = useCallback((id) => {
    setWindows((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id], isOpen: false } } : prev));
  }, []);

  const minimizeWindow = useCallback((id) => {
    setWindows((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id], minimized: true } } : prev));
  }, []);

  const restoreWindow = useCallback((id) => {
    setWindows((prev) =>
      prev[id]
        ? { ...prev, [id]: { ...prev[id], minimized: false, isOpen: true, zIndex: nextZIndex() } }
        : prev
    );
  }, [nextZIndex]);

  const focusWindow = useCallback((id) => {
    setWindows((prev) => {
      if (!prev[id]) return prev;
      // Evita re-renders innecesarios si ya está al frente
      const currentMax = zCounter.current;
      if (prev[id].zIndex === currentMax) return prev;
      return { ...prev, [id]: { ...prev[id], zIndex: nextZIndex() } };
    });
  }, [nextZIndex]);

  const updateWindow = useCallback((id, patch) => {
    setWindows((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id], ...patch } } : prev));
  }, []);

  const toggleMaximize = useCallback((id) => {
    setWindows((prev) => {
      const w = prev[id];
      if (!w) return prev;
      if (w.maximized) {
        const restored = w._preMaximize || {};
        return { ...prev, [id]: { ...w, maximized: false, ...restored, _preMaximize: undefined } };
      }
      return {
        ...prev,
        [id]: {
          ...w,
          maximized: true,
          _preMaximize: { x: w.x, y: w.y, width: w.width, height: w.height },
        },
      };
    });
  }, []);

  const value = {
    windows,
    canvasNode,
    setCanvasNode,
    disableFloatingBelow,
    registerWindow,
    unregisterWindow,
    openWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    focusWindow,
    updateWindow,
    toggleMaximize,
    getLayoutSnapshot,
  };

  return <WindowManagerContext.Provider value={value}>{children}</WindowManagerContext.Provider>;
}

export function useWindowManager() {
  const ctx = useContext(WindowManagerContext);
  if (!ctx) {
    throw new Error('useWindowManager debe usarse dentro de un <WindowManagerProvider>');
  }
  return ctx;
}
