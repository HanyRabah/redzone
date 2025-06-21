import React from 'react';
import { Fade as Hamburger } from 'hamburger-react'
import { Menu } from '@mui/material';


export default function BurgerIcon({ isActive, toggleMenu }: { isActive: boolean, toggleMenu: () => void }) {
  return (
      <Menu open={isActive} onClose={toggleMenu}>
        <Hamburger onToggle={toggleMenu} />
      </Menu>
  );
}
