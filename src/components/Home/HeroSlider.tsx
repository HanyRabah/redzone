"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { SlideData } from "@/types";
import { Box } from "@mui/material";
import ScrollDown from "../Layout/ScrollDown";
import FlipButton from "../Layout/Flippers/FlipButton";
import FlipCtaButton from "../Layout/Flippers/FlipCtaButton";
import { ChevronArrowWithTail } from "../Layout/Arrow/arrow";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slideMock: SlideData[] = [
  // {
  //   title: ["We generate", "creative &", "novation ideas"],
  //   description: ["XOXO fam brunch", "retro intelligentsia", "live-edge vegan"],
  //   bgImage: "/images/backgrounds/pexels-photo-1806031.jpeg",
  //   theme: "dark",
  // },
  {
    title: ["Best Solutions", "& ideas for", "Your Business"],
    subtitle: "Welcome Red Zone",
    bgImage: "/images/backgrounds/adolescent-adult-diversity-1034361.jpg",
    theme: "light",
  },
];

const HeroSlider: React.FC<{
  slides?: SlideData[];
  showReadMore?: boolean;
}> = ({ slides = slideMock, showReadMore = true }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperRef, setSwiperRef] = useState<any | null>(null);

  const overlayVariants = {
    hidden: { x: 0 },
    visible: (i: number) => ({
      x: "110%",
      transition: {
        delay: 1.6 + i * 0.1,
        duration: 1,
        ease: [0.858, 0.01, 0.068, 0.99],
      },
    }),
  };

  const fadeVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.7,
        duration: 1,
        ease: [0.767, 0.01, 0.18, 1.01],
      },
    },
  };

  const textVariants = {
    initial: { width: "100%", scaleX: 1, originX: 0 },
    animate: {
      scaleX: 0,
      originX: 0,
      transition: (i: number) => ({
        delay: 1.7 + i * 0.1,
        duration: 1,
        ease: [0.767, 0.01, 0.18, 1.01],
      }),
    },
  };

  return (
    <Box className="relative h-screen overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 10000,
          disableOnInteraction: false,
        }}
        onSwiper={(swiper) => setSwiperRef(swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <Box className="relative h-full w-full flex flex-col md:flex-row">
              {/* Left Side - Background Image (Blurred) */}
              <Box className="w-full md:w-1/2 relative overflow-hidden h-1/2 md:h-auto">
                <Box
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
                  style={{
                    backgroundImage: `url(${slide.bgImage})`,
                    filter: "blur(3px)",
                  }}
                />
                <Box className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50" />
              </Box>

              {/* Right Side - Content Area */}
              <motion.div
                custom={index}
                variants={{
                  hidden: { opacity: 0, width: 0 },
                  initial: { opacity: 1, width: "100vw" },
                  visible: { opacity: 1, width: "50vw" },
                  exit: { opacity: 0, width: 0 },
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeInOut",
                }}
                initial="initial"
                exit="exit"
                animate="visible"
                className="w-full md:w-1/2 bg-black relative flex items-center h-1/2 md:h-auto"
              >
                <Box className="px-4 md:px-16 py-10 md:py-20 w-full">
                  <AnimatePresence mode="wait">
                    {activeIndex === index && (
                      <div key={index} className="space-y-4 md:space-y-8">
                        {/* Subtitle */}
                        <h2 className="overflow-hidden relative w-fit m-0 leading-[1">
                          {slide.subtitle && (
                            <motion.div custom={3} variants={textVariants} className="relative">
                              <span className="text-[25px] md:text-[30px] lg:text-[38px] xl:text-[45px] font-bold uppercase text-red-600 tracking-wider">
                                {slide.subtitle}
                              </span>
                              <motion.div custom={2} variants={overlayVariants}className="absolute inset-0 bg-black" />
                            </motion.div>
                          )}
                        </h2>
                        {/* Main Title */}
                        <h3 className="overflow-hidden relative w-fit m-0 leading-[1]">
                          {slide.title.map((line, i) => (
                            <motion.div
                              key={i}
                              custom={i}
                              variants={textVariants}
                              className="relative"
                            >
                              <span className="text-[35px] md:text-[45px] lg:text-[55px] xl:text-[65px] font-bold uppercase text-white tracking-[-2px]">
                                {line}
                              </span>
                              <motion.div
                                custom={i}
                                variants={overlayVariants}
                                className="absolute inset-0 bg-black"
                              />
                            </motion.div>
                          ))}
                        </h3>
                        {/* CTA Button */}
                        {showReadMore && (
                          <motion.div
                            variants={fadeVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 1.7, duration: 0.5 }}
                            className="mt-4 md:mt-8 w-fit overflow-hidden"
                          >
                            <FlipCtaButton
                              text="Read more"
                              onClick={() => {}}
                            />
                          </motion.div>
                        )}
                      </div>
                    )}
                  </AnimatePresence>
                </Box>
              </motion.div>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>

      {slides.length > 1 && (
        <>
          <Box className="absolute bottom-8 left-[50%] translate-x-1/2 z-20 flex space-x-4">
            <ChevronArrowWithTail
              size="lg"
              direction="left"
              className="link text-white"
              onClick={() => swiperRef?.slidePrev()}
              isDisabled={swiperRef?.activeIndex === 0}
            />
            <ChevronArrowWithTail
              size="lg"
              direction="right"
              className="link text-white"
              onClick={() => swiperRef?.slideNext()}
              isDisabled={swiperRef?.activeIndex === slides.length - 1}
            />
          </Box>

          <Box className="absolute bottom-8 right-8 z-20 h-8 flex items-bottom space-x-8">
            <div>
              <FlipButton
                text="01"
                onClick={() => swiperRef?.slidePrev()}
                isActive={swiperRef?.activeIndex === 0}
              />
            </div>
            <div>
              <FlipButton
                text="02"
                onClick={() => swiperRef?.slideNext()}
                isActive={swiperRef?.activeIndex === 1}
              />
            </div>
          </Box>
        </>
      )}

      <ScrollDown />
    </Box>
  );
};

export default HeroSlider;
