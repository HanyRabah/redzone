"use client";
import React, { useRef } from "react";
import { Box, Typography, Container } from "@mui/material";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Client, Sections } from "@prisma/client";
import useBreakpoint from "@/hooks/useBreakpoint";

interface ClientsProps {
  clients: Client[];
  section?: Sections;
}

const Clients: React.FC<ClientsProps> = ({ clients, section }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const breakpoint = useBreakpoint();

  const titleVariants = {
    hidden: { width: "0%" },
    visible: (i: number) => ({
      width: "100%",
      transition: {
        delay: i * 0.1,
        duration: 1,
        ease: [0.767, 0.01, 0.18, 1.01],
      },
    }),
  };

  const clientVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.5 + i * 0.1,
        duration: 0.6,
        ease: [0.17, 0.85, 0.438, 0.99],
      },
    }),
  };

  const overlayVariants = {
    hidden: { x: 0 },
    visible: (i: number) => ({
      x: "100%",
      transition: {
        delay: 0.6 + i * 0.1,
        duration: 1,
        ease: [0.858, 0.01, 0.068, 0.99],
      },
    }),
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const getBorderClasses = (
    index: number,
    totalItems: number,
    cols: number
  ) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const totalRows = Math.ceil(totalItems / cols);

    let borderClasses = "";

    // Right border for all except last column
    if (col < cols - 1) {
      borderClasses += " border-r border-gray-400";
    }

    // Bottom border for all except last row
    if (row < totalRows - 1) {
      borderClasses += " border-b border-gray-400";
    }

    return borderClasses;
  };

  return (
    <Box className="bg-black py-20" ref={ref}>
      <Container>
        {/* Section Title */}
        <div className="my-8">
            <Box className="overflow-hidden">
              <motion.span
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={titleVariants}
                className="inline-block relative font-black text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-wide"
              >
                {section?.title}
                <motion.div
                  className="absolute inset-0 bg-black"
                  variants={overlayVariants}
                />
              </motion.span>
            </Box>
        </div>

        <div className="my-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-2 lg:grid-cols-4 mb-20"
          >
            {clients.map((client, index) => {
              if(!client.isActive) return null;
              return (
                <motion.div
                  key={`method2-${client.id}`}
                  variants={clientVariants}
                  custom={index}
                  className={`group relative h-48 p-4 flex items-center justify-center transition-colors duration-300 ${getBorderClasses(
                    index,
                    clients.length,
                    breakpoint === "desktop" ? 4 : 2
                  )}`} 
                >
                  <Link href={client.website || "#"} target={client.website ? "_blank" : "_self"} className="relative w-full h-full link">
                      <Image
                        src={client.logo}
                        alt={client.name}
                        fill
                        className="w-full h-full object-contain group-hover:opacity-100 transition-all duration-100 group-hover:[filter:invert(14%)_sepia(100%)_saturate(7463%)_hue-rotate(1deg)_brightness(103%)_contrast(103%)]"
                      />
                  </Link>
                </motion.div>
              )
            })}
            <motion.div
              custom={clients.length}
              variants={clientVariants}
              className="group relative h-48 flex flex-col items-center justify-center transition-colors duration-300 link"
            >
              <Typography className="text-white text-sm uppercase tracking-widest font-bold hover:border-red-500 transition-colors duration-300">
                This spot <br /> Awaits <br /> You
              </Typography>

              {/* Animated Corners */}
              <div className="absolute top-4 left-4 w-18 h-18 border-l-2 border-t-2  border-red-500 hover:w-24 hover:h-24 hover:border-red-500 transition-all duration-300" />
              {/* <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-red-500" /> */}
              {/* <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-red-500" /> */}
              <div className="absolute bottom-4 right-4 w-18 h-18 border-r-2 border-b-2 border-red-500 hover:w-24 hover:h-24 hover:border-red-500 transition-all duration-300" />
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </Box>
  );
};

export default Clients;
