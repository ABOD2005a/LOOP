import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Pedit.css";

function Pedit() {
  const [values, setValues] = useState({
    Patient_id: "",
    name: "",
    drugs: "",
    blood_type: "",
    bill: "",
    insurance: "",
  });
  const { ID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8081/patient/${ID}`)
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
        navigate("/Patient");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container">
      <form onSubmit={handleEdit} className="form-box">
        <h2 className="title">Edit Patient</h2>
        <div className="form-group">
          <label>Patient ID</label>
          <input
            type="number"
            placeholder="Enter Patient ID"
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
          <label>blood type </label>
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
          <label>bill </label>
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
          Edit
        </button>
      </form>
    </div>
  );
}

export default Pedit;
