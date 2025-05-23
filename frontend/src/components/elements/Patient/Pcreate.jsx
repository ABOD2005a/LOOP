/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./patient.css";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Patient from "./Patient";

function Pcreate() {
  const [values, setValues] = useState({
    Patient_id: "",
    name: "",
    drugs: "",
    blood_type: "",
    bill: "",
    insurance: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8081/patient", values)
      .then((res) => {
        console.log(res);
        navigate("/Patient");
        setValues({
          Patient_id: "",
          name: "",
          drugs: "",
          blood_type: "",
          bill: "",
          insurance: "",
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
          <h2 className="title">Add Patient</h2>

          <div className="form-group">
            <label>patient ID</label>
            <input
              type="number"
              placeholder="Enter patient ID"
              value={values.Patient_id}
              onChange={(e) =>
                setValues({ ...values, Patient_id: e.target.value })
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
            <label>drugs</label>
            <input
              type="text"
              placeholder="Enter drugs"
              value={values.drugs}
              onChange={(e) => setValues({ ...values, drugs: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>blood_type</label>
            <input
              type="text"
              placeholder="Enter blood_type"
              value={values.blood_type}
              onChange={(e) =>
                setValues({ ...values, blood_type: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>bill</label>
            <input
              type="number"
              placeholder="Enter bill"
              value={values.bill}
              onChange={(e) => setValues({ ...values, bill: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>insurance</label>
            <input
              type="text"
              placeholder="Enter insurance"
              value={values.insurance}
              onChange={(e) =>
                setValues({ ...values, insurance: e.target.value })
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

export default Pcreate;
