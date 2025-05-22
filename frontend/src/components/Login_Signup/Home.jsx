/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/Doctor");
  };

  const handleSubmit1 = (e) => {
    e.preventDefault();
    navigate("/Patient");
  };

  const handleSubmit2 = (e) => {
    e.preventDefault();
    navigate("/Nurse");
  };

  return (
    <motion.div
      className="button-container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <button type="submit" onClick={handleSubmit}>
        Doctor
      </button>
      <button type="submit" onClick={handleSubmit1}>
        Patient
      </button>
      <button type="submit" onClick={handleSubmit2}>
        Nurse
      </button>
    </motion.div>
  );
}

export default Home;
