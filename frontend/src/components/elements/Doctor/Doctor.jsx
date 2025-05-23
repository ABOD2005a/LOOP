import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Doctor.css"; 
import Dcreate from './Dcreate'

function Doctor() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8081/Doctor")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="doctor-container">
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
              <th>Name</th>
              <th>Patient_name</th>
              <th>Department</th>
              <th>Age</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((doctor, index) => (
              <tr key={index}>
                <td>{doctor.ID}</td>
                <td>{doctor.name}</td>
                <td>{doctor.Patient_name}</td>
                <td>{doctor.department}</td>
                <td>{doctor.age}</td>
                <div className="button">
                  <Link to={`/edit/${doctor.ID}`} className="btn edit-btn">
                    Edit
                  </Link>
                  <button className="btn delete-btn">Delete</button>
                </div>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Doctor;
