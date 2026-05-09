import { motion } from 'framer-motion';
import './AnimatedBackground.css';

export default function AnimatedBackground({ variant = 'particles' }) {
  // Reduce particle count on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const particleCount = isMobile ? 15 : 30;

  if (variant === 'particles') {
    return (
      <div className="animated-bg-particles">
        {[...Array(particleCount)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              scale: Math.random() * 0.5 + 0.5,
              opacity: Math.random() * 0.5 + 0.3
            }}
            animate={{
              x: [
                Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)
              ],
              y: [
                Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)
              ],
              scale: [
                Math.random() * 0.5 + 0.5,
                Math.random() * 1 + 0.8,
                Math.random() * 0.5 + 0.5
              ]
            }}
            transition={{
              duration: isMobile ? Math.random() * 15 + 10 : Math.random() * 20 + 15,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'gradient') {
    return (
      <div className="animated-bg-gradient">
        <motion.div
          className="gradient-orb orb-1"
          animate={{
            x: [0, isMobile ? 50 : 100, 0],
            y: [0, isMobile ? 25 : 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: isMobile ? 15 : 20,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="gradient-orb orb-2"
          animate={{
            x: [0, isMobile ? -40 : -80, 0],
            y: [0, isMobile ? 50 : 100, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: isMobile ? 18 : 25,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="gradient-orb orb-3"
          animate={{
            x: [0, isMobile ? 30 : 60, 0],
            y: [0, isMobile ? -35 : -70, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: isMobile ? 13 : 18,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>
    );
  }

  return null;
}
