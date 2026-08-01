import React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useWindowManager } from './WindowManagerContext';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';

export function WindowDock() {
  const { windows, disableFloatingBelow, restoreWindow, focusWindow } = useWindowManager();
  const theme = useTheme();
  const isMobile = useMediaQuery(
    disableFloatingBelow ? theme.breakpoints.down(disableFloatingBelow) : () => false
  );

  // En modo grilla las ventanas colapsan in-line (su propio header hace de
  // "dock"), así que el dock flotante de abajo no tiene sentido acá.
  if (isMobile) return null;

  const minimized = Object.values(windows).filter((w) => w.isOpen && w.minimized);

  if (minimized.length === 0) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 12,
        bottom: 12,
        display: 'flex',
        gap: 1,
        flexWrap: 'wrap',
        zIndex: 1400,
        pointerEvents: 'none',
      }}
    >
      {minimized.map((w) => (
        <Chip
          key={w.id}
          icon={w.icon || OpenInBrowserIcon}
          label={w.title}
          variant="outlined"
          color="primary"
          size="large"
          onClick={() => {
            restoreWindow(w.id);
            focusWindow(w.id);
          }}
          sx={{
            pointerEvents: 'auto',
            borderRadius: 2,
            bgcolor: '#00000066',
            backDropFilter: 'blur(10px)',
            boxShadow: 10,
            '&:hover': { bgcolor: 'action.hover' },
          }}
        />
      ))}
    </Box>
  );
}
