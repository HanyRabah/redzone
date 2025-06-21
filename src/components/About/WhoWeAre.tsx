"use client";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

const WhoWeAre = () => {
  return (
    <AnimatePresence mode="wait">
      <section className="bg-black flex h-screen">
        <div className="container m-auto">
          <div className="flex flex-col md:flex-row" data-animation-container>
            {/* Left Column */}
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="pr-5">
                <h2 className="overflow-hidden relative w-fit m-0 leading-[1]">
                    <span className="text-[25px] md:text-[30px] lg:text-[38px] xl:text-[45px] font-bold uppercase text-white tracking-wider">
                      Who We Are
                    </span>
                    <motion.div
                      initial={{ x: 0 }}
                      animate={{ x: "110%" }}
                      transition={{
                        delay: 1.6 * 0.1,
                        duration: 1,
                        ease: [0.858, 0.01, 0.068, 0.99],
                      }}
                      className="absolute inset-0 bg-black"
                    />
                </h2>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-2/3 lg:w-3/4 mt-10 md:mt-0">
              <div className="pl-0 md:pl-10">
              <motion.div
                  initial={{ opacity:0, y: 100 }}
                  animate={{ opacity:1, y: 0 }}
                  transition={{
                    duration: .5,
                    ease: "easeInOut"
                  }}
                >
                  <p
                    className="text-lg md:text-lg font-(family-name:--font-open-sans) text-[#BCBDBD] leading-[2] mb-10 tracking-normal"
                    data-animation-child
                    data-animation="fade-anim"
                  >
                    Godard slow-carb chartreuse occupy, tumblr letterpress pok pok
                    tattooed yr lyft yuccie kinfolk. IPhone kombucha shaman
                    gastropub snackwave 90&apos;s lo-fi pug chillwave pok pok tofu.
                    Swag deep v listicle roof party seitan man braid raclette
                    church-key trust fund locavore vexillologist green juice raw
                    denim tilde meh. Austin thundercats locavore taiyaki snackwave
                    hoodie put a bird on it tattooed selvage kitsch ramps.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Award 1 */}
            <motion.div
                  initial={{ opacity:0, y: 100 }}
                  animate={{ opacity:1, y: 0 }}
                  transition={{
                    duration: .8,
                    delay: .1,
                    ease: "easeInOut"
                  }}
                  className="mt-12 md:mt-0"
                >
              <h6
                className="text-white text-sm uppercase font-bold mb-4 relative overflow-hidden inline-block"
                data-animation-child
                data-animation="title-fill-anim"
                data-text="FWA"
              >
                FWA
              </h6>
              <ul className="list-outside list-disc ml-6 space-y-2">
                <li className="text-red-500">
                  <p className="text-gray-400 text-xs tracking-[2] uppercase">Winnings 2019</p>
                </li>
                <li className="text-red-500">
                  <p className="text-gray-400 text-xs tracking-[2] uppercase">Nominees 2018</p>
                </li>
              </ul>
            </motion.div>

            {/* Award 2 */}
            <motion.div
                  initial={{ opacity:0, y: 100 }}
                  animate={{ opacity:1, y: 0 }}
                  transition={{
                    duration: .8,
                    delay: .2,
                    ease: "easeInOut"
                  }}
                  className="mt-12 md:mt-0"
                >
              <h6
                className="text-white text-sm uppercase font-bold mb-4 relative overflow-hidden inline-block"
                data-animation-child
                data-animation="title-fill-anim"
                data-text="CSS Design Awards"
              >
                CSS Design Awards
              </h6>
              <ul className="list-outside list-disc ml-6 space-y-2">
                <li className="text-red-500">
                  <p className="text-gray-400 text-xs tracking-[2] uppercase">Best developer</p>
                </li>
                <li className="text-red-500">
                  <p className="text-gray-400 text-xs tracking-[2] uppercase">Best graphic design</p>
                </li>
              </ul>
            </motion.div>

            {/* Award 3 */}
            <motion.div
                  initial={{ opacity:0, y: 100 }}
                  animate={{ opacity:1, y: 0 }}
                  transition={{
                    duration: .8,
                    delay: .3,
                    ease: "easeInOut"
                  }}
                  className="mt-12 md:mt-0"
                >
              <h6
                className="text-white text-sm uppercase font-bold mb-4 relative overflow-hidden inline-block"
                data-animation-child
                data-animation="title-fill-anim"
                data-text="Awwwards"
              >
                Awwwards
              </h6>
              <ul className="list-outside list-disc ml-6 space-y-2">
                <li className="text-red-500">
                  <p className="text-gray-400 text-xs tracking-[2] uppercase">Best creative agency</p>
                </li>
                <li className="text-red-500">
                  <p className="text-gray-400 text-xs tracking-[2] uppercase">Best Services</p>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
    </AnimatePresence>
  );
};

export default WhoWeAre;
