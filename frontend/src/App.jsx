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
import Home from "./components/elements/Home";
import Doctor from "./components/elements/Doctor/Doctor";
import Dcreate from "./components/elements/Doctor/Dcreate";
import Dedit from "./components/elements/Doctor/Dedit";
import Patient from "./components/elements/Patient/Patient";
import Nurse from "./components/elements/Nurse/Nurse";
import Pedit from "./components/elements/Patient/Pedit";
import Pcreate from "./components/elements/Patient/Pcreate";
import Nedit from "./components/elements/Nurse/Nedit";
import Ncreate from "./components/elements/Nurse/Ncreate";


function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Doctor" element={<Doctor />} />
        <Route path="/Dcreate" element={<Dcreate />} />
        <Route path="/Dedit/:ID" element={<Dedit />} />
        <Route path="/Patient" element={<Patient />} />
        <Route path="Pedit/:ID" element={<Pedit />} />
        <Route path="/Pcreate" element={<Pcreate />} />
        <Route path="/Nurse" element={<Nurse />} />
        <Route path="Nedit/:ID" element={<Nedit />} />
        <Route path="/Ncreate" element={<Ncreate />} />
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
