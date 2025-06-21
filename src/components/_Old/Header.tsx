'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
//import MobileMenu from './MobileMenu';
import { Box } from '@mui/material';
import { Fade as Hamburger } from 'hamburger-react'
import DesktopMenu from './Layout/DesktopMenu';
import Image from 'next/image';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
    
    <header className={`flex justify-between items-center h-[112px] mx-10 py-5 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
    }`}>
        <nav className="flex justify-between items-center h-[112px] w-full">
         
          <Link href="/" className="w-[100px] mt-5">
            <Image 
              src={isScrolled ? "/images/logo/logo-black.png" : "/images/logo/logo-white.png"} 
              alt="Red Zone" 
              width={100}
              height={100}
              className="h-[90px]"
            />
          </Link>

          <Box className='link' sx={{  zIndex: theme => theme.zIndex.drawer + 1 }}>
            <Hamburger color="white" onToggle={toggleMenu} />
          </Box>
        </nav>
    </header>
    <DesktopMenu open={isMenuOpen} onCloseAction={toggleMenu} />
    </>
  );
}
