'use client';

import { motion } from 'framer-motion';

type TextRevealProps = {
  text: string;
  delay?: number;
  duration?: number;
};

const TextReveal = ({ text, delay = 0.2, duration = 0.5 }: TextRevealProps) => {
  const lines = text.split('\n');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: delay,
      },
    },
  };

  const lineVariants = {
    hidden: { x: '-100%' },
    visible: {
      x: '0%',
      transition: {
        duration,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className="overflow-hidden w-fit"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {lines.map((lineText, index) => (
        <div key={index} className="overflow-hidden">
          <motion.p
            className="text-xl leading-relaxed text-white uppercase font-bold"
            variants={lineVariants}
          >
            {lineText}
          </motion.p>
        </div>
      ))}
    </motion.div>
  );
};

export default TextReveal;
