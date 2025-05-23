import React, { useState } from "react";
import "./Doctor.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dcreate() {
  const [values, setValues] = useState({
    name: "",
    Patient_name: "",
    department: "",
    age: "",
  });

const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8081/Doctor", values)
      .then((res) => {
        console.log(res)
        navigate("/Doctor");
        setValues({ name: "", Patient_name: "", department: "", age: "" });
      })
      .catch((err) => console.error("Error:", err));
  };

  return (
    <div className="container">
      <div className="form-box">
        <form onSubmit={handleSubmit}>
          <h2 className="title">Add Doctor</h2>

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
            <label>Age</label>
            <input
              type="text"
              placeholder="Enter age"
              value={values.age}
              onChange={(e) => setValues({ ...values, age: e.target.value })}
            />
          </div>

          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Dcreate;
