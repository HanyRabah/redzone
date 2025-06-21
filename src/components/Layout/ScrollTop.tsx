"use client";

import { motion } from "framer-motion";
import { ChevronArrowWithTail } from "./Arrow/arrow";
import { useEffect, useState } from "react";

const ScrollTop = () => {
  // hide if scroll position is less height view
  const [isVisible, setIsVisible] = useState(false);
  
  const handleScroll = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <motion.button
      onClick={scrollToTop}
      className="fixed bottom-12 right-12 w-12 h-12  flex items-center justify-center z-50 backdrop-blur-sm bg-black p-5"
      initial={{ scale: 0, opacity: 0, rotate: 180 }}
      animate={isVisible ? { scale: 1, opacity: 1, rotate: 0 } : { scale: 0, opacity: 0, rotate: 180 }}
      transition={{ delay: 0.5, duration: 0.8, ease: "backOut" }}
      whileHover={{
        scale: 1.1,
        boxShadow: "0 0 20px rgba(239, 68, 68, 0.5)",
      }}
      whileTap={{ scale: 0.95 }}
    >
      <ChevronArrowWithTail direction="up" size="lg" className="link text-white" />
    </motion.button>
  );
};

export default ScrollTop;
