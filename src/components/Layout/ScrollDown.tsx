"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronArrowWithTail } from "./Arrow/arrow";
import FlipText from "./Flippers/FlipText";

const ScrollDown = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="link absolute bottom-8 lg:bottom-14 h-24 right-1/2 lg:right-1/4 translate-x-1/2 z-20 flex flex-col items-center gap-2 lg:gap-4"
      initial={{ y: 200 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.7, duration: 1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FlipText text="Scroll" size="md" isActive={isHovered} />
      <ChevronArrowWithTail size="lg" direction="down" className="text-white" />
    </motion.div>
  ); 
};

export default ScrollDown;
