import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Dedit.css";

function Dedit() {
  const [values, setValues] = useState({
    Doctor_id: "",
    name: "", 
    Patient_name: "",
    degree: "",
    department: "",
    phone_number: "",
  });
  const { ID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8081/doctor/${ID}`)
      .then((res) => setValues(res.data))
      .catch((err) => console.log(err));
  }, [ID]);

  const handleEdit = (event) => {
    event.preventDefault();
    axios
      .put("http://localhost:8081/update/" + ID, values)
      .then((res) => {
        console.log(res.data);
        setValues(res.data)
        navigate("/Doctor");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container">
      <form onSubmit={handleEdit} className="form-box">
        <h2 className="title">Edit Doctor</h2>
        <div className="form-group">
          <label>Doctor ID</label>
          <input
            type="text"
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
          <label>Patient name</label>
          <input
            type="text"
            placeholder="Enter Patient_name"
            value={values.Patient_name}
            onChange={(e) =>
              setValues({ ...values, Patient_name: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>degree </label>
          <input
            type="text"
            placeholder="Enter degree	"
            value={values.degree}
            onChange={(e) => setValues({ ...values, degree: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>department </label>
          <input
            type="text"
            placeholder="Enter department	"
            value={values.department}
            onChange={(e) =>
              setValues({ ...values, department: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label>phone_number</label>
          <input
            type="number"
            placeholder="Enter phone_number"
            value={values.phone_number}
            onChange={(e) =>
              setValues({ ...values, phone_number: e.target.value })
            }
          />
        </div>
        <button type="submit" className="submit-btn">
          Edit
        </button>
      </form>
    </div>
  );
}

export default Dedit;
