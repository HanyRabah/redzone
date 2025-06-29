'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FlipLink from './Flippers/FlipLink';
import { IoMdMail } from "react-icons/io";
import { HiMapPin } from "react-icons/hi2";
import { FaMobileAlt } from "react-icons/fa";

const menuItems: { name: string; href: string }[] = [{
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

const Footer: React.FC = () => {
  const [selectedMenuItem, setSelectedMenuItem] = React.useState<string | null>(null);

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
          <div className="col-span-1 md:col-span-2 mb-6 md:mb-0 flex justify-center md:justify-start items-start">
            <Image
              src="/images/logo/logo-white.png"
              alt="Red Zone"
              width={100}
              height={40}
              className="object-contain"
            />
          </div>

          <div className="col-span-1 mb-6 md:mb-0 md:col-span-3 text-center md:text-left">
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

          <div className="col-span-1 mb-6 md:mb-0 md:col-span-4 mx-auto text-left">
            <div className="space-y-4 text-white">
              <div className="flex md:items-center justify-start">
                <IoMdMail className="w-4 h-4 mr-3" />
                <p className="text-xs uppercase tracking-wide">
                  amr.elwadidy@gmail.com
                </p>
              </div>
              
              <div className="flex md:items-center justify-start">
                <FaMobileAlt className="w-4 h-4 mr-3" />
                <p className="text-xs uppercase tracking-wide">
                  +201156659999
                </p>
              </div>
              
              <div className="flex md:items-center justify-start">
                <HiMapPin className="w-4 h-4 mr-3" />
                <p className="text-xs uppercase tracking-wide leading-4">
                  Giza, Egypt
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-3 mx-auto md:ml-auto">
            <div className="space-y-0">
              {socialLinks.map((social, index) => <div key={index}><FlipLink text={social.name} href={social.href} className='align-left' /></div>)}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 text-center">
          <p className="text-white text-xs uppercase tracking-[4px] md:tracking-[8px]leading-4">
            © Copyright 2025 Red Zone. Designed by{' '}
            <Link href="https://www.deepadv.com/" target='_blank' className="pointer-small hover:text-red-500 transition-colors block md:inline">
              DEEP Communications
            </Link>
          </p>
        </div>
      </div>
    </footer>  
  );
};

export default Footer;