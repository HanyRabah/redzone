"use client";

import React from "react";
import { motion } from "framer-motion";
import type { ContactItem, ContactDetailsTypes } from '@/components/Contact/types';

interface ContactInfoProps {
  contactDetails: ContactDetailsTypes | null;
}

const ContactInfo: React.FC<ContactInfoProps> = ({
  contactDetails,
}) => {
  // Animation variants 
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.17, 0.85, 0.438, 0.99],
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.17, 0.85, 0.438, 0.99],
      },
    },
  };

  const linkVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  if (!contactDetails) {
    return null;
  }

  return (
    <section
      id="down"
      className={`bg-black min-h-screen flex items-center`}
    >
      <div className="w-full">
        <div className="container mx-auto px-4 pt-32 pb-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.h2
              className="text-4xl md:text-6xl font-bold text-center text-white mb-8"
              variants={titleVariants}
            >
              <span className="inline-block uppercase">
                {contactDetails?.title}
              </span>
            </motion.h2>
            <motion.p
              className="text-sm text-center font-[Open_Sans] font-[400] tracking-wider text-gray-400 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              {contactDetails?.description}
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            {contactDetails?.contacts?.map((contact: ContactItem, index: number) => (
              <motion.div 
                key={index} 
                className="flex justify-center items-center pb-16 md:pb-0" 
                variants={itemVariants}
              >
                <div className="md:mr-5">
                  <motion.p
                    className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-4"
                    variants={itemVariants}
                  >
                    {contact.title || 'Untitled'}
                  </motion.p>
                  <div className="space-y-2">
                    {contact.items.map((item: string, itemIndex: number) => {
                      let href = "";
                      if (contact.title === "Email Us") {
                        href = `mailto:${item}`;
                      } else if (contact.title === "Call Us") {
                        href = `tel:${item.replace(/[^0-9+]/g, '')}`;
                      } else if (contact.title === "Visit Us") {
                        href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item)}`;
                      }
                      
                      return (
                        <motion.div key={itemIndex} variants={itemVariants}>
                          <motion.a
                            href={href}
                            className="group relative inline-block text-white hover:text-red-500 transition-colors duration-300 cursor-pointer"
                            variants={linkVariants}
                            initial="rest"
                            whileHover="hover"
                          >
                            <span className="relative z-10 uppercase">
                              {item}
                            </span>
                            <motion.span
                              className="absolute inset-0 bg-red-500 -z-10"
                              initial={{ scaleX: 0 }}
                              whileHover={{ scaleX: 1 }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                              style={{ originX: 0 }}
                            />
                          </motion.a>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
