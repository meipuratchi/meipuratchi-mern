import { motion } from 'framer-motion';
import './LoadingSpinner.css';

export default function LoadingSpinner({ size = 'medium', fullScreen = false }) {
  const sizeMap = {
    small: 30,
    medium: 50,
    large: 70
  };

  const spinnerSize = sizeMap[size] || sizeMap.medium;

  const spinner = (
    <motion.div 
      className="loading-spinner"
      style={{ width: spinnerSize, height: spinnerSize }}
    >
      <motion.div
        className="spinner-ring"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="spinner-ring spinner-ring-2"
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );

  if (fullScreen) {
    return (
      <motion.div 
        className="loading-fullscreen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {spinner}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Loading...
        </motion.p>
      </motion.div>
    );
  }

  return spinner;
}
