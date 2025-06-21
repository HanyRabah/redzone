'use client';

import Link from 'next/link';
import { Drawer } from '@mui/material';
import { List, ListItem } from '@mui/material';
import { Box } from '@mui/material';

export default function DesktopMenu({ open, onCloseAction }: { open: boolean; onCloseAction: () => void }) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onCloseAction}
      ModalProps={{
        BackdropProps: {
          invisible: true,
        },
        sx: { zIndex: 998 },
      }}
      slotProps={{
        paper: {
          elevation: 24,
          sx: {
            maxWidth: "100%",
            width: "50vw",
          },
        },
      }}>

      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
        margin: '0 auto',
        textAlign: 'center',

      }}>
        <List className='display-flex h-[100vh] flex-col justify-center bg-black'>
          {['HOME', 'ABOUT', 'PORTFOLIO', 'BLOG', 'CONTACT'].map((text) => (
            <ListItem key={text} onClick={onCloseAction} className="text-white">
                <Link   href={`/${text.toLowerCase()}`} className="display-block w-full text-white text-center font-bold text-3xl capitalize">
                  {text}
                </Link>
            </ListItem> 
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

