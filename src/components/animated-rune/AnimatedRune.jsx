import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AnimatedRune.css';

const AnimatedRune = ({ onComplete }) => {
  const [animationStage, setAnimationStage] = useState('initial');
  const [text, setText] = useState('');
  const fullText = "You have entered SkyAnime… the forbidden archive of legends.";
  
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setAnimationStage('text');
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < fullText.length) {
          setText(fullText.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => {
            setAnimationStage('burst');
            setTimeout(() => {
              setAnimationStage('complete');
              onComplete();
            }, 1000);
          }, 500);
        }
      }, 60);  // Slightly slower typing speed for smoother animation
    }, 1000);

    return () => {
      clearTimeout(timer1);
    };
  }, [onComplete]);

  if (animationStage === 'complete') return null;

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: animationStage === 'burst' ? 0 : 1 }}
      transition={{ duration: 1 }}
    >
      <div className="relative flex flex-col items-center justify-center">
        
        {/* Rune Circle with advanced burst animation */}
        <motion.div 
          className={`rune-circle ${animationStage === 'initial' ? 'scale-0 opacity-0' : 'scale-100 opacity-100'} ${animationStage === 'burst' ? 'scale-150 opacity-0 pulse-glow' : ''}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: animationStage === 'burst' ? 1.5 : animationStage === 'initial' ? 0 : 1,
            opacity: animationStage === 'burst' ? 0 : animationStage === 'initial' ? 0 : 1
          }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 rounded-full bg-infernal-black overflow-hidden">
            <div className="absolute inset-0 pentagram-bg slow-spin opacity-80"></div>
            <div className="absolute inset-2 rounded-full border border-infernal-crimson-30 slow-spin-reverse"></div>
            <div className="absolute inset-4 rounded-full border border-infernal-crimson-20"></div>
            {/* Light Pulse and Glowing Aura */}
            <div className="absolute inset-0 bg-infernal-crimson-10 pulse-glow"></div>
          </div>
        </motion.div>
        
        {/* Text Reveal with Enhanced Animation */}
        <div className="mt-8 text-center max-w-md">
          <p className="text-white-90 font-ritual text-xl tracking-wide">
            <span className="text-gradient">{text}</span>
            <span className="cursor-animated"></span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AnimatedRune; 