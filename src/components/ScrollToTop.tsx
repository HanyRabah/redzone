'use client';

import { useEffect } from 'react';

export default function ScrollToTop() {
  useEffect(() => {
    const handleScroll = () => {
      const toTopBtn = document.querySelector('.to-top-btn');
      if (toTopBtn) {
        if (window.pageYOffset > 300) {
          toTopBtn.classList.add('visible');
        } else {
          toTopBtn.classList.remove('visible');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <a className="to-top-btn pointer-small" href="#up">
      <span className="to-top-arrow"></span>
    </a>
  );
}
