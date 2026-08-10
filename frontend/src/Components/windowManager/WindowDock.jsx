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
        bottom: 0,
        display: 'flex',
        height: 36,
        width: '40%',
        gap: 1,
        flexWrap: 'wrap',
        zIndex: 1400,
        pointerEvents: 'none',
       /*  backgroundColor: '#0f0f0f55',
        borderRadius: '12px 12px 0 0',
        padding: 3,
        border: '1px solid #ffffff22',
        backdropFilter: 'blur(2px)', */
      }}
    >
      {minimized.map((w) => (
        <Chip
          key={w.id}
          icon={w.icon || OpenInBrowserIcon}
          label={w.title}
          variant="filled"
          color="primary"
          size="large"
          onClick={() => {
            restoreWindow(w.id);
            focusWindow(w.id);
          }}
          sx={{
            pointerEvents: 'auto',
            borderRadius: 2,
            boxShadow: 10,
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        />
      ))}
    </Box>
  );
}
