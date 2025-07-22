"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronArrowWithTail } from "./Arrow/arrow";
import FlipText from "./Flippers/FlipText";
import useBreakpoint from "@/hooks/useBreakpoint";
import { cn } from "@/lib/utils";

const ScrollDown = () => {
  const [isHovered, setIsHovered] = useState(false);
  const breakpoint = useBreakpoint();

  function scrollToNextView() {
    const currentScroll = window.pageYOffset;
    const viewHeight = window.innerHeight;
    const nextPosition = Math.ceil(currentScroll / viewHeight) * viewHeight + viewHeight;
    
    window.scrollTo({
      top: nextPosition,
      behavior: 'smooth'
    });
  }


  return (
    <motion.div
      className={cn("link absolute bottom-8 lg:bottom-14 h-24 right-1/2 lg:right-1/4 translate-x-1/2 z-20 flex flex-col items-center gap-2 lg:gap-4", {
        "hidden": breakpoint === "phone",
      })}
      initial={{ y: 200 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.7, duration: 1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={scrollToNextView}
    >
      <FlipText text="Scroll" size="md" isActive={isHovered} />
      <ChevronArrowWithTail size="lg" direction="down" className="text-white" />
    </motion.div>
  ); 
};

export default ScrollDown;
