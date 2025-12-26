'use client';

import { createTheme } from '@mui/material/styles';
import localFont from 'next/font/local';

// Configurar la fuente personalizada Stack Sans Headline
const stackSansHeadline = localFont({
  src: '../assets/fonts/StackSansHeadline.ttf',
  variable: '--font-stack-sans',
  display: 'swap',
});

// Tema minimalista monocromático para PasaTanda
const theme = createTheme({
  typography: {
    fontFamily: stackSansHeadline.style.fontFamily || 'sans-serif',
    fontSize: 14,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#000000',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#000000',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#000000',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#000000',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#000000',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#000000',
    },
    body1: {
      fontSize: '1rem',
      color: '#000000',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#666666',
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FFFFFF',
      contrastText: '#000000',
    },
    error: {
      main: '#FF0000',
    },
    warning: {
      main: '#FFD700',
    },
    success: {
      main: '#00FF00',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F5',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
        contained: {
          backgroundColor: '#000000',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#333333',
          },
        },
        outlined: {
          borderColor: '#000000',
          color: '#000000',
          '&:hover': {
            borderColor: '#333333',
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#1E88E5',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
  },
});

export { theme, stackSansHeadline };
