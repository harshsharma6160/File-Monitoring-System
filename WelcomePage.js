import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./WelcomePage.css";

const WelcomePage = () => {
  return (
    <motion.div
      className="welcome-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h1 className="welcome-title">Welcome to File Monitoring System</h1>
      <p className="welcome-subtitle">Monitor your files and directories with ease!</p>
      <Link to="/monitoring">
        <motion.button
          className="start-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Get Started
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default WelcomePage;

