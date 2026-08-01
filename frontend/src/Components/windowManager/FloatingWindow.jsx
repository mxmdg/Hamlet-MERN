import React, { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import FilterNoneIcon from '@mui/icons-material/FilterNone';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useWindowManager } from './WindowManagerContext';

const TITLEBAR_HEIGHT = 30;

/**
 * Envolvé el contenido de cualquier panel/herramienta con esto y se convierte en una
 * paleta flotante estilo Illustrator/Photoshop: arrastrable, redimensionable,
 * minimizable y cerrable.
 *
 * Props principales:
 *  - id (obligatorio, único)
 *  - title
 *  - icon: <SvgIcon /> opcional, se usa en la barra de título y en el dock
 *  - defaultPosition: { x, y }
 *  - defaultSize: { width, height }
 *  - minWidth / minHeight
 *  - resizable: boolean (default true)
 *  - defaultOpen: boolean (default true)
 *  - onClose: callback opcional cuando el usuario cierra la ventana
 */
export function FloatingWindow({
  id,
  title,
  icon,
  children,
  defaultPosition,
  defaultSize,
  minWidth = 240,
  minHeight = 160,
  resizable = true,
  defaultOpen = true,
  defaultMinimized = true,
  defaultMaximized = false,
  onClose,
}) {
  const {
    windows,
    canvasNode,
    disableFloatingBelow,
    registerWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    openWindow,
    focusWindow,
    updateWindow,
    toggleMaximize,
  } = useWindowManager();

  const theme = useTheme();
  // false = nunca desactivar; si no, usamos el breakpoint que definiste
  // (o dejaste por default) en el <WindowManagerProvider disableFloatingBelow="sm">
  const isMobile = useMediaQuery(
    disableFloatingBelow ? theme.breakpoints.down(disableFloatingBelow) : () => false
  );

  const dragState = useRef(null);
  const resizeState = useRef(null);

  // Registro inicial (una sola vez por id)
  useEffect(() => {
    registerWindow(id, {
      title,
      icon,
      x: defaultPosition?.x,
      y: defaultPosition?.y,
      width: defaultSize?.width,
      height: defaultSize?.height,
      minWidth,
      minHeight,
      resizable,
      defaultOpen,
      defaultMinimized,
      defaultMaximized,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const win = windows[id];

  const getBounds = useCallback(() => {
    if (canvasNode) return canvasNode.getBoundingClientRect();
    return { width: window.innerWidth, height: window.innerHeight, left: 0, top: 0 };
  }, [canvasNode]);

  const handleTitlePointerDown = useCallback(
    (e) => {
      if (!win || win.maximized) return;
      focusWindow(id);
      e.currentTarget.setPointerCapture(e.pointerId);
      dragState.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        originX: win.x,
        originY: win.y,
      };
    },
    [win, id, focusWindow]
  );

  const handleTitlePointerMove = useCallback(
    (e) => {
      const drag = dragState.current;
      if (!drag || drag.pointerId !== e.pointerId) return;
      const bounds = getBounds();
      const deltaX = e.clientX - drag.startX;
      const deltaY = e.clientY - drag.startY;
      let nextX = drag.originX + deltaX;
      let nextY = drag.originY + deltaY;

      // Clampeo para que no se pierda fuera del área visible
      nextX = Math.max(0, Math.min(nextX, bounds.width - 80));
      nextY = Math.max(0, Math.min(nextY, bounds.height - TITLEBAR_HEIGHT));

      updateWindow(id, { x: nextX, y: nextY });
    },
    [getBounds, id, updateWindow]
  );

  const handleTitlePointerUp = useCallback((e) => {
    if (dragState.current && dragState.current.pointerId === e.pointerId) {
      dragState.current = null;
    }
  }, []);

  const handleResizePointerDown = useCallback(
    (e) => {
      if (!win) return;
      e.stopPropagation();
      focusWindow(id);
      e.currentTarget.setPointerCapture(e.pointerId);
      resizeState.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        originWidth: win.width,
        originHeight: win.height,
      };
    },
    [win, id, focusWindow]
  );

  const handleResizePointerMove = useCallback(
    (e) => {
      const resize = resizeState.current;
      if (!resize || resize.pointerId !== e.pointerId) return;
      const bounds = getBounds();
      const deltaX = e.clientX - resize.startX;
      const deltaY = e.clientY - resize.startY;
      let nextWidth = resize.originWidth + deltaX;
      let nextHeight = resize.originHeight + deltaY;

      nextWidth = Math.max(minWidth, Math.min(nextWidth, bounds.width - win.x));
      nextHeight = Math.max(minHeight, Math.min(nextHeight, bounds.height - win.y));

      updateWindow(id, { width: nextWidth, height: nextHeight });
    },
    [getBounds, id, minWidth, minHeight, updateWindow, win]
  );

  const handleResizePointerUp = useCallback((e) => {
    if (resizeState.current && resizeState.current.pointerId === e.pointerId) {
      resizeState.current = null;
    }
  }, []);

  if (!win || !win.isOpen) return null;

  const isFocused = win.zIndex === Math.max(...Object.values(windows).map((w) => w.zIndex));

  // --- Modo grilla (xs / breakpoint configurado): sin drag, sin resize,
  // sin portal — se renderiza donde el componente está en el JSX, como
  // una card normal que colapsa/expande su contenido. ---
  if (isMobile) {
    const collapsed = win.minimized;
    return (
      <Paper
        elevation={20}
        sx={{
          width: '100%',
          mb: 2,
          borderRadius: 1.5,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          onClick={() => (collapsed ? restoreWindow(id) : minimizeWindow(id))}
          sx={{
            minHeight: TITLEBAR_HEIGHT,
            px: 1.25,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'primary.dark',
            color: 'primary.contrastText',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
            {icon}
            <Typography variant="h6" noWrap sx={{ fontWeight: 600, letterSpacing: 0.2 }}>
              {win.title}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.25} onClick={(e) => e.stopPropagation()}>
            <IconButton
              size="small"
              onClick={() => (collapsed ? restoreWindow(id) : minimizeWindow(id))}
              sx={{ color: 'inherit', p: 0.5 }}
              aria-label={collapsed ? 'Expandir' : 'Colapsar'}
            >
              {collapsed ? <ExpandMoreIcon fontSize="small" /> : <ExpandLessIcon fontSize="small" />}
            </IconButton>
            <IconButton
              size="small"
              onClick={() => {
                closeWindow(id);
                onClose && onClose();
              }}
              sx={{ color: 'inherit', p: 0.5, '&:hover': { bgcolor: 'error.main' } }}
              aria-label="Cerrar"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
        <Collapse in={!collapsed}>
          <Box sx={{ bgcolor: 'background.paper' }}>{children}</Box>
        </Collapse>
      </Paper>
    );
  }

  // --- Modo ventana flotante (desktop / tablet) ---
  if (win.minimized || !canvasNode) return null;

  const style = win.maximized
    ? { left: 0, top: 0, width: '100%', height: '100%' }
    : { left: win.x, top: win.y, width: win.width, height: win.height };

  const content = (
    <Paper
      elevation={8}
      onPointerDownCapture={() => focusWindow(id)}
      sx={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 1.5,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: isFocused ? 'primary.light' : 'primary.dark',
        transition: 'border-color 0.2s',
        zIndex: win.zIndex,
        ...style,
      }}
    >
      {/* Barra de título — drag handle */}
      <Box
        onPointerDown={handleTitlePointerDown}
        onPointerMove={handleTitlePointerMove}
        onPointerUp={handleTitlePointerUp}
        onDoubleClick={() => toggleMaximize(id)}
        sx={{
          height: TITLEBAR_HEIGHT,
          minHeight: TITLEBAR_HEIGHT,
          px: 1.25,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: isFocused ? 'primary.main' : 'primary.dark',
          color: 'primary.contrastText',
          cursor: win.maximized ? 'default' : 'grab',
          userSelect: 'none',
          touchAction: 'none',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
          {icon}
          <Typography
            variant="h6"
            noWrap
            sx={{ fontWeight: 600, letterSpacing: 0.2 }}
          >
            {win.title}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={0.25}
          // Clave: corta la propagación ACÁ, antes de que el pointerdown
          // llegue al Box de arriba (la barra draggable) y le haga
          // setPointerCapture. Si no, el click de estos botones nunca llega.
          onPointerDown={(e) => e.stopPropagation()}
        >
          <IconButton
            size="small"
            onClick={() => minimizeWindow(id)}
            sx={{ color: 'inherit', p: 0.5 }}
            aria-label="Minimizar"
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => toggleMaximize(id)}
            sx={{ color: 'inherit', p: 0.5 }}
            aria-label="Maximizar"
          >
            {win.maximized ? <FilterNoneIcon sx={{ fontSize: 14 }} /> : <CropSquareIcon sx={{ fontSize: 14 }} />}
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              closeWindow(id);
              onClose && onClose();
            }}
            sx={{ color: 'inherit', p: 0.5, '&:hover': { bgcolor: 'error.main' } }}
            aria-label="Cerrar"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      {/* Contenido: acá van tus children (Calculadora de lomo, Numerador, etc.) */}
      <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'background.paper' }}>{children}</Box>

      {/* Handle de resize (esquina inferior derecha) */}
      {resizable && !win.maximized && (
        <Box
          onPointerDown={handleResizePointerDown}
          onPointerMove={handleResizePointerMove}
          onPointerUp={handleResizePointerUp}
          sx={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: 16,
            height: 16,
            cursor: 'nwse-resize',
            touchAction: 'none',
            '&::after': {
              content: '""',
              position: 'absolute',
              right: 3,
              bottom: 3,
              width: 8,
              height: 8,
              borderRight: '2px solid',
              borderBottom: '2px solid',
              borderColor: 'divider',
            },
          }}
        />
      )}
    </Paper>
  );

  return createPortal(content, canvasNode);
}
