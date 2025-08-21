// components/Layout/Header.tsx
"use client";
import React, { useState, useEffect } from "react";
import { AppBar, Box, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navigation from "./Navigation";

const logoVariants = {
  hidden: { y: "110%" },
  visible: { y: 0 },
};

const hamburgerVariants = {
  hidden: { scaleX: 0, transformOrigin: "right" },
  visible: { scaleX: 1, transformOrigin: "right" },
};

const lineVariants = {
  closed: { scale: 1, transformOrigin: "center" },
  open: { scale: 0, transformOrigin: "center" },
};

const topLineVariants = {
  closed: { y: 0, rotate: 0 },
  open: { y: 10, rotate: 45 },
};

const bottomLineVariants = {
  closed: { y: 0, rotate: 0 },
  open: { y: -10, rotate: -45 },
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const detectBackgroundColor = () => {
      console.log('🔍 Starting background detection...');
      const headerHeight = 120;
      
      // Try multiple points to get better detection
      const points = [
        { x: window.innerWidth / 2, y: headerHeight + 10 },
        { x: window.innerWidth / 4, y: headerHeight + 10 },
        { x: (window.innerWidth * 3) / 4, y: headerHeight + 10 }
      ];
      console.log('📍 Detection points:', points);

      // Check all points and collect results
      let detectedBackground: boolean | null = null;

      for (const point of points) {
        console.log(`🎯 Checking point (${point.x}, ${point.y})`);
        const elementUnderHeader = document.elementFromPoint(point.x, point.y);
        console.log('🎯 Element found:', elementUnderHeader);
        
        if (elementUnderHeader) {
          // Method 1: Check for data-dark-section attribute (highest priority)
          const isDarkSection = elementUnderHeader.closest("[data-dark-section]");
          console.log('🏷️ Data-dark-section element:', isDarkSection);
          if (isDarkSection) {
            const isDark = isDarkSection.getAttribute("data-dark-section") === "true";
            console.log('🏷️ Found data-dark-section:', isDark);
            detectedBackground = isDark;
            break; // This method has highest priority, so we can break here
          }

          // Method 2: Check for common dark background classes
          const darkClasses = [
            'bg-black', 'bg-gray-900', 'bg-gray-800', 'bg-slate-900', 
            'bg-zinc-900', 'bg-neutral-900', 'bg-stone-900'
          ];
          
          const lightClasses = [
            'bg-white', 'bg-gray-100', 'bg-gray-50', 'bg-slate-100',
            'bg-zinc-100', 'bg-neutral-100', 'bg-stone-100', 'bg-secondary'
          ];

          // Check element and its parents for background classes
          let currentElement: Element | null = elementUnderHeader;
          let maxDepth = 8; // Limit traversal depth
          
          while (currentElement && maxDepth > 0 && detectedBackground === null) {
            const classList = Array.from(currentElement.classList);
            console.log(`🎨 Checking element (depth ${8 - maxDepth}):`, currentElement, 'Classes:', classList);
            
            // Check for dark classes
            const foundDarkClass = darkClasses.find(cls => classList.includes(cls));
            if (foundDarkClass) {
              console.log('🌑 Found dark class:', foundDarkClass);
              detectedBackground = true;
              break;
            }
            
            // Check for light classes
            const foundLightClass = lightClasses.find(cls => classList.includes(cls));
            if (foundLightClass) {
              console.log('🌕 Found light class:', foundLightClass);
              detectedBackground = false;
              break;
            }
            
            currentElement = currentElement.parentElement;
            maxDepth--;
          }

          // If we found a result from class detection, break to use it
          if (detectedBackground !== null) {
            break;
          }

          // Method 3: Check computed background color
          const computedStyle = window.getComputedStyle(elementUnderHeader);
          const backgroundColor = computedStyle.backgroundColor;
          const backgroundImage = computedStyle.backgroundImage;
          console.log('🎨 Computed styles - Background color:', backgroundColor, 'Background image:', backgroundImage);
          
          // Only log non-transparent backgrounds for debugging
          if (backgroundColor && backgroundColor !== "rgba(0, 0, 0, 0)" && backgroundColor !== "transparent") {
            console.log('✅ Found valid backgroundColor:', backgroundColor, 'on element:', elementUnderHeader);
          }

          if (backgroundColor && backgroundColor !== "rgba(0, 0, 0, 0)" && backgroundColor !== "transparent") {
            // Parse RGB values to determine if background is dark
            const rgbMatch = backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (rgbMatch) {
              const [, r, g, b] = rgbMatch.map(Number);
              const brightness = (r * 299 + g * 587 + b * 114) / 1000;
              detectedBackground = brightness < 128;
              break; // Found a computed color, use it
            }
          }

          // Method 4: Check for background images (assume dark)
          if (backgroundImage && backgroundImage !== "none") {
            console.log('🖼️ Found background image:', backgroundImage);
            detectedBackground = true;
            break; // Found a background image, assume dark
          }
        }
      }

      // If we detected a background from any method, use it
      if (detectedBackground !== null) {
        console.log('✅ Final detection result:', detectedBackground ? 'DARK' : 'LIGHT');
        setIsDarkBackground(detectedBackground);
        return;
      }
      
      console.log('❌ No background detected, falling back to route-based detection');

      // Method 5: Route-based detection as fallback
      const pathname = window.location.pathname;
      
      // Define routes with known dark backgrounds
      const darkRoutes = ['/', '/home'];
      const lightRoutes = ['/contact', '/about', '/portfolio', '/blog'];
      
      if (darkRoutes.includes(pathname)) {
        console.log('🛣️ Using dark route fallback for:', pathname);
        setIsDarkBackground(true);
        return;
      }
      
      if (lightRoutes.includes(pathname)) {
        console.log('🛣️ Using light route fallback for:', pathname);
        setIsDarkBackground(false);
        return;
      }

      // Default fallback - assume dark for home-like routes, light for others
      const isHomeLike = pathname === '/' || pathname.includes('home');
      console.log('🛣️ Using default fallback - pathname:', pathname, 'isHomeLike:', isHomeLike);
      setIsDarkBackground(isHomeLike);
    };

    // Initial detection
    detectBackgroundColor();

    // Detect on scroll with throttling for performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          detectBackgroundColor();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Header - Always visible */}
      <div className="fixed top-0 left-0 right-0 z-50 w-full">
        <AppBar
          position="static"
          elevation={0}
          color="transparent"
          sx={{
            height: "120px",
            overflow: "hidden",
          }}
        >
          <Box className="flex justify-between items-start py-5 px-10 md:px-10">
            {/* Logo */}
            <motion.div
              variants={logoVariants}
              initial="hidden"
              animate="visible"
              transition={{
                duration: 1,
                delay: 1,
                ease: [0.767, 0.01, 0.18, 1.01],
              }}
              className="w-24 h-[100px] overflow-hidden cursor-pointer"
              onClick={() => router.push("/")}
            >
              <motion.div
                animate={{ y: 0 }}
                transition={{
                  duration: 1,
                  delay: 1,
                  ease: [0.767, 0.01, 0.18, 1.01],
                }}
                className="w-full h-auto"
              >
                {isDarkBackground ? (
                  <Image
                    src="/images/logo/logo-white.png"
                    alt="Red Zone"
                    width={100}
                    height={92}
                    className="w-full h-auto"
                  />
                ) : (
                  <Image
                    src="/images/logo/logo-black.png"
                    alt="Red Zone"
                    width={100}
                    height={92}
                    className="w-full h-auto drop-shadow-sm"
                    style={{
                      filter: 'drop-shadow(0 1px 2px rgba(255, 255, 255, 0.2))'
                    }}
                  />
                )}
              </motion.div>
            </motion.div>
          </Box>
        </AppBar>
      </div>

      {/* Hamburger Menu */}
      <motion.div
        variants={hamburgerVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 1, delay: 1, ease: [0.767, 0.01, 0.18, 1.01] }}
        className="fixed right-10 top-10 z-[51]"
      >
        <IconButton
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-10 h-6 p-0 relative cursor-pointer hover:bg-transparent"
          disableRipple
        >
          {/* Middle line */}
          <motion.div
            variants={lineVariants}
            initial="closed"
            animate={isMenuOpen ? "open" : "closed"}
            transition={{
              duration: 1,
              delay: 0.5,
              ease: [0.767, 0.01, 0.18, 1.01],
            }}
            className={`absolute w-10 h-0.5 ${isDarkBackground ? "bg-white" : "bg-black"} top-1/2 left-0 transform -translate-y-1/2`}
          />

          {/* Top line */}
          <motion.div
            variants={topLineVariants}
            animate={isMenuOpen ? "open" : "closed"}
            transition={{ duration: 1, ease: [0.767, 0.01, 0.18, 1.01] }}
            className={`absolute w-10 h-0.5 ${isDarkBackground ? "bg-white" : "bg-black"} top-0 left-0`}
          />

          {/* Bottom line */}
          <motion.div
            variants={bottomLineVariants}
            animate={isMenuOpen ? "open" : "closed"}
            transition={{ duration: 1, ease: [0.767, 0.01, 0.18, 1.01] }}
            className={`absolute w-10 h-0.5 ${isDarkBackground ? "bg-white" : "bg-black"} bottom-0 left-0`}
          />
        </IconButton>
      </motion.div>

      <Navigation isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
    </>
  );
};

export default Header;
