"use client"
import React from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { TeamMember, TeamSection } from "@prisma/client";

const Team = ({
  teamSection,
  teamMembers,
}: {
  teamSection: TeamSection | null;
  teamMembers: TeamMember[];
}) => {
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
  if (!teamSection) return null;
  return (
    <section className="bg-black py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="pr-0 md:pr-10">
            <h2 className="text-red-500 text-sm uppercase font-bold inline-block">
              <motion.span
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ amount: 0.8 }}
                variants={titleVariants}
              >
                {teamSection.smallTitle}
              </motion.span>
            </h2>
            <h3 className="text-2xl md:text-3xl lg:text-4xl uppercase font-semibold text-white leading-tight">
              {teamSection.titleLines.map((line, index) => {
                return (
                  <motion.span
                    initial="offscreen"
                    whileInView="onscreen"
                    viewport={{ amount: 0.8 }}
                    variants={titleVariants}
                    custom={index}
                    key={index}
                  >
                    <span className="block overflow-hidden">{line}</span>
                  </motion.span>
                );
              })}
            </h3>
            {/* <p className="text-gray-400 text-sm mt-4">
              {teamSection.descriptionLines.map((line, index) => {
                return (
                  <motion.span
                    initial="offscreen"
                    whileInView="onscreen"
                    viewport={{ amount: 0.8 }}
                    variants={titleVariants}
                    custom={index}
                    key={index}
                  >
                    <span className="block overflow-hidden">{line}</span>
                  </motion.span>
                );
              })}
            </p> */}
          </div>
          {teamMembers.map((member, index) => {
            return (
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
                        src={member.image || ""}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <motion.div
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        custom={index}
                        className="absolute inset-0 bg-black"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4
                      className="text-xl relative font-oswald font-medium text-white mb-1"
                      data-animation-child
                      data-animation="fade-anim"
                    >
                      {member.name}
                      <motion.div
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        custom={index + 1}
                        className="absolute inset-0 bg-black"
                      />
                    </h4>
                    <p
                      className="text-gray-400 relative text-sm"
                      data-animation-child
                      data-animation="fade-anim"
                    >
                      {member.designation}
                      <motion.span
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        custom={index + 2}
                        className="absolute inset-0 bg-black"
                      />
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
