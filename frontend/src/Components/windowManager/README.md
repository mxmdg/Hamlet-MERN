# window-manager

Módulo de ventanas flotantes (draggable / minimizable / maximizable / cerrable)
estilo Illustrator/Photoshop, para React + MUI.

## Instalación

Copiá la carpeta `src/` (o su contenido) a tu proyecto, por ejemplo en
`src/components/window-manager/`. No tiene dependencias propias más allá de
`react`, `react-dom` y `@mui/material` + `@mui/icons-material`, que ya usás.

## Piezas

- **`WindowManagerProvider`** — Contexto que guarda posición, tamaño, z-index
  y estado (abierta/minimizada/maximizada) de cada ventana. Va una sola vez,
  arriba de todo (junto a tu `ThemeProvider`).
- **`WindowCanvas`** — El "envoltorio": recibe tus children (el contenido
  normal de tu app) y define el área donde flotan las ventanas + la barra
  inferior (dock) con las minimizadas. Podés tener uno solo cubriendo toda
  la app, o uno por sección si querés confinar las ventanas a un área
  específica (ej: dejando afuera un sidebar fijo).
- **`FloatingWindow`** — Envolvé cualquier panel existente (Calculadora de
  lomo, Numerador, Generador de Rangos, Imposición, etc.) con esto y pasa a
  ser una paleta flotante. Requiere un `id` único.
- **`useWindowManager()`** — Hook para abrir/cerrar/minimizar ventanas desde
  cualquier lado (ej: un botón del menú superior, como en `Example.App.jsx`).

## Uso mínimo

```jsx
import {
  WindowManagerProvider,
  WindowCanvas,
  FloatingWindow,
  useWindowManager,
} from './components/window-manager';

function App() {
  return (
    <WindowManagerProvider>
      <WindowCanvas sx={{ height: '100vh' }}>
        {/* tu app normal */}

        <FloatingWindow id="lomo" title="Calculadora de lomo">
          <MiCalculadoraDeLomoExistente />
        </FloatingWindow>
      </WindowCanvas>
    </WindowManagerProvider>
  );
}
```

Para abrir/cerrar una ventana desde un botón de menú (en vez de que esté
siempre montada):

```jsx
const { openWindow, closeWindow } = useWindowManager();
<Button onClick={() => openWindow('lomo')}>Calculadora de lomo</Button>
```

Ver `Example.App.jsx` para un ejemplo completo con topbar y dos paletas,
inspirado en tu pantalla de Hamlet.

## Personalizar posición / estado inicial

Cada `<FloatingWindow>` acepta:

```jsx
<FloatingWindow
  id="lomo"
  title="Calculadora de lomo"
  defaultPosition={{ x: 520, y: 80 }}
  defaultSize={{ width: 320, height: 300 }}
  defaultOpen={true}       // arranca abierta (default) o cerrada
  defaultMinimized={false} // arranca minimizada/colapsada
  defaultMaximized={false} // arranca ocupando todo el canvas
/>
```

Si necesitás cargar un layout guardado (por usuario, por ejemplo con tu
`useUserPreferences`), pasale `initialLayout` al Provider — tiene prioridad
sobre los `default*` de cada ventana:

```jsx
const { prefs, savePrefs } = useUserPreferences();

<WindowManagerProvider initialLayout={prefs?.windowLayout || {}}>
  ...
</WindowManagerProvider>
```

Y para guardar la disposición actual (posiciones, tamaños, abiertas/cerradas/
minimizadas) en cualquier momento (ej: al desmontar, o con un botón
"Guardar disposición"):

```jsx
const { getLayoutSnapshot } = useWindowManager();

savePrefs({ ...prefs, windowLayout: getLayoutSnapshot() });
```

## Modo grilla en mobile (xs)

Por default, por debajo del breakpoint `sm` de MUI (o sea, en `xs`), las
`<FloatingWindow>` dejan de flotar: no hay drag, no hay resize, no usan
portal — se renderizan como una card normal, en el lugar del árbol donde
las pusiste, con un header simple que colapsa/expande el contenido
(a modo de acordeón) y un botón de cerrar. Así, en el celular, tus paneles
quedan apilados en la grilla normal de la página en vez de flotar.

Se controla con la prop `disableFloatingBelow` del Provider (acepta
cualquier breakpoint de MUI: `'xs' | 'sm' | 'md' | 'lg' | 'xl'`, o `false`
para que floten siempre, incluso en xs):

```jsx
<WindowManagerProvider disableFloatingBelow="sm">  {/* default */}
<WindowManagerProvider disableFloatingBelow="md">  {/* también en tablet */}
<WindowManagerProvider disableFloatingBelow={false}> {/* nunca desactivar */}
```

La posición/tamaño de la ventana no se pierde al cambiar de breakpoint:
si el usuario gira el teléfono o pasa a desktop, la ventana vuelve a flotar
en la última posición/tamaño que tenía.

## Notas de diseño

- El drag/resize usa Pointer Events nativos (sin dependencias extra tipo
  `react-rnd` o `react-draggable`), así que no agrega peso al bundle.
- Cada `FloatingWindow` se registra una sola vez (por `id`) en el contexto;
  si el componente se vuelve a renderizar no pierde su posición/tamaño.
- El z-index se maneja con un contador incremental global: cualquier click
  dentro de una ventana la trae al frente automáticamente.
- Doble click en la barra de título = maximizar/restaurar (como en
  Windows/Illustrator).
- Minimizar no desmonta el contenido: solo lo oculta y agrega un chip al
  dock. Así no perdés el estado interno del panel (valores de inputs, etc.)
  al minimizar.
- Si necesitás persistir posiciones entre sesiones, es fácil: agregar un
  `useEffect` en `WindowManagerContext` que guarde/lea `windows` de
  `localStorage`.
