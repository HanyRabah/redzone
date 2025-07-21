"use client";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { WhoWeAreSection } from "@prisma/client";

const WhoWeAre = ({ pageData }: { pageData: WhoWeAreSection | null }) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

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

  if (!pageData) return null;

  return (
    <AnimatePresence mode="wait">
      <section className="bg-black flex h-screen relative">
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
        <div className="container m-auto">
          <div className="flex flex-col md:flex-row" data-animation-container>
            <div className="pl-0 md:pl-10">
              <div className="mb-10">
                <h2 className="overflow-hidden relative w-full leading-[1] text-center">
                    <span className="text-[25px] md:text-[30px] lg:text-[38px] xl:text-[45px] font-bold uppercase text-white tracking-wider">
                      {pageData.title}  
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
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
              >
                <p
                  className="text-lg md:text-lg font-(family-name:--font-open-sans) text-[#BCBDBD] leading-[2] mb-10 tracking-normal"
                  data-animation-child
                  data-animation="fade-anim"
                >
                  {pageData.description}
                </p>
              </motion.div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-evenly mt-12">
            {/* Award 1 */}
            {pageData.extras.map((extra, index) => {
              const extraData = extra as { title: string; list: string[] };
              const List = extraData?.list as string[];
              const isListEmpty = List.every((list) => list === '');
              if(isListEmpty) return null;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: "easeInOut",
                  }}
                  className="mt-12 md:mt-0"
                  key={index}
                >
                  {extraData?.title&&
                  <h6
                    className="text-white text-sm uppercase font-bold mb-4 relative overflow-hidden inline-block"
                    data-animation-child
                    data-animation="title-fill-anim"
                    data-text="FWA"
                  >
                    {extraData?.title}
                  </h6>
                  }
                  {/* check if list data not empty */}
                  {!isListEmpty &&
                  <ul className="list-outside list-disc ml-6 space-y-2">
                    {List.map((list, index) => {
                      return (
                        <li key={index} className="text-red-500">
                          <p className="text-gray-400 text-xs tracking-[2] uppercase">
                            {list}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                  }
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </AnimatePresence>
  );
};

export default WhoWeAre;
