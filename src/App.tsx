import React from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import { ThemeProvider, Toolbar, createTheme } from '@mui/material';
import { BreadcrumbsNavBar } from './components/BreadcrumbsNavBar';
import ScrollTop from './components/ScrollTop';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Fab from '@mui/material/Fab';
import { useMemo, useState } from 'react';
import Footer from './components/Footer';

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

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#ffffff',
            contrastText: '#301C3B',
          },
          accent: {
            main: '#EF5B2A',
          },
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
          <Fab size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
        <Footer />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
