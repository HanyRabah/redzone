'use client';

import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { signOut } from 'next-auth/react';
import LogoutIcon from '@mui/icons-material/Logout';

export default function AdminHeader() {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Red Zone Admin
        </Typography>
        <IconButton color="inherit" onClick={() => signOut()}>
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
