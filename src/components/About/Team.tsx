import React from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

const teamMembers = [
  {
    id: 1,
    name: "Balanchaev Balancha",
    role: "Web Designer",
    image: "/images/team/1.jpg",
  },
  {
    id: 2,
    name: "James Basinski",
    role: "Graphic Designer",
    image: "/images/team/2.jpg",
  },
  {
    id: 3,
    name: "Steve Kong",
    role: "Art Director",
    image: "/images/team/3.jpg",
  },
  {
    id: 4,
    name: "Leila York",
    role: "Manager",
    image: "/images/team/4.jpg",
  },
  {
    id: 5,
    name: "Balancha Balanchaevich",
    role: "Web Designer",
    image: "/images/team/5.jpg",
  },
];

const Team = () => {

  const titleVariants: Variants = {
    offscreen: {
      opacity: 0,
      y: 30,
      rotate: -10,
    },
    onscreen: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: (index: number) => ({
        duration: 1 * index,
        delay: 1.6 + index * 0.1,
        ease: [0.858, 0.01, 0.068, 0.99],
      }),
    },
  };
  
const overlayVariants: Variants = {
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
  return (
    <section className="bg-black py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => {
            return index === 0 ? (
              <div key={0} className="pr-0 md:pr-10">
                <h2 className="text-red-500 text-sm uppercase font-bold inline-block">
                  <motion.span
                    initial="offscreen"
                    whileInView="onscreen"
                    viewport={{ amount: 0.8 }}
                    variants={titleVariants}
                  >
                    Our Best Experts
                  </motion.span>
                </h2>
                <h3 className="text-2xl md:text-3xl lg:text-4xl uppercase font-semibold text-white leading-tight">
                  <motion.span
                    initial="offscreen"
                    whileInView="onscreen"
                    viewport={{ amount: 0.8 }}
                    variants={titleVariants}
                    custom={0}
                  >
                    <span className="block overflow-hidden">Team You</span>
                  </motion.span>

                  <motion.span
                    initial="offscreen"
                    whileInView="onscreen"
                    viewport={{ amount: 0.8 }}
                    variants={titleVariants}
                    custom={1}
                  >
                    <span className="block overflow-hidden">Want to</span>
                  </motion.span>
                  <motion.span
                    initial="offscreen"
                    whileInView="onscreen"
                    viewport={{ amount: 0.8 }}
                    variants={titleVariants}
                    custom={2}
                  >
                    <span className="block overflow-hidden">Work With</span>
                  </motion.span>
                </h3>
              </div>
            ) : (
              <div
                key={member.id}
                className="group relative overflow-hidden"
                data-animation-container
              >
                <a href="#" className="block relative pointer-large">
                  <div
                    className="relative overflow-hidden"
                    data-animation-child
                    data-animation="overlay-anim2"
                  >
                      <div className="relative aspect-[3/4] w-full overflow-hidden">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <motion.div variants={overlayVariants}  initial="hidden" animate="visible" custom={index} className="absolute inset-0 bg-black" />
                      </div>
                  </div>
                  <div className="mt-4">
                    <h4
                      className="text-xl relative font-oswald font-medium text-white mb-1"
                      data-animation-child
                      data-animation="fade-anim"
                    >
                      {member.name}
                      <motion.div variants={overlayVariants}  initial="hidden" animate="visible" custom={index + 1} className="absolute inset-0 bg-black" />
                    </h4>
                    <p
                      className="text-gray-400 relative text-sm"
                      data-animation-child
                      data-animation="fade-anim"
                    >
                      {member.role}
                      <motion.div variants={overlayVariants}  initial="hidden" animate="visible" custom={index + 2} className="absolute inset-0 bg-black" />
                    </p>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Team;
