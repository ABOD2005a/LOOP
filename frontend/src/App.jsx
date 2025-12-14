import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import SignUp from "./components/Login_Signup/signup/page";
import Navbar from "./components/Header_Footer/Navbar/page";
import Footer from "./components/Header_Footer/Footer/page";
import Login from "./components/Login_Signup/login/page";
import Home from "./components/page";
import NavbarAfter from "./components/Header_Footer/NavbarAfter/page";
import Choose from "./components/choose/page";
<<<<<<< HEAD
import Booking from "./components/booking/page";
import Address from "./components/Login_Signup/signup/address/page";
=======
import Contact from "./components/information/contact/page";
import About from "./components/information/about/page";

>>>>>>> f98df771eb12b15bd61b92bcd021f8896eee6ec6

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/Navbar" element={<Navbar />} />
        <Route path="/Footer" element={<Footer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/choose" element={<Choose />} />
        <Route path="/address" element={<Address />} />
        <Route path="/NavbarAfter" element={<NavbarAfter />} />
<<<<<<< HEAD
        <Route path="/booking" element={<Booking />} />
=======
        <Route path="/contact" element={<Contact />} />
        <Route path="/About" element={<About />} />
>>>>>>> f98df771eb12b15bd61b92bcd021f8896eee6ec6
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
