/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./Doctor.css";
import axios from "axios";
import { degrees, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Dcreate() {
  const [values, setValues] = useState({
    Doctor_id: "",
    name: "",
    Patient_name: "",
    degree: "",
    department: "",
    phone_number: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8081/Doctor", values)
      .then((res) => {
        console.log(res);
        navigate("/Doctor");
        setValues({
          Doctor_id: "",
          name: "",
          Patient_name: "",
          degree: "",
          department: "",
          phone_number: "",
        });
      })
      .catch((err) => console.error("Error:", err));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="container"
    >
      <div className="form-box">
        <form onSubmit={handleSubmit}>
          <h2 className="title">Add Doctor</h2>

          <div className="form-group">
            <label>Doctor ID</label>
            <input
              type="number"
              placeholder="Enter Doctor ID"
              value={values.Doctor_id}
              onChange={(e) =>
                setValues({ ...values, Doctor_id: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter name"
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Patient Name</label>
            <input
              type="text"
              placeholder="Enter patient name"
              value={values.Patient_name}
              onChange={(e) =>
                setValues({ ...values, Patient_name: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>degree</label>
            <input
              type="text"
              placeholder="Enter degree"
              value={values.degree}
              onChange={(e) => setValues({ ...values, degree: e.target.value })}
            />
          </div>
          
          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              placeholder="Enter department"
              value={values.department}
              onChange={(e) =>
                setValues({ ...values, department: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>phone number</label>
            <input
              type="number"
              placeholder="Enter Phone number"
              value={values.phone_number}
              onChange={(e) =>
                setValues({ ...values, phone_number: e.target.value })
              }
            />
          </div>

          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </div>
    </motion.div>
  );
}

export default Dcreate;
