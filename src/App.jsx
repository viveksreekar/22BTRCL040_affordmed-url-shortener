import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import ShortenerPage from './components/ShortenerPage';
import StatsPage from './components/StatsPage';
import RedirectHandler from './components/RedirectHandler';
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';

export default function App(){
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              AffordMed URL Shortener
            </Typography>
            <Button color="inherit" component={Link} to="/">Shorten</Button>
            <Button color="inherit" component={Link} to="/stats">Stats</Button>
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<ShortenerPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/:shortcode" element={<RedirectHandler />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}


