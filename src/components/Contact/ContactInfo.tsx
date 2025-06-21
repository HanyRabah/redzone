"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface ContactInfoProps {
  className?: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ className = '' }) => {
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
        ease: "easeOut"
      }
    },
  };

  return (
    <section 
      id="down" 
      className={`bg-black min-h-screen flex items-center ${className}`}
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
              <span className="inline-block uppercase">Contact us</span>
            </motion.h2>
            <motion.p 
              className="text-sm text-center font-[Open_Sans] text-gray-400 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Succulents mlkshk hammock jean shorts flexitarian chicharrones, skateboard 90&apos;s knausgaard heirloom sustainable fixie forage. Vegan cloud bread forage lyft, cornhole food truck salvia portland locavore mlkshk. Etsy synth taxidermy godard DIY, tote bag fingerstache.
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            {/* Email Section */}
            <motion.div className="pb-16 md:pb-0" variants={itemVariants}>
              <div className="md:mr-5">
                <motion.p 
                  className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-4"
                  variants={itemVariants}
                >
                  Email us
                </motion.p>
                
                <div className="space-y-2">
                  <motion.h6 variants={itemVariants}>
                    <motion.a 
                      href="mailto:amr.elwadidy@gmail.com" 
                      className="group relative inline-block text-white hover:text-red-500 transition-colors duration-300 cursor-pointer"
                      variants={linkVariants}
                      initial="rest"
                      whileHover="hover"
                    >
                      <span className="relative z-10 uppercase">amr.elwadidy@gmail.com</span>
                      <motion.span 
                        className="absolute inset-0 bg-red-500 -z-10"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        style={{ originX: 0 }}
                      />
                    </motion.a>
                  </motion.h6>
                  <motion.h6 variants={itemVariants}>
                    <motion.a 
                      href="mailto:amr.elwadidy@red-zone.com" 
                      className="group relative inline-block text-white hover:text-red-500 transition-colors duration-300 cursor-pointer"
                      variants={linkVariants}
                      initial="rest"
                      whileHover="hover"
                    >
                      <span className="relative z-10 uppercase">amr.elwadidy@red-zone.com</span>
                      <motion.span 
                        className="absolute inset-0 bg-red-500 -z-10"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        style={{ originX: 0 }}
                      />
                    </motion.a>
                  </motion.h6>
                </div>
              </div>
            </motion.div>

            {/* Visit Section */}
            <motion.div className="pb-16 md:pb-0" variants={itemVariants}>
              <div className="md:mx-2">
                <motion.p 
                  className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-4"
                  variants={itemVariants}
                >
                  Visit us
                </motion.p>
                <motion.h6 
                  className="text-gray-300 text-lg mb-2"
                  variants={itemVariants}
                >
                  <span className="inline-block uppercase">Giza, Egypt</span>
                </motion.h6>
                <motion.div variants={itemVariants}>
                  <motion.a 
                    href="#" 
                    className="group relative inline-block text-white hover:text-red-500 transition-colors duration-300 cursor-pointer"
                    variants={linkVariants}
                    initial="rest"
                    whileHover="hover"
                  >
                    <span className="relative z-10 uppercase">open in google maps</span>
                    <motion.span 
                      className="absolute inset-0 bg-red-500 -z-10"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      style={{ originX: 0 }}
                    />
                  </motion.a>
                </motion.div>
              </div>
            </motion.div>

            {/* Call Section */}
            <motion.div className="pb-16 md:pb-0" variants={itemVariants}>
              <div className="md:ml-5">
                <motion.p 
                  className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-4"
                  variants={itemVariants}
                >
                  Call us
                </motion.p>
                
                <div className="space-y-2">
                  <motion.h6 variants={itemVariants}>
                    <motion.a 
                      href="tel:+201156659999" 
                      className="group relative inline-block text-white hover:text-red-500 transition-colors duration-300 cursor-pointer"
                      variants={linkVariants}
                      initial="rest"
                      whileHover="hover"
                    >
                      <span className="relative z-10">+201156659999</span>
                      <motion.span 
                        className="absolute inset-0 bg-red-500 -z-10"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        style={{ originX: 0 }}
                      />
                    </motion.a>
                  </motion.h6>
                  <motion.h6 variants={itemVariants}>
                    <motion.a 
                      href="tel:+201156659998" 
                      className="group relative inline-block text-white hover:text-red-500 transition-colors duration-300 cursor-pointer"
                      variants={linkVariants}
                      initial="rest"
                      whileHover="hover"
                    >
                      <span className="relative z-10">+201156659998</span>
                      <motion.span 
                        className="absolute inset-0 bg-red-500 -z-10"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        style={{ originX: 0 }}
                      />
                    </motion.a>
                  </motion.h6>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;