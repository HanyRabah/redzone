"use client"
import React from "react";
import { motion, useInView } from "framer-motion";
import { Box } from "@mui/material";
import { AboutUsSection } from "@prisma/client";


const RedZoneCreativePageInteractive = ({pageData}: {pageData: AboutUsSection | null}) => {

  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);


  const titleVariants = {
    hidden: {
      x: -200,
      opacity: 0,
      scale: 0.8,
    },
    visible: (i: number) => ({
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.4,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  };

  const contentVariants = {
    hidden: {
      y: 80,
      opacity: 0,
    },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.2 + i * 0.3,
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const overlayVariants = {
    hidden: { x: 0 },
    visible: (i: number) => ({
      x: "100%",
      transition: {
        delay: 1 + i * 0.1,
        duration: 1,
        ease: [0.858, 0.01, 0.068, 0.99],
      },
    }),
  };

  return (
    <div className="w-full min-h-screen bg-black text-white relative overflow-hidden py-20">
      {/* Interactive Background with Mouse Movement */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)`,
        }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="container mx-auto px-4 lg:px-8 relative z-10"
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="min-h-screen flex flex-col justify-center items-center">
          {/* Main Headlines with Enhanced Left to Right Animation */}
          <div className="text-center overflow-hidden">
            <h2 className="text-[40px] md:text-[50px] lg:text-[65px] font-bold uppercase text-white tracking-[-2px]">
              {pageData?.titleLines.map((line, index) => (
                <Box key={index} className="overflow-hidden relative  w-fit text-center"> 
                    <motion.span
                      variants={titleVariants}
                      custom={index}
                      className="inline-block"
                    >
                      {line}
                      <motion.div
                        custom={index}
                        variants={overlayVariants}
                        className="absolute inset-0 bg-black"
                      />
                    </motion.span>
                </Box>
              ))}
            </h2>

          </div>

          {/* Description Columns with Enhanced Fade In from Bottom */}
          <div className="w-full max-w-7xl mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 mb-16">
              {/* Left Column */}
              <motion.div
                className="text-gray-300 leading-relaxed group"
                variants={contentVariants}
                custom={0}
              >
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="absolute -left-4 top-0 w-1 bg-red-500 origin-top"
                    initial={{ scaleY: 0 }}
                    whileHover={{ scaleY: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <p className="text-gray-300 group-hover:text-white transition-colors duration-300 
                  text-sm sm:text-base lg:text-base leading-8 font-medium font-[Open_Sans] tracking-wider">
                   {pageData?.contentLines[0]}
                  </p>
                </motion.div>
              </motion.div>

              {/* Right Column */}
              <motion.div
                className="text-gray-300 leading-relaxed group"
                variants={contentVariants}
                custom={1}
              >
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="absolute -left-4 top-0 w-1 bg-red-500 origin-top"
                    initial={{ scaleY: 0 }}
                    whileHover={{ scaleY: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <p className="ext-gray-300 group-hover:text-white transition-colors duration-300 
                  text-sm sm:text-base lg:text-base leading-8 font-medium font-[Open_Sans] tracking-wider">
                   {pageData?.contentLines[1]}
                  </p>
                </motion.div>
              </motion.div>
            </div>      
            <motion.div
              className="text-[10px] font-medium text-center tracking-[5px]"
              variants={contentVariants}
              custom={2}
            >
                {pageData?.closeLine}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RedZoneCreativePageInteractive;

