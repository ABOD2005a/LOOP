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
import Booking from "./components/booking/page";
import Address from "./components/Login_Signup/signup/address/page";
import Contact from "./components/information/contact/page";
import About from "./components/information/about/page";
import HomeAfter from "./components/homeAfter/page";
// import Settings from "./components/profile/settings/page";
// import Bookings from "./components/profile/bookings/page";
// import Profile from "./components/profile/page";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/choose" element={<Choose />} />
        <Route path="/address" element={<Address />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/About" element={<About />} />
        <Route path="/NavbarAfter" element={<NavbarAfter/>} />
        <Route path="/homeAfter" element={<HomeAfter/>} />
        {/* <Route path="/profile" element={< Profile/>}/> */}
        {/* <Route path="/settings" element={<Settings />} /> */}
        {/* <Route path="/bookings" element={<Bookings />} /> */}
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: '1' }}>
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;