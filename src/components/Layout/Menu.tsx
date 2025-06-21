"use client"
import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import BurgerIcon from './BurgerIcon';

const FullScreenMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = ['Home', 'About', 'Portfolio', 'Blog', 'Contact'];

  return (
    <>
      <BurgerIcon isActive={isMenuOpen} toggleMenu={toggleMenu} />
      <Drawer
        anchor="left"
        open={isMenuOpen}
        onClose={toggleMenu}
        transitionDuration={1000}
        slotProps={{
          backdrop: {
            transitionDuration: 300,
          },
        }}
        sx={{
          '& .MuiDrawer-paper': {
            background: 'red',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        <List>
          {menuItems.map((text) => (
            <ListItem key={text} onClick={toggleMenu}>
              <ListItemText primary={text} sx={{ textAlign: 'center', fontSize: '1.5rem', color: '#fff' }}/>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default FullScreenMenu;