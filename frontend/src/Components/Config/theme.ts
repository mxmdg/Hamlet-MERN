import { ThemeOptions } from '@mui/material/styles';

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#33ddff',
      light: '#66ddff',
      dark: '#0099dd',
    },
    secondary: {
      main: '#aa00dd',
    },
    warning: {
      main: '#ffff99',
    },
    background: {
      paper: '#232121',
    },
    error: {
      main: '#f50057',
    },
    info: {
      main: '#3377ff',
    },
    success: {
      main: '#00c853',
    },
  },
  typography: {
    fontFamily: 'IBM Plex Sans',
    button: {
      fontWeight: 500,
      fontSize: '0.8rem',
      fontFamily: 'Open Sans',
    },
    h1: {
      fontFamily: 'IBM Plex Sans',
      fontWeight: 100,
    },
    fontWeightLight: 100,
    fontWeightRegular: 500,
    fontWeightMedium: 700,
    fontWeightBold: 900,
  },
};