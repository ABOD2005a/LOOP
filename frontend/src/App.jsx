import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Signup from "./components/Login_Signup/Signup";
import Login from "./components/Login_Signup/Login";
import { AnimatePresence } from "framer-motion";
import Home from "./components/Login_Signup/Home";
import Doctor from "./components/elements/Doctor";
import Patient from "./components/elements/Patient";
import Nurse from "./components/elements/Nurse";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Doctor" element={<Doctor />} />
        <Route path="/Patient" element={<Patient />} />
        <Route path="/Nurse" element={<Nurse />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
