// components/Layout/Navigation.tsx
import React, { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface NavigationProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const navigationItems = [
  { title: 'Home', href: '/', bg: 'images/backgrounds/pexels-photo-1806031.jpeg' },
  { title: 'About', href: '/about', bg: 'images/backgrounds/adolescent-adult-diversity-1034361.jpg' },
  { title: 'Portfolio', href: '/portfolio', bg: 'images/backgrounds/art-artistic-artsy-1988681.jpg' },
  { title: 'Blog', href: '/blog', bg: 'images/backgrounds/beautiful-black-close-up-1689731.jpg' },
  { title: 'Contact', href: '/contact', bg: 'images/backgrounds/double-exposure-2390185_1920.jpg' },
];


const containerVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: {
      duration: 1,
      ease: [0.858, 0.01, 0.068, 0.99],
      delay: 0
    }
  },
  exit: {
    x: '100%',
    transition: {
      duration: 1,
      ease: [0.858, 0.01, 0.068, 0.99],
      delay: 0.7
    }
  }
};

const overlayVariants = {
  hidden: { x: '-100%' },
  visible: {
    x: '0%',
    transition: {
      duration: 1,
      ease: [0.858, 0.01, 0.068, 0.99],
      delay: 1
    }
  },
  exit: {
    x: '-100%',
    transition: {
      duration: 1,
      ease: [0.858, 0.01, 0.068, 0.99],
      delay: 0.5
    }
  }
};

const logoVariants = {
  hidden: { y: '110%' },
  visible: {
    y: 0,
    transition: {
      duration: 1,
      delay: 1,
      ease: [0.767, 0.01, 0.18, 1.01]
    }
  },
  exit: {
    y: '110%',
    transition: {
      duration: 0.5,
      ease: [0.767, 0.01, 0.18, 1.01]
    }
  }
};

const closeButtonVariants = {
  hidden: { rotate: 0 },
  visible: {
    rotate: [0, 225, 135],
    transition: {
      duration: 1,
      delay: 1,
      ease: [0.767, 0.01, 0.18, 1.01]
    }
  },
  exit: {
    rotate: 0,
    transition: {
      duration: 0.5,
      ease: [0.767, 0.01, 0.18, 1.01]
    }
  }
};

const linkVariants = {
  hidden: { y: '104%' },
  visible: (i: number) => ({
    y: 0,
    transition: {
      duration: 1.5,
      delay: 1 + i * 0.1,
      ease: [0.225, 1, 0.316, 0.99]
    }
  }),
  exit: (i: number) => ({
    y: '104%',
    transition: {
      duration: 1,
      delay: (navigationItems.length - 1 - i) * 0.04,
      ease: [0.76, 0.06, 0.85, 0.07]
    }
  })
};

const backgroundVariants = {
  hidden: { scale: 1.1, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.9,
      ease: [0.767, 0.01, 0.18, 1.01]
    }
  }
};

const textFillVariants = {
  rest: { width: '0%' },
  hover: {
    width: '100%',
    transition: {
      duration: 0.5,
      ease: [0.76, 0.06, 0.85, 0.07]
    }
  }
};

const Navigation: React.FC<NavigationProps> = ({ isOpen, setIsOpen }) => {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 bg-black min-h-screen"
        >
          {/* Background Image */}
          <Box className="absolute inset-0 w-1/2 h-full right-0 overflow-hidden">
            <motion.div
              key={hoveredItem}
              variants={backgroundVariants}
              initial="hidden"
              animate="visible"
              className="w-full h-full"
              style={{
                backgroundImage: `url(${navigationItems[hoveredItem ?? 0].bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
          </Box>

          {/* Navigation Logo */}
          <Box className="absolute top-5 left-1/2 transform translate-x-10 z-30 w-32 overflow-hidden">
            <motion.div variants={logoVariants}>
              <Image
                src="/images/logo/logo-white.png"
                alt="Red Zone"
                width={130}
                height={50}
                className="w-full h-auto"
              />
            </motion.div>
          </Box>

          {/* Close Button */}
          <Box className="absolute top-5 right-10 z-30">
            <IconButton
              onClick={() => setIsOpen(false)}
              className="w-10 h-6 p-0 cursor-none hover:bg-transparent"
              disableRipple
            >
              <motion.div
                variants={closeButtonVariants}
                className="relative w-10 h-6"
              >
                <div className="absolute w-10 h-0.5 bg-white top-1/2 left-0 transform -translate-y-1/2 rotate-45" />
                <div className="absolute w-10 h-0.5 bg-white top-1/2 left-0 transform -translate-y-1/2 -rotate-45" />
              </motion.div>
            </IconButton>
          </Box>

          {/* Navigation Menu Overlay */}
          <motion.div
            variants={overlayVariants}
            className="absolute inset-0 w-1/2 h-full bg-black border-r-2 border-black"
          >
            <Box className="flex flex-col items-center justify-center h-full">
              {navigationItems.map((item, index) => (
                <Box
                  key={item.title}
                  className="my-2 overflow-hidden relative"
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <motion.div
                    custom={index}
                    variants={linkVariants}
                    className="block"
                  >
                    <Link href={item.href} className="block cursor-none">
                      <Typography
                        variant="h2"
                        className="text-white text-5xl xl:text-6xl font-medium uppercase tracking-wide leading-none relative overflow-hidden whitespace-nowrap"
                        style={{
                          fontFamily: 'Oswald, sans-serif',
                          fontWeight: 500
                        }}
                      >
                        <span className="relative inline-block">
                          {item.title}
                          <motion.div
                            variants={textFillVariants}
                            animate={hoveredItem === index ? "hover" : "rest"}
                            className="absolute inset-0 bg-red-600 text-red-600 overflow-hidden whitespace-nowrap"
                            style={{ backgroundColor: '#f70000' }}
                          >
                            {item.title}
                          </motion.div>
                        </span>
                      </Typography>
                    </Link>
                  </motion.div>
                </Box>
              ))}
            </Box>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Navigation;