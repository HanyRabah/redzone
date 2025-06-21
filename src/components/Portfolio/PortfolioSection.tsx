'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Container, Grid, Button, keyframes } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '../../types';

const projects: Project[] = [
  {
    id: '1',
    category: 'Commercial',
    title: ['Bushwick selfies', 'pork belly lyft', 'brooklyn messeng'],
    description: 'Narwhal pop-up intelligentsia tbh pinterest, microdosing tilde cloud bread gochujang tattooed leggings cornhole 8-bit. Austin fam chia cold-pressed raw denim.',
    image: '/assets/images/projects/pexels-photo-1619654.jpeg',
    href: '/project/1'
  },
  {
    id: '2',
    category: 'Graphic Design',
    title: ['tumeric tumblr', 'gluten-free', 'Man bun small'],
    description: 'Slow-carb green juice subway tile bicycle rights, fanny pack raclette palo santo put a bird on it mustache actually fam mumblecore iPhone.',
    image: '/assets/images/projects/audio-cassette-cassette-tape-1626481.jpg',
    href: '/project/2'
  },
  {
    id: '3',
    category: 'Branding',
    title: ['batch kombucha', 'subway tile', 'salvia brooklyn'],
    description: 'Mlkshk YOLO wolf, leggings vinyl crucifix stumptown tousled. Pabst venmo gentrify deep v microdosing migas occupy master cleanse intelligentsia.',
    image: '/assets/images/projects/blur-close-up-equipment-1034651.jpg',
    href: '/project/3'
  },
  {
    id: '4',
    category: 'Directing',
    title: ['organic activated', 'charcoal vape', 'viral ennui'],
    description: 'Tote bag cornhole pork belly swag, cronut hoodie snackwave 90\'s messenger bag pour-over disrupt chartreuse. Vape ugh cardigan hell of.',
    image: '/assets/images/projects/chocolate-delicious-dessert-890500.jpg',
    href: '/project/4'
  }
];

interface ProjectCardProps {
  project: Project;
  index: number;
  isVisible: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, isVisible }) => {
  const isReversed = index % 2 === 1;

  return (
    <Grid container spacing={6} className={`mb-24 ${isReversed ? 'flex-row-reverse' : ''}`}>
      <Grid item xs={12} md={6}>
        <Box
          className={`${isVisible ? 'animate-slide-in-left' : ''} ${isReversed ? 'pl-8' : 'pr-8'}`}
          style={{ animationDelay: `${index * 0.2}s` }}
        >
          <Typography
            variant="overline"
            className="text-red-500 mb-4 block"
            sx={{
              fontFamily: 'Oswald, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '0.1em'
            }}
          >
            {project.category}
          </Typography>
          
          <Typography
            variant="h3"
            className="text-gray-900 mb-6"
            sx={{
              fontFamily: 'Oswald, sans-serif',
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              lineHeight: 1.2
            }}
          >
            {project.title.map((line, idx) => (
              <Box key={idx} component="span" className="block">
                {line}
              </Box>
            ))}
          </Typography>
          
          <Typography
            variant="body1"
            className="text-gray-600 mb-8 leading-relaxed"
            sx={{ fontSize: '1rem', lineHeight: 1.7 }}
          >
            {project.description}
          </Typography>
          
          <Link href={project.href}>
            <Button
              variant="text"
              className="text-gray-900 hover:text-red-500 p-0 font-semibold transition-colors duration-300"
              sx={{
                fontFamily: 'Oswald, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}
              endIcon={<Box className="ml-2">→</Box>}
            >
              Read more
            </Button>
          </Link>
        </Box>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Box
          className={`relative overflow-hidden group cursor-pointer ${isVisible ? 'animate-slide-in-right' : ''}`}
          style={{ animationDelay: `${index * 0.2 + 0.1}s` }}
        >
          <Link href={project.href}>
            <Box className="relative h-80 overflow-hidden">
              <Image
                src={project.image}
                alt={project.title.join(' ')}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <Box className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </Box>
          </Link>
        </Box>
      </Grid>
    </Grid>
  );
};
const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;
export const PortfolioSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Box ref={sectionRef} className="py-24 bg-gray-50">
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box className="text-center mb-16">
          <Typography
            variant="h2"
            className={`text-gray-900 mb-4 ${isVisible ? 'animate-overlay-reveal' : ''}`}
            sx={{
              fontFamily: 'Oswald, sans-serif',
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 700
            }}
          >
            Recent Works
          </Typography>
          <Typography
            variant="h6"
            className={`text-gray-600 ${isVisible ? 'animate-fade-in' : ''}`}
            style={{ animationDelay: '0.2s' }}
            sx={{
              fontFamily: 'Oswald, sans-serif',
              fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}
          >
            We Offer Digital Solutions
          </Typography>
        </Box>

        {/* Projects */}
        <Box>
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </Box>
      </Container>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <AppBar 
        position="fixed" 
        className={`transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-md' : 'bg-transparent'} ${className}`}
        elevation={0}
      >
        <Toolbar className="flex justify-between items-center px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Box className="relative">
              <Image
                src="/assets/images/logo/logo-white.png"
                alt="Red Zone Logo"
                width={120}
                height={40}
                className={`transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-100'}`}
              />
              <Image
                src="/assets/images/logo/logo-black.png"
                alt="Red Zone Logo"
                width={120}
                height={40}
                className={`absolute top-0 left-0 transition-opacity duration-300 ${isScrolled ? 'opacity-0' : 'opacity-0'}`}
              />
            </Box>
          </Link>

          {/* Menu Button */}
          <IconButton
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="menu-open cursor-pointer"
          >
            <div className="hamburger-container">
              <span className={`hamburger-line ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`hamburger-line ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`hamburger-line ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Navigation Overlay */}
      <Navigation isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <style jsx>{`
        .hamburger-container {
          display: flex;
          flex-direction: column;
          width: 24px;
          height: 18px;
          justify-content: space-between;
        }
        .hamburger-line {
          width: 100%;
          height: 2px;
          background-color: white;
          transition: all 0.3s ease;
          transform-origin: center;
        }
      `}</style>
    </>
  );
};