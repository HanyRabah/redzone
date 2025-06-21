'use client';
import React, { useEffect } from 'react';
import { Box, Typography, Container } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import FlipLink from './Flippers/FlipLink';

const Footer: React.FC = () => {
  const [selectedMenuItem, setSelectedMenuItem] = React.useState<string | null>(null);
  const menuItems = [{
    name: 'Home',
    href: '/',
  }, {
    name: 'About',
    href: '/about',
  }, {
    name: 'Services',
    href: '/services',
  }, {
    name: 'Portfolio',
    href: '/portfolio',
  }, {
    name: 'Blog',
    href: '/blog',
  }, {
    name: 'Contact',
    href: '/contact',
  }];
  const socialLinks = [
    {name: 'Instagram', href: 'https://www.instagram.com'}, 
    {name: 'Facebook', href: 'https://www.facebook.com'}, 
    {name: 'Spotify', href: 'https://www.spotify.com'}, 
    {name: 'Vimeo', href: 'https://www.vimeo.com'}, 
    {name: 'Behance', href: 'https://www.behance.net'}, 
  ];

  useEffect(() => {
    const currentPath = window.location.pathname;
    const selectedItem = menuItems.find(item => item.href === currentPath);
    setSelectedMenuItem(selectedItem ? selectedItem.name : null);
  }, []);

  return (
    <footer className="bg-black fixed bottom-0 w-full -z-1">
      <div className="container mx-auto py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-2 flex md:justify-start items-start">
            <Image
              src="/images/logo/logo-white.png"
              alt="Red Zone"
              width={100}
              height={40}
              className="object-contain"
            />
          </div>

          <div className="md:col-span-3 text-center md:text-left">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <div key={item.name}>
                  <Link 
                    href={item.href}
                    className={"text-sm font-bold uppercase tracking-wide hover:text-red-500 transition-colors duration-300 block " + (selectedMenuItem === item.name ? "text-red-500" : "text-white")}
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-4 text-center md:text-left">
            <div className="space-y-4 text-white">
              <div className="flex items-center justify-center md:justify-start">
                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
                <Typography className="text-xs uppercase tracking-wide">
                  amr.elwadidy@gmail.com
                </Typography>
              </div>
              
              <div className="flex items-center justify-center md:justify-start">
                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                <Typography className="text-xs uppercase tracking-wide">
                  +201156659999
                </Typography>
              </div>
              
              <div className="flex items-center justify-center md:justify-start">
                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
                <Typography className="text-xs uppercase tracking-wide leading-4">
                  Giza, Egypt
                </Typography>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 ml-auto">
            <div className="space-y-0">
              {socialLinks.map((social, index) => <div key={index}><FlipLink text={social.name} href={social.href} className='align-left' /></div>)}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 text-center">
          <p className="text-white text-xs uppercase tracking-[8px]">
            © Copyright 2025 Red Zone. Designed by{' '}
            <Link href="https://www.deepadv.com/" target='_blank' className="pointer-small hover:text-red-500 transition-colors">
              DEEP Communications
            </Link>
          </p>
        </div>
      </div>
    </footer>  
  );
};

export default Footer;