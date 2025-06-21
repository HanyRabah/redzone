// components/Layout/LoadingScreen.tsx
import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';

const LoadingScreen: React.FC = () => {
  const overlayVariants = {
    initial: { 
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
    },
    animate: {
      clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
      transition: {
        duration: 1,
        ease: [0.858, 0.01, 0.068, 0.99],
        delay: 1.5
      }
    }
  };

  const overlayVariants2 = {
    initial: { 
      clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)'
    },
    animate: {
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      transition: {
        duration: 1,
        ease: [0.858, 0.01, 0.068, 0.99],
        delay: 2
      }
    }
  };

  const logoVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.76, 0.06, 0.85, 0.07],
        delay: 0.5
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.5,
        ease: [0.76, 0.06, 0.85, 0.07]
      }
    }
  };

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.2,
        ease: "linear",
        repeat: Infinity
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.5, ease: [0.76, 0.06, 0.85, 0.07] }
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
    >
      {/* First Overlay */}
      <motion.div
        variants={overlayVariants}
        initial="initial"
        animate="animate"
        className="absolute inset-0 w-full h-full bg-black z-[99]"
      />

      {/* Second Overlay */}
      <motion.div
        variants={overlayVariants2}
        initial="initial"
        animate="animate"
        className="absolute inset-0 w-full h-full bg-black z-[98]"
      />

      {/* Loading Content */}
      <Box className="relative z-[101] flex flex-col items-center justify-center">
        {/* Logo */}
        <motion.div
          variants={logoVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="mb-8"
        >
          <Image
            src="/logo-loader.png"
            alt="Red Zone"
            width={200}
            height={80}
            className="w-48 h-auto"
          />
        </motion.div>

        {/* Spinner */}
        <motion.div
          variants={spinnerVariants}
          animate="animate"
          className="w-24 h-24 relative"
        >
          <div 
            className="w-full h-full border-2 border-transparent border-l-white rounded-full"
            style={{
              borderLeftColor: 'white',
              borderTopColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: 'transparent'
            }}
          />
          
          {/* Inner logo positioned absolutely */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/logo-loader.png"
              alt="Red Zone"
              width={40}
              height={16}
              className="w-10 h-auto opacity-80"
            />
          </div>
        </motion.div>
      </Box>

      <style jsx>{`
        @keyframes loading-anim {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </motion.div>
  );
};

export default LoadingScreen;