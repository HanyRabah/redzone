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

const creativeImages = [
  {
    id: 1,
    src: "/images/about/adult-brainstorming-business-1437908.jpg",
    alt: "Brainstorming session",
  },
  {
    id: 2,
    src: "/images/about/apple-computer-desk-159807.jpg",
    alt: "Workspace setup",
  },
  {
    id: 3,
    src: "/images/about/apple-brainstorming-business-908288.jpg",
    alt: "Team meeting",
  },
  {
    id: 4,
    src: "/images/about/adult-bear-beautiful-792535.jpg",
    alt: "Creative process",
  },
  {
    id: 5,
    src: "/images/about/hands-indoors-man-1204001.jpg",
    alt: "Hands on project",
  },
];

const WeAreCreative = () => {
  const [isMounted, setIsMounted] = useState(false);
  //const [swiper, setSwiper] = useState(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="bg-gray-100 py-20 md:py-32">
      <div className="container-full px-4">
        {/* Section Header */}
        <div
          className="text-center max-w-3xl mx-auto mb-16"
          data-animation-container
        >
          <h2
            className="text-4xl md:text-5xl lg:text-6xl uppercase font-[Oswald] font-bold text-gray-900 mb-8"
            data-animation-child
            data-animation="overlay-anim2"
          >
            We are creative
          </h2>
          <div className="space-y-6">
            <p
              className="text-lg text-gray-700 leading-relaxed"
              data-animation-child
              data-animation="fade-anim"
            >
              Succulents mlkshk hammock jean shorts flexitarian chicharrones,
              skateboard 90's knausgaard heirloom sustainable fixie forage.
              Vegan cloud bread forage lyft, cornhole food truck salvia portland
              locavore mlkshk. Etsy synth taxidermy godard DIY, tote bag
              fingerstache
            </p>
            <p
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
            </p>
          </div>
        </div>

        {/* Swiper Slider */}
        <div className="relative">
          {isMounted && (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={2}
              centeredSlides={true}
              loop={false}
              speed={1400}
              freeMode={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              // pagination={{
              //   clickable: true,
              //   el: '.swiper-pagination',
              //   renderBullet: (index, className) => {
              //     return `<span class="${className} bg-red-500"></span>`;
              //   },
              // }}
              //onSwiper={(swiper) => setSwiper(swiper)}
              className="w-full h-[500px] md:h-[600px] lg:h-[700px]"
            >
              {creativeImages.map((image) => (
                <SwiperSlide key={image.id} className="relative">
                  <div className="relative w-full h-full">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </SwiperSlide>
              ))}
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
                // isDisabled={swiperRef?.activeIndex === 0}
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
                // isDisabled={swiperRef?.activeIndex === slides.length - 1}
              />
            </div>
          </Box>
        </div>
      </div>
    </section>
  );
};

export default WeAreCreative;

{
  /* Main Content Section */
}
{
  /* <section id="content" className="py-20 md:py-32 bg-gray-900">
 <div className="container mx-auto px-4">
   <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
     <motion.div
       initial={{ opacity: 0, x: -50 }}
       whileInView={{ opacity: 1, x: 0 }}
       viewport={{ once: true }}
       transition={{ duration: 0.8 }}
       className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden"
     >
       <Image
         src="/assets/images/about/team.jpg"
         alt="Our Team"
         fill
         className="object-cover"
       />
     </motion.div>
     
     <motion.div
       initial={{ opacity: 0, x: 50 }}
       whileInView={{ opacity: 1, x: 0 }}
       viewport={{ once: true }}
       transition={{ duration: 0.8, delay: 0.2 }}
       className="space-y-6"
     >
       <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">
         We Are Creative
       </h2>
       <div className="h-1 w-20 bg-red-500"></div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
         <p className="text-gray-300 leading-relaxed group">
           Affogato thundercats quinoa, portland cold-pressed edison
           bulb artisan paleo banjo tousled try-hard food truck pop-up
           bushwick godard. Occupy 90&apos;s try-hard tote bag chicharrones
           stumptown polaroid hashtag cliche +1, tousled fanny pack.
           Tote bag iPhone crucifix hella helvetica food truck bicycle
           rights cloud bread. Yr iPhone asymmetrical, next level
           vexillologist godard blog green juice chia. Tacos jean
           shorts pickled PBR&B poutine.
         </p>
         <p className="text-gray-300 leading-relaxed group">
           Godard slow-carb chartreuse occupy, tumblr letterpress pok
           pok tattooed yr lyft yuccie kinfolk. IPhone kombucha shaman
           gastropub snackwave 90&apos;s lo-fi pug chillwave pok pok tofu.
           Swag deep v listicle roof party seitan man braid raclette
           church-key trust fund locavore vexillologist green juice raw
           denim tilde meh. Austin thundercats locavore taiyaki
           snackwave hoodie put a bird on it tattooed selvage kitsch
           ramps.
         </p>
       </div>
       <div className="text-xs font-medium text-center tracking-[5px] text-gray-400 pt-8">
         GODARD SLOW-CARB CHARTREUSE OCCUPY, TUMBLR LETTERPRESS
       </div>
       
       <div className="grid grid-cols-2 gap-6 pt-4">
         {stats.map((stat, index) => (
           <div key={index}>
             <h3 className="text-4xl font-bold text-red-500 mb-2">{stat.value}</h3>
             <p className="text-gray-400 uppercase text-sm tracking-wider">{stat.label}</p>
           </div>
         ))}
       </div>
     </motion.div>
   </div>
 </div>
</section> */
}
