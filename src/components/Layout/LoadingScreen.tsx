"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimatingOut(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className={`
          absolute inset-0 bg-black transition-transform duration-1200 cubic-bezier(.858, .01, .068, .99)
          ${isAnimatingOut ? 'transform translate-x-full' : ''}
        `}/>
      <div 
        className={`
          absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          transition-all duration-700 ease-out 
          ${isAnimatingOut ? 'opacity-0' : ''}
        `}>
        <div className="relative w-48 h-48">
          <div className="absolute inset-0 border-2 border-gray-700 border-l-white rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full flex items-center justify-center">
              <Image src="/assets/images/logo/logo-loader.png" alt="logo" width={200} height={200} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}