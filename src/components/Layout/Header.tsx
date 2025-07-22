// components/Layout/Header.tsx
"use client";
import React, { useState, useEffect } from "react";
import { AppBar, Box, IconButton } from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
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
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { scrollY } = useScroll();
  const router = useRouter();

  const headerY = useTransform(scrollY, [0, 100], [0, -120]);

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlHeader);
    return () => window.removeEventListener("scroll", controlHeader);
  }, [lastScrollY]);

  // Detect dark sections for logo color change
  useEffect(() => {
    const sections = document.querySelectorAll("[data-dark-section]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsDarkMode(
              entry.target.getAttribute("data-dark-section") === "true"
            );
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.div
        style={{ y: headerY }}
        animate={{ y: isVisible ? 0 : -120 }}
        transition={{ duration: 0.6, ease: [0.76, 0.06, 0.85, 0.07] }}
        className="fixed top-0 left-0 right-0 z-50 w-full"
      >
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
              className="w-24 h-[100px] overflow-hidden"
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
                {isDarkMode ? (
                  <Image
                    src="/images/logo/logo-black.png"
                    alt="Red Zone"
                    width={100}
                    height={92}
                    className="w-full h-auto"
                  />
                ) : (
                  <Image
                    src="/images/logo/logo-white.png"
                    alt="Red Zone"
                    width={100}
                    height={92}
                    className="w-full h-auto"
                  />
                )}
              </motion.div>
            </motion.div>
          </Box>
        </AppBar>
      </motion.div>
      {/* Hamburger Menu */}
      <motion.div
        variants={hamburgerVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 1, delay: 1, ease: [0.767, 0.01, 0.18, 1.01] }}
        className="mt-1 absolute right-10 top-10 z-51"
      >
        <IconButton
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-10 h-6 p-0 relative cursor-none hover:bg-transparent"
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
            className={`absolute w-10 h-0.5 ${isDarkMode ? "bg-black" : "bg-white"} top-1/2 left-0 transform -translate-y-1/2`}
          />

          {/* Top line */}
          <motion.div
            variants={topLineVariants}
            animate={isMenuOpen ? "open" : "closed"}
            transition={{ duration: 1, ease: [0.767, 0.01, 0.18, 1.01] }}
            className={`absolute w-10 h-0.5 ${isDarkMode ? "bg-black" : "bg-white"} top-0 left-0`}
          />

          {/* Bottom line */}
          <motion.div
            variants={bottomLineVariants}
            animate={isMenuOpen ? "open" : "closed"}
            transition={{ duration: 1, ease: [0.767, 0.01, 0.18, 1.01] }}
            className={`absolute w-10 h-0.5 ${isDarkMode ? "bg-black" : "bg-white"} bottom-0 left-0`}
          />
        </IconButton>
      </motion.div>
      <Navigation isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
    </>
  );
};

export default Header;
