/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Doctor.css";
import { motion } from "framer-motion";

function Doctor() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8081/Doctor")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (ID) => {
    axios
      .delete(`http://localhost:8081/doctor/${ID}`)
      .then(() => {
        setData(data.filter((doctor) => doctor.ID !== ID));
      })
      .catch((err) => console.log(err));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="doctor-container"
    >
      <div className="doctor-card">
        <h2 className="doctor-title">Doctor List</h2>
        <div className="doctor-actions">
          <Link to="/Dcreate" className="btn create-btn">
            Create +
          </Link>
        </div>
        <table className="doctor-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Doctor ID</th>
              <th>name</th>
              <th>Patient_name</th>
              <th>degree</th>
              <th>Department</th>
              <th>phone number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((doctor, index) => (
              <tr key={index}>
                <td>{doctor.ID}</td>
                <td>{doctor.Doctor_id}</td>
                <td>{doctor.name}</td>
                <td>{doctor.Patient_name}</td>
                <td>{doctor.degree}</td>
                <td>{doctor.department}</td>
                <td>{doctor.phone_number}</td>
                <td>
                  <Link to={`/Dedit/${doctor.ID}`} className="btn edit-btn">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(doctor.ID)}
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

export default Doctor;
