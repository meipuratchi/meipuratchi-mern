import { motion } from 'framer-motion';

export default function AnimatedButton({ children, className = '', onClick, ...props }) {
  return (
    <motion.button
      className={className}
      onClick={onClick}
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function AnimatedLink({ children, className = '', to, ...props }) {
  return (
    <motion.a
      href={to}
      className={className}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
      {...props}
    >
      {children}
    </motion.a>
  );
}
