"use client"
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FlipCtaButton from '@/components/Layout/Flippers/FlipCtaButton';

interface ContactFormProps {
  className?: string;
  backgroundImage?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

interface PopupState {
  show: boolean;
  type: 'success' | 'error';
}

const ContactForm: React.FC<ContactFormProps> = ({ 
  className = '', 
  backgroundImage = '/images/backgrounds/pexels-photo-1287145.jpeg' 
}) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popup, setPopup] = useState<PopupState>({ show: false, type: 'success' });
  const [formVisible, setFormVisible] = useState(true);

  const formRef = useRef<HTMLFormElement>(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormVisible(false);

    try {
      // Simulate form submission
      // await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await fetch('/api/admin/contact-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      // Simulate success/error randomly for demo
      //const isSuccess = Math.random() > 0.3;
      const isSuccess = response.ok;
      
      setPopup({ show: true, type: isSuccess ? 'success' : 'error' });
      
      if (isSuccess) {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          message: ''
        });
      }
    } catch {
      setPopup({ show: true, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closePopup = () => {
    setPopup({ show: false, type: 'success' });
    setFormVisible(true);
  };

  return (
    <section 
      className={`min-h-screen bg-cover bg-center bg-no-repeat relative ${className}`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32">
          <AnimatePresence mode="wait">
            {formVisible && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.8 }}
                variants={containerVariants}
                className="w-full"
              >
                <motion.h2
                  className="text-sm font-medium text-gray-300 text-center uppercase tracking-[0.2em] mb-12 sm:mb-16 lg:mb-24"
                  variants={titleVariants}
                >
                  Let&apos;s Get In Touch!
                </motion.h2>
                
                <form 
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="space-y-8 sm:space-y-12"
                >
                  {/* Name Fields Row */}
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8"
                    variants={itemVariants}
                  >
                    {/* First Name */}
                    <div className="relative">
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-0 py-4 sm:py-5 bg-transparent border-0 border-b border-white/40 focus:border-white focus:outline-none text-white text-sm sm:text-base font-normal tracking-wide transition-colors duration-500 placeholder-transparent peer"
                        placeholder="First name"
                      />
                      <label
                        htmlFor="firstName"
                        className="absolute left-0 top-4 sm:top-5 text-sm sm:text-base font-medium tracking-wide text-white/70 pointer-events-none transition-all duration-300 transform-gpu peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:translate-y-[-28px] peer-focus:scale-75 peer-focus:text-white peer-valid:translate-y-[-28px] peer-valid:scale-75 peer-valid:text-white origin-left"
                      >
                        First name
                      </label>
                    </div>

                    {/* Last Name */}
                    <div className="relative">
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="
                        w-full px-0 py-4 sm:py-5 
                        bg-transparent 
                        border-0 border-b border-white/40 focus:border-white focus:outline-none 
                        text-white text-sm sm:text-base font-normal 
                        tracking-wide 
                        transition-colors duration-500 placeholder-transparent peer"
                        placeholder="Last name"
                      />
                      <label
                        htmlFor="lastName"
                        className="absolute left-0 top-4 sm:top-5 text-sm sm:text-base font-medium tracking-wide text-white/70 pointer-events-none transition-all duration-300 transform-gpu peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:translate-y-[-28px] peer-focus:scale-75 peer-focus:text-white peer-valid:translate-y-[-28px] peer-valid:scale-75 peer-valid:text-white origin-left"
                      >
                        Last name
                      </label>
                    </div>
                  </motion.div>

                  {/* Email Field */}
                  <motion.div className="relative" variants={itemVariants}>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-0 py-4 sm:py-5 bg-transparent border-0 border-b border-white/40 focus:border-white focus:outline-none text-white text-sm sm:text-base font-normal tracking-wide transition-colors duration-500 placeholder-transparent peer"
                      placeholder="Email"
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-0 top-4 sm:top-5 text-sm sm:text-base font-medium tracking-wide text-white/70 pointer-events-none transition-all duration-300 transform-gpu peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:translate-y-[-28px] peer-focus:scale-75 peer-focus:text-white peer-valid:translate-y-[-28px] peer-valid:scale-75 peer-valid:text-white origin-left"
                    >
                      Email
                    </label>
                  </motion.div>

                  {/* Message Field */}
                  <motion.div className="relative" variants={itemVariants}>
                    <textarea
                      name="message"
                      id="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-0 py-4 sm:py-5 bg-transparent border-0 border-b border-white/40 focus:border-white focus:outline-none text-white text-sm sm:text-base font-normal tracking-wide transition-colors duration-500 resize-none placeholder-transparent peer"
                      placeholder="Message"
                    />
                    <label
                      htmlFor="message"
                      className="absolute left-0 top-4 sm:top-5 text-sm sm:text-base font-medium tracking-wide text-white/70 pointer-events-none transition-all duration-300 transform-gpu peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:translate-y-[-28px] peer-focus:scale-75 peer-focus:text-white peer-valid:translate-y-[-28px] peer-valid:scale-75 peer-valid:text-white origin-left"
                    >
                      Message
                    </label>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div 
                    className="flex justify-center pt-8 sm:pt-12"
                    variants={itemVariants}
                  >
                    <FlipCtaButton
                      text={isSubmitting ? "Wait..." : "Submit"}
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    />
                  </motion.div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Popup */}
          <AnimatePresence>
            {popup.show && popup.type === 'success' && (
              <motion.div 
                className="fixed inset-0 flex items-center justify-center z-50 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="bg-white p-6 sm:p-8 rounded-lg text-center max-w-sm w-full shadow-2xl"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center rounded-full border-2 border-green-500">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-gray-800 text-lg font-bold mb-6 leading-relaxed">
                    Thank you!<br />
                    Your message<br />
                    has been received!
                  </div>
                  <button
                    onClick={closePopup}
                    className="group relative inline-block text-black hover:text-white transition-colors duration-300 cursor-pointer px-6 py-2 border border-red-500 hover:bg-red-500"
                  >
                    <span className="relative z-10 uppercase tracking-wider text-sm font-medium">Close</span>
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Popup */}
          <AnimatePresence>
            {popup.show && popup.type === 'error' && (
              <motion.div 
                className="fixed inset-0 flex items-center justify-center z-50 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="bg-white p-6 sm:p-8 rounded-lg text-center max-w-sm w-full shadow-2xl"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center rounded-full border-2 border-red-500">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="text-gray-800 text-lg font-bold mb-6">
                    Oops! Something went wrong.<br />
                    Please try again.
                  </div>
                  <button
                    onClick={closePopup}
                    className="group relative inline-block text-black hover:text-white transition-colors duration-300 cursor-pointer px-6 py-2 border border-red-500 hover:bg-red-500"
                  >
                    <span className="relative z-10 uppercase tracking-wider text-sm font-medium">Close</span>
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;