import * as React from 'react';
import Link from 'next/link';
import { AppBar, Box, Container, IconButton, NoSsr, Toolbar, Typography } from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';
import ThemeToggle from './ThemeToggle';
import Sidebar from './Sidebar';
import { getToken } from '../utils/axios';

export default function Layout({ children, fontClass }: { children: React.ReactNode; fontClass?: string }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => setMobileOpen((v) => !v);

  return (
    <Box className={fontClass} sx={{ minHeight: '100vh', display: 'flex' }}>
      <AppBar position="fixed" color="transparent" enableColorOnDark sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 1, display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <AdbIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800 }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Hippogriff Trade</Link>
          </Typography>
          <ThemeToggle />
        </Toolbar>
      </AppBar>

      <NoSsr>
        {!!getToken() && <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />}
      </NoSsr>

      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', }}>
        <Toolbar />
        <Container sx={{ flex: 1, py: 6 }}>
          {children}
        </Container>
        <Box component="footer" sx={{ py: 3, textAlign: 'center', opacity: 0.7 }}>
          <Typography variant="caption">Hussain Nazarnejad © {new Date().getFullYear()} Hippogriff Trade</Typography>
        </Box>
      </Box>
    </Box>
  );
}
