import React, { useState, useEffect } from 'react';
import { Box, ThemeProvider } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Navigation from './Navigation';
import LoadingScreen from './LoadingScreen';
import CustomCursor from './CustomCursor';
import { useTheme } from '@mui/material/styles';
import ScrollToTop from '../ScrollToTop';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const pageVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.8
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className="relative min-h-screen bg-gray-50 overflow-x-hidden">
        <CustomCursor />
        
        <AnimatePresence>
          {isLoading && <LoadingScreen />}
        </AnimatePresence>

        <Header />
        
        <Navigation 
          isOpen={isMenuOpen} 
          setIsOpen={setIsMenuOpen} 
        />

        <motion.main
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
          className="relative z-10"
        >
          {children}
        </motion.main>

        <ScrollToTop />
      </Box>
    </ThemeProvider>
  );
};

export default MainLayout;