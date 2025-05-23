/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Patient.css";
import { motion } from "framer-motion";

function Patient() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8081/patient")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (ID) => {
    axios
      .delete(`http://localhost:8081/patient/${ID}`)
      .then(() => {
        setData(data.filter((patient) => patient.ID !== ID));
      })
      .catch((err) => console.log(err));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="patient-container"
    >
      <div className="patient-card">
        <h2 className="patient-title">Patient List</h2>
        <div className="patient-actions">
          <Link to="/Pcreate" className="btn create-btn">
            Create +
          </Link>
        </div>
        <table className="patient-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Drugs</th>
              <th>Blood Type</th>
              <th>Bill</th>
              <th>Insurance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((patient, index) => (
              <tr key={index}>
                <td>{patient.ID}</td>
                <td>{patient.Patient_id}</td>
                <td>{patient.name}</td>
                <td>{patient.drugs}</td>
                <td>{patient.blood_type}</td>
                <td>{patient.bill}</td>
                <td>{patient.insurance}</td>
                <td>
                  <Link to={`/Pedit/${patient.ID}`} className="btn edit-btn">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(patient.ID)}
                    className="btn delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default Patient;
