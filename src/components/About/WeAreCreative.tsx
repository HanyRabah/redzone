"use client";

import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { Box } from "@mui/material";
import { ChevronArrowWithTail } from "../Layout/Arrow/arrow";
import { WeAreCreativeSection } from "@prisma/client";
import useBreakpoint from "@/hooks/useBreakpoint";

const WeAreCreative = ({
  pageData,
}: {
  pageData: WeAreCreativeSection | null;
}) => {
  const breakpoint = useBreakpoint();
  const [isMounted, setIsMounted] = useState(false);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="bg-gray-100 py-20 md:py-32">
      <div className="container-full px-4">
        {/* Section Header */}
        <div
          className="text-center max-w-6xl mx-auto mb-16"
          data-animation-container
        >
          <h2
            className="text-4xl md:text-5xl lg:text-6xl uppercase font-[Oswald] font-bold text-gray-900 mb-8"
            data-animation-child
            data-animation="overlay-anim2"
          >
            {pageData?.title}
          </h2>
          <div className="space-y-6">
            <p
              className="text-lg text-gray-700 leading-relaxed"
              data-animation-child
              data-animation="fade-anim"
            >
              {pageData?.description}
            </p>
            {/* <p
              className="text-gray-600"
              data-animation-child
              data-animation="fade-anim"
            >
              Hoodie roof party organic umami kombucha thundercats. Pok pok
              normcore snackwave venmo deep v, quinoa everyday carry la croix.
              Tattooed chia kickstarter, woke ramps subway tile meggings enamel
              pin. Sustainable pop-up craft beer single-origin coffee.
            </p>
            <p
              className="text-gray-600"
              data-animation-child
              data-animation="fade-anim"
            >
              Pok pok authentic fashion axe, vegan venmo leggings raclette
              tousled twee tattooed. Yuccie jianbing bespoke retro, photo booth
              salvia hella meh post-ironic cornhole tacos plaid. Helvetica hella
              vexillologist, prism lo-fi activated charcoal iPhone thundercats
              irony meggings meh cardigan chartreuse blue bottle hell of. Irony
              fixie tilde beard everyday.
            </p> */}
          </div>
        </div>

        {/* Swiper Slider */}
        <div className="relative">
          {isMounted && (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={breakpoint === 'tablet' ? 1 : 2}
              centeredSlides={true}
              loop={false}
              speed={1400}
              freeMode={true}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              className="w-full h-[200px] md:h-[600px] lg:h-[700px]"
            >
              {pageData?.images?.map((image, index) => {
                return (
                  <SwiperSlide key={index} className="relative">
                    <div className="relative w-full h-[200px] md:h-[600px] lg:h-[700px]">
                      <Image
                        src={image}
                        alt={"image"}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}

          {/* Navigation Arrows */}
          <Box className="absolute -bottom-10 left-[50%] translate-x-1/2 z-20 flex space-x-2">
            <div
              ref={nextRef}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center "
            >
              <ChevronArrowWithTail
                size="lg"
                direction="right"
                className="text-black pointer-large"
                isDisabled={
                  activeIndex === (pageData?.images?.length ?? 0) - 1
                }
              />
            </div>
            <div
              ref={prevRef}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center "
            >
              <ChevronArrowWithTail
                size="lg"
                direction="left"
                className="text-black pointer-large"
                isDisabled={activeIndex === 0}
              />
            </div>
          </Box>
        </div>
      </div>
    </section>
  );
};

export default WeAreCreative;
