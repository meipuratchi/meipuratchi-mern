import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AppPreloader.css';

export default function AppPreloader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const steps = [20, 45, 70, 90, 100];
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setVisible(false), 400);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="app-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Background orbs */}
          <div className="preloader-orb orb-1" />
          <div className="preloader-orb orb-2" />
          <div className="preloader-orb orb-3" />

          <div className="preloader-content">
            {/* Logo */}
            <motion.div
              className="preloader-logo"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src="/mei_logo.png" alt="Meipuratchi" />
            </motion.div>

            {/* Title */}
            <motion.h1
              className="preloader-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              மெய் புரட்சி
            </motion.h1>

            <motion.p
              className="preloader-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Student Career Guidance
            </motion.p>

            {/* Progress bar */}
            <motion.div
              className="preloader-bar-wrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="preloader-bar">
                <motion.div
                  className="preloader-bar-fill"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>
              <span className="preloader-pct">{progress}%</span>
            </motion.div>

            {/* Dots */}
            <div className="preloader-dots">
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i}
                  className="preloader-dot"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
