// components/Layout/Navigation.tsx
import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
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
  hidden: { opacity: 0 },
  visible: {
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


const containerVariants = {
  hidden: { x: '100%' },
  visible: {
    x: '0%',
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
  hidden: { 
    width: '100%', 
    left: '0%',
  },
  visible: {
    width: '50%',
    left: "50%",
    transition: {
      duration: 1,
      ease: [0.858, 0.01, 0.068, 0.99],
      delay: 1
    }
  },
  exit: {
    transition: {
      duration: 1,
      ease: [0.858, 0.01, 0.068, 0.99],
      delay: 1.5
    }
  }
};


const Navigation: React.FC<NavigationProps> = ({ isOpen, setIsOpen }) => {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [blogPostsCount, setBlogPostsCount] = useState<number>(0);  
  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const getBlogPostsCount = async () => {
      const count = await fetch('/api/admin/blog/count').then(res => res.json());
      setBlogPostsCount(count);
    }
    getBlogPostsCount();
  }, []);
 
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="overflow-hidden h-screen w-screen m-0 p-0 fixed top-0 left-0 z-50"
          id="nav-container"
        >
          {/* Background Image */}
          <div className="absolute inset-0 w-1/2 h-full left-0 overflow-hidden bg-black">
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
          </div>

          {/* Navigation Logo */}
          <div id="nav-logo" className="absolute top-5 left-1/2 transform translate-x-10 z-30 w-32 overflow-hidden">
            <motion.div variants={logoVariants}>
              <Image
                src="/images/logo/logo-white.png"
                alt="Red Zone"
                width={130}
                height={50}
                className="w-full h-auto"
              />
            </motion.div>
          </div>

          <motion.div
            variants={overlayVariants}
            className="absolute right-0 h-full"
            id="nav-menu"
          >
            <div className="flex flex-col items-center justify-center h-full w-full left-auto  right-0 bg-black">
              {navigationItems.map((item, index) => {
                if(blogPostsCount === 0 && item.title === 'Blog') return null;
                return (
                  <div
                    key={item.title}
                    className="my-2 overflow-hidden relative pointer-large"
                    onMouseEnter={() => setHoveredItem(index)}
                  >
                    <motion.div
                      custom={index}
                      variants={linkVariants}
                      className="block"
                    >
                      <Link href={item.href} onClick={handleClose} className="block cursor-none">
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
                              style={{ backgroundColor: 'black' }}
                            >
                              {item.title}
                            </motion.div>
                          </span>
                        </Typography>
                      </Link>
                    </motion.div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Navigation;