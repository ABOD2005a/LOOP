/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./nurse.css";
import { motion } from "framer-motion";

function Nurse() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8081/nurse")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (ID) => {
    axios
      .delete(`http://localhost:8081/nurse/${ID}`)
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
      className="nurse-container"
    >
      <div className="nurse-card">
        <h2 className="nurse-title">Nurse List</h2>
        <div className="nurse-actions">
          <Link to="/Ncreate" className="btn create-btn">
            Create +
          </Link>
        </div>
        <table className="nurse-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>nurse ID</th>
              <th>Name</th>
              <th>ward</th>
              <th>Room</th>
              <th>Patient_name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((nurse, index) => (
              <tr key={index}>
                <td>{nurse.ID}</td>
                <td>{nurse.Nurse_id}</td>
                <td>{nurse.name}</td>
                <td>{nurse.ward}</td>
                <td>{nurse.Room}</td>
                <td>{nurse.Patient_name}</td>
                <td>
                  <Link to={`/Nedit/${nurse.ID}`} className="btn edit-btn">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(nurse.ID)}
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

export default Nurse;
