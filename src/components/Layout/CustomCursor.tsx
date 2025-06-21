
'use client';
import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface CursorState {
  variant: 'default' | 'large' | 'small' | 'arrow' | 'zoom' | 'link';
  text?: string;
}

const CustomCursor: React.FC = () => {
  const [cursorState, setCursorState] = useState<CursorState>({ variant: 'default' });
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if device supports touch
    setIsTouch('ontouchstart' in window);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleLinkHover = () => setCursorState({ variant: 'large' });
    const handleLinkLeave = () => setCursorState({ variant: 'default' });

    const handleButtonHover = () => setCursorState({ variant: 'small' });
    const handleButtonLeave = () => setCursorState({ variant: 'default' });

    const handleArrowHover = () => setCursorState({ variant: 'arrow' });
    const handleArrowLeave = () => setCursorState({ variant: 'default' });

    const handleZoomHover = () => setCursorState({ variant: 'zoom' });
    const handleZoomLeave = () => setCursorState({ variant: 'default' });

    // Mouse events
    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Element-specific hover events
    const links = document.querySelectorAll('a, .pointer-large');
    const buttons = document.querySelectorAll('button, .pointer-small');
    const arrows = document.querySelectorAll('.pointer-arrow, [data-cursor="arrow"]');
    const zoomElements = document.querySelectorAll('.pointer-zoom, [data-cursor="zoom"]');

    links.forEach(link => {
      link.addEventListener('mouseenter', handleLinkHover);
      link.addEventListener('mouseleave', handleLinkLeave);
    });

    buttons.forEach(button => {
      button.addEventListener('mouseenter', handleButtonHover);
      button.addEventListener('mouseleave', handleButtonLeave);
    });

    arrows.forEach(arrow => {
      arrow.addEventListener('mouseenter', handleArrowHover);
      arrow.addEventListener('mouseleave', handleArrowLeave);
    });

    zoomElements.forEach(zoom => {
      zoom.addEventListener('mouseenter', handleZoomHover);
      zoom.addEventListener('mouseleave', handleZoomLeave);
    });

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);

      links.forEach(link => {
        link.removeEventListener('mouseenter', handleLinkHover);
        link.removeEventListener('mouseleave', handleLinkLeave);
      });

      buttons.forEach(button => {
        button.removeEventListener('mouseenter', handleButtonHover);
        button.removeEventListener('mouseleave', handleButtonLeave);
      });

      arrows.forEach(arrow => {
        arrow.removeEventListener('mouseenter', handleArrowHover);
        arrow.removeEventListener('mouseleave', handleArrowLeave);
      });

      zoomElements.forEach(zoom => {
        zoom.removeEventListener('mouseenter', handleZoomHover);
        zoom.removeEventListener('mouseleave', handleZoomLeave);
      });
    };
  }, [cursorX, cursorY]);

  const getCursorVariant = () => {
    switch (cursorState.variant) {
      case 'large':
        return {
          width: 65,
          height: 65,
          backgroundColor: 'rgba(247, 0, 0, 0.15)',
          boxShadow: '0 0 30px rgba(247, 0, 0, 0.8)',
        };
      case 'small':
        return {
          width: 25,
          height: 25,
          backgroundColor: 'rgba(247, 0, 0, 0)',
          boxShadow: '0 0 30px #f70000',
        };
      case 'arrow':
        return {
          width: 70,
          height: 70,
          backgroundColor: 'rgba(247, 0, 0, 0)',
          border: '2px solid #f70000',
        };
      case 'zoom':
        return {
          width: 80,
          height: 80,
          backgroundColor: 'rgba(247, 0, 0, 0)',
          border: '2px solid #f70000',
        };
      default:
        return {
          width: 10,
          height: 10,
          backgroundColor: '#f70000',
        };
    }
  };

  const renderCursorIcon = () => {
    switch (cursorState.variant) {
      case 'arrow':
        return (
          <motion.svg
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f70000"
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </motion.svg>
        );
      case 'zoom':
        return (
          <motion.svg
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f70000"
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </motion.svg>
        );
      default:
        return null;
    }
  };

  if (isTouch) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-difference"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
      animate={{
        ...getCursorVariant(),
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 700,
        duration: 0.5,
      }}
    >
      {renderCursorIcon()}
    </motion.div>
  );
};

export default CustomCursor;