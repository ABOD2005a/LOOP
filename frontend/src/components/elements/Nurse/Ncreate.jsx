/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./Nurse.css";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Ncreate() {
  const [values, setValues] = useState({
    Nurse_id: "",
    name: "",
    ward: "",
    Room: "",
    Patient_name: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8081/nurse", values)
      .then((res) => {
        console.log(res);
        navigate("/Nurse");
        setValues({
          Nurse_id: "",
          name: "",
          ward: "",
          Room: "",
          Patient_name: "",
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
          <h2 className="title">Add Nurse</h2>

          <div className="form-group">
            <label>Nurse ID</label>
            <input
              type="number"
              placeholder="Enter Nurse ID"
              value={values.Nurse_id}
              onChange={(e) =>
                setValues({ ...values, Nurse_id: e.target.value })
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
            <label>ward</label>
            <input
              type="text"
              placeholder="Enter ward"
              value={values.ward}
              onChange={(e) => setValues({ ...values, ward: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Room</label>
            <input
              type="number"
              placeholder="Enter Room"
              value={values.Room}
              onChange={(e) =>
                setValues({ ...values, Room: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Patient_name</label>
            <input
              type="text"
              placeholder="Patient name"
              value={values.Patient_name}
              onChange={(e) => setValues({ ...values, Patient_name: e.target.value })}
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

export default Ncreate;
