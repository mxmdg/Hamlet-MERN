import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { useWindowManager } from './WindowManagerContext';
import { WindowDock } from './WindowDock';

/**
 * Este es el "envoltorio": lo ponés alrededor del área de tu app donde querés que
 * floten las ventanas (puede ser todo el layout, o solo el área de contenido,
 * dejando afuera un sidebar/topbar fijo).
 *
 * - Renderiza tus children normalmente.
 * - Crea la capa (position: relative) donde hacen portal las <FloatingWindow />.
 * - Muestra el dock inferior con las ventanas minimizadas.
 */
export function WindowCanvas({ children, sx, dock = true }) {
  const { setCanvasNode } = useWindowManager();
  const ref = useRef(null);

  useEffect(() => {
    setCanvasNode(ref.current);
    return () => setCanvasNode(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...sx,
      }}
    >
      {children}
      {dock && <WindowDock />}
    </Box>
  );
}
