import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Nedit.css";

function Nedit() {
  const [values, setValues] = useState({
    Nurse_id: "",
    name: "",
    ward: "",
    Room: "",
    Patient_name: "",
  });
  const { ID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8081/nurse/${ID}`)
      .then((res) => setValues(res.data))
      .catch((err) => console.log(err));
  }, [ID]);

  const handleEdit = (event) => {
    event.preventDefault();
    axios
      .put("http://localhost:8081/update/" + ID, values)
      .then((res) => {
        console.log(res.data);
        setValues(res.data);
        navigate("/Nurse");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container">
      <form onSubmit={handleEdit} className="form-box">
        <h2 className="title">Edit Nurse</h2>
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
          <label>Patient name</label>
          <input
            type="text"
            placeholder="Enter Patient name"
            value={values.Patient_name}
            onChange={(e) => setValues({ ...values, Patient_name: e.target.value })}
          />
        </div>
        <button type="submit" className="submit-btn">
          Edit
        </button>
      </form>
    </div>
  );
}

export default Nedit;
