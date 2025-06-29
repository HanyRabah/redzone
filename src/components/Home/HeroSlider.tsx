"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import ScrollDown from "../Layout/ScrollDown";

// Extend the HTMLElement type to include progress property
interface ExtendedHTMLElement extends HTMLElement {
  progress?: number;
}
import FlipButton from "../Layout/Flippers/FlipButton";
import FlipCtaButton from "../Layout/Flippers/FlipCtaButton";
import { ChevronArrowWithTail } from "../Layout/Arrow/arrow";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper as SwiperClass } from 'swiper/types';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { HeroSlide, HeroSlider as HeroSliderType } from "@prisma/client";
import router from "next/router";

interface HeroSliderTypeWithSlides extends HeroSliderType {
  slides: HeroSlide[];
}

const HeroSlider: React.FC<{ pageSlides: HeroSliderTypeWithSlides | null }> = ({
  pageSlides,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperRef, setSwiperRef] = useState<SwiperClass | null>(null);

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

  const interleaveOffset = 0.5;

  if (!pageSlides?.slides.length) {
    return null;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Slider Navigation */}
      {pageSlides.slides.length > 1 && (
      <div className="absolute bottom-8 left-0 lg:left-[50%] translate-x-1/2 z-20 flex space-x-4">
        <ChevronArrowWithTail
          size="lg"
          direction="left"
          className="link text-white"
          onClick={() => swiperRef?.slidePrev()}
          isDisabled={activeIndex === 0}
        />
        <ChevronArrowWithTail
          size="lg"
          direction="right"
          className="link text-white"
          onClick={() => swiperRef?.slideNext()}
          isDisabled={activeIndex === pageSlides.slides.length - 1}
        />
      </div>
      )}

      {/* Slider Pagination */}
      {pageSlides.slides.length > 1 && (
        <div className="absolute bottom-8 right-12 lg:right-8 z-20 h-8 flex items-bottom space-x-8">
          {pageSlides.slides.map((slide, index) => (
              <div key={index}>
                <FlipButton
                  text={`0${index + 1}`}
                  onClick={() => swiperRef?.slideTo(index)}
                isActive={activeIndex === index}
              />
            </div>
          ))}
        </div>
      )}

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
        className="h-screen w-screen"
        speed={1500}
        watchSlidesProgress={true}
        onProgress={(swiper) => {
          for (let i = 0; i < swiper.slides.length; i++) {
            const slide = swiper.slides[i] as unknown as ExtendedHTMLElement;
            const slideProgress = slide.progress || 0;
            const innerOffset = swiper.width * interleaveOffset;
            const innerTranslate = slideProgress * innerOffset;
            const slideBg = slide.querySelector<HTMLElement>(".slide-bg");
            if (slideBg) {
              slideBg.style.transform = `translate3d(${innerTranslate}px, 0, 0)`;
            }
          }
        }}
        onTouchStart={(swiper) => {
          for (let i = 0; i < swiper.slides.length; i++) {
            swiper.slides[i].style.transition = "";
          }
        }}
        onSetTransition={(swiper, speed) => {
          for (let i = 0; i < swiper.slides.length; i++) {
            const slide = swiper.slides[i];
            slide.style.transition = speed + "ms";
            const slideBg = slide.querySelector(".slide-bg") as HTMLElement | null;
            if (slideBg) {
              slideBg.style.transition = speed + "ms";
            }
          }
        }}
      >
        {pageSlides?.slides?.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full flex flex-col md:flex-row bg-black">
              <motion.div
                custom={index}
                variants={{
                  hidden: { width: 0 },
                  initial: { width: "0%" },
                  visible: { width: "50%" },
                  exit: { width: 0 },
                }}
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                }}
                initial="initial"
                exit="exit"
                animate="visible"
                className="slide-bg absolute inset-0 bg-cover bg-center bg-no-repeat w-1/2"
                style={{
                  backgroundImage: `url(${slide.backgroundImage})`,
                }}
              />

              <div className="flex w-full items-center h-full">
                <div className="container relative flex flex-row mx-auto py-[120px]">
                  <div className="block relative box-border mx-auto lg:ml-[50%] basis-1/2 z-1">
                    <div className="ml-[40px]">
                      <AnimatePresence mode="wait">
                        {activeIndex === index && (
                          <div key={index}>
                            {/* welcome text */}
                            <h2 className="overflow-hidden relative w-fit m-0 leading-[1">
                              {slide.welcomeText ? (
                                <motion.div
                                  custom={3}
                                  variants={textVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="hidden"
                                  className="relative"
                                >
                                  <span className="text-[25px] md:text-[30px] lg:text-[38px] xl:text-[45px] font-bold uppercase text-red-600 tracking-wider">
                                    {slide.welcomeText}
                                  </span>
                                  <motion.div
                                    custom={2}
                                    variants={overlayVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    className="absolute inset-0 bg-black"
                                  />
                                </motion.div>
                              ) : null}
                            </h2>
                            {/* Main Title */}
                            <h3 className="overflow-hidden relative w-fit m-0 leading-[1]">
                              {slide.titleLines.map((line, i) => (
                                <motion.div
                                  key={i}
                                  custom={i}
                                  variants={textVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="hidden"
                                  className="relative"
                                >
                                  <span className="text-[35px] md:text-[45px] lg:text-[55px] xl:text-[65px] font-bold uppercase text-white tracking-[-2px]">
                                    {line}
                                  </span>
                                  <motion.div
                                    custom={i}
                                    variants={overlayVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    className="absolute inset-0 bg-black"
                                  />
                                </motion.div>
                              ))}
                            </h3>
                            <h4 className="overflow-hidden relative w-fit m-0 leading-[1] inline-block mr-4 mt-4">
                              <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  delay: 3,
                                  duration: 1,
                                  ease: [0.767, 0.01, 0.18, 1.01],
                                }}
                                exit={{ opacity: 0, y: 30 }}
                                className="relative"
                              >
                                <span className="text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px] font-normal uppercase text-white tracking-wider">
                                  {slide.description}
                                </span>
                              </motion.div>
                            </h4>
                            {/* CTA Button */}
                            {slide.buttonText && (
                              <motion.div
                                variants={fadeVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 1.7, duration: 0.5 }}
                                className="mt-4 md:mt-8 w-fit overflow-hidden"
                              >
                                {slide.buttonType === "anchor" ? (
                                  <FlipCtaButton
                                    text={slide.buttonText}
                                    href={slide.buttonLink || ""}
                                    color="red"
                                  />
                                ) : (
                                  <FlipCtaButton
                                    text={slide.buttonText}
                                    onClick={() =>
                                      router.push(slide.buttonLink || "")
                                    }
                                    color="red"
                                  />
                                )}
                              </motion.div>
                            )}
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <ScrollDown />
    </div>
  );
};

export default HeroSlider;
