'use client';

import { createTheme } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Material 3 Light Theme
          primary: {
            main: '#6750A4',
            light: '#9A82DB',
            dark: '#4F378B',
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: '#625B71',
            light: '#938F99',
            dark: '#4A4458',
            contrastText: '#FFFFFF',
          },
          error: {
            main: '#BA1A1A',
            light: '#F2B8B5',
            dark: '#93000A',
          },
          background: {
            default: '#FEF7FF',
            paper: '#FFFBFE',
          },
          text: {
            primary: '#1C1B1F',
            secondary: '#49454F',
          },
        }
      : {
          // Material 3 Dark Theme
          primary: {
            main: '#D0BCFF',
            light: '#EADDFF',
            dark: '#9A82DB',
            contrastText: '#381E72',
          },
          secondary: {
            main: '#CCC2DC',
            light: '#E8DEF8',
            dark: '#B8A9CC',
            contrastText: '#332D41',
          },
          error: {
            main: '#F2B8B5',
            light: '#F9DEDC',
            dark: '#B3261E',
          },
          background: {
            default: '#1C1B1F',
            paper: '#1C1B1F',
          },
          text: {
            primary: '#E6E1E5',
            secondary: '#CAC4D0',
          },
        }),
  },
  typography: {
    fontFamily: '"Google Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 400,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 400,
      fontSize: '2.5rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 400,
      fontSize: '2rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 28, // Material 3 expressive
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          padding: '10px 24px',
          fontSize: '0.875rem',
          fontWeight: 500,
          letterSpacing: '0.1px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});
