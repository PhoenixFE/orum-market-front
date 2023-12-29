import React from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/navbar/Header';
import { ThemeProvider, Toolbar, createTheme } from '@mui/material';
import { BreadcrumbsNavBar } from './components/BreadcrumbsNavBar';
import ScrollTop from './components/ScrollTop';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Fab from '@mui/material/Fab';
import { useMemo, useState } from 'react';
import Footer from './components/Footer';
import { useScrollToTop } from './hooks/useScrollToTop';

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

declare module '@mui/material/styles' {
  interface Palette {
    accent?: Palette['primary'];
  }
  interface PaletteOptions {
    accent?: PaletteOptions['primary'];
  }
}

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  useScrollToTop();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#EF5B2A',
            contrastText: '#301C3B',
          },
          secondary: {
            main: '#fff',
          },
          accent: {
            main: '#EF5B2A',
          },
          ...(mode === 'light'
            ? {
                text: {
                  primary: '#301C3B',
                  secondary: 'rgba(0, 0, 0, 0.54)',
                  disabled: 'rgba(0, 0, 0, 0.38)',
                },
              }
            : {
                text: {
                  primary: '#FFF',
                  secondary: 'rgba(255, 255, 255, 0.7)',
                  disabled: 'rgba(255, 255, 255, 0.5)',
                },
              }),
        },
        components: {
          MuiLink: {
            styleOverrides: {
              root: {
                '&:hover': {
                  color: '#EF5B2A',
                },
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                '&.Mui-focused': {
                  color: mode === 'light' ? '#301C3B' : '#FFF',
                },
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                '&:hover': {
                  backgroundColor: '#EF5B2A',
                  color: '#fff',
                },
                borderRadius: 0,
              },
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                borderRadius: 0,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 0,
              },
            },
          },
          MuiModal: {
            styleOverrides: {
              root: {
                borderRadius: 0,
              },
            },
          },
        },
        typography: {
          fontFamily: " 'Noto Sans', sans-serif",
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Header />
        <BreadcrumbsNavBar />
        <Toolbar id="back-to-top-anchor" />
        <Outlet />
        <ScrollTop>
          <Fab size="small" aria-label="scroll back to top" color="primary">
            <KeyboardArrowUpIcon color="secondary" />
          </Fab>
        </ScrollTop>
        <Footer />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
