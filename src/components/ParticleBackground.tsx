/* eslint-disable react-hooks/purity, @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const ParticleBackground: React.FC = () => {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * -20,
      opacity: Math.random() * 0.5 + 0.1,
      xDest: (Math.random() - 0.5) * 20
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-brand-black">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-brand-white rounded-full mix-blend-screen"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
          }}
          animate={{
            y: ['0vh', '-100vh'],
            x: ['0vw', `${p.xDest}vw`],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: p.delay,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-black/50 to-brand-black pointer-events-none" />
    </div>
  );
};
