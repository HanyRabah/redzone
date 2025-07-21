"use client";
import React from "react";
import { Box, Avatar } from "@mui/material";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Testimonial } from "@prisma/client";

const Testimonials = ({ pageData }: { pageData: Testimonial[] }) => {
 
  return (
    <div className="bg-[#f0f0f0] py-30 px-4">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{
          el: "#testimonials-pagination",
          type: "bullets",
          clickable: true, 
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="h-full"
        speed={1000}
      >
        {pageData.map((testimonial) => (
          <SwiperSlide key={testimonial.id}>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.767, 0.01, 0.18, 1.01] }}
            >
              <Avatar
                src={testimonial.avatar || ""}
                alt={testimonial.name}
                sx={{ width: 100, height: 100 }}
                className="mx-auto mb-12 rounded-full"
              />

              <Box className="relative bg-black p-12 mb-8 max-w-4xl mx-auto">
                {/* Quote Triangle */}
                <Box className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-black rotate-45" />

                <p className="text-xl font-black text-white tracking-wide text-justify">
                  {testimonial.content}
                </p>
              </Box>

              <p className="text-red-500 text-xs uppercase tracking-widest font-semibold">
                {testimonial.name},{" "}
                <span className="text-gray-600">{testimonial.role}</span>
              </p>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Custom Pagination */}
      <div id="testimonials-pagination" className="flex items-center justify-center space-x-8 mt-20">
      
      </div>
      <style jsx global>{`
        .swiper-pagination-bullet{
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: var(--foreground);
          transition: all 0.3s ease-in-out;
        }
        .swiper-pagination-bullet-active{
          background-color: var(--foreground);
          transform: scale(1.5);
        }
      `}</style>
    </div>
  );
};

export default Testimonials;
