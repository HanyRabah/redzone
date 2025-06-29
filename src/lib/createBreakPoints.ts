"use client"
import { useEffect, useState } from 'react';
import { isBrowser, off, on } from './browser';

const createBreakpoint =
  (breakpoints: { [name: string]: number } = { laptopL: 1440, laptop: 1024, tablet: 768 }) => {
    // Calculate sorted breakpoints once when the hook is created
    const sortedBreakpoints = Object.entries(breakpoints).sort((a, b) => (a[1] >= b[1] ? 1 : -1));
    
    return () => {
      const [screen, setScreen] = useState(isBrowser ? window.innerWidth : 0);

      useEffect(() => {
        const setSideScreen = (): void => {
          setScreen(window.innerWidth);
        };
        setSideScreen();
        on(window, 'resize', setSideScreen);
        return () => {
          off(window, 'resize', setSideScreen);
        };
      });
      const result = sortedBreakpoints.reduce((acc, [name, width]) => {
        if (screen >= width) {
          return name;
        } else {
          return acc;
        }
      }, sortedBreakpoints[0][0]);
      
      return result;
    };
  };

export default createBreakpoint;