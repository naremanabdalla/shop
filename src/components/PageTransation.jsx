import React from "react";
import { motion } from "framer-motion";
const PageTransation = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: window.scrollY == 30 ? 1 : 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransation;
