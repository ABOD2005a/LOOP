const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  connectionLimit: 10,
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "signup",
});

app.post("/signup", (req, res) => {
  const sql = "INSERT INTO login (Username, Email, Password) VALUES (?, ?, ?)";
  const { Username, Email, Password } = req.body;

  bcrypt.hash(Password, 10, (err, hash) => {
    if (err) throw err;
    console.log(hash);
    db.query(sql, [Username, Email, hash], (err, _) => {
      if (err) {
        console.error("Signup Error:", err);
        return res.status(500).send("Signup failed");
      }

      return res.status(200).send("User registered successfully");
    });
  });
});

app.get("/login", (req, res) => {
  const { Email: inputEmail, Password: inputPassword } = req.query;

  const SQL = "SELECT * FROM login WHERE Email = ?";
  console.log(inputEmail, inputPassword);

  db.query(SQL, [inputEmail], (err, data) => {
    if (err) {
      console.error("Login Error:", err);
      return res.status(500).send("Login failed due to server error");
    }

    console.log(data);
    // data: Payload[]
    if (data.length === 0)
      return res.status(401).send("Invalid email or password");

    const result = bcrypt.compareSync(inputPassword, data[0].Password);
    if (result) {
      return res.status(200).send("login successfully");
    }
    return res.status(401).send("Invalid email or password");
  });
});

app.get("/Doctor", (req, res) => {
  const sql = "SELECT * FROM Doctor";
  db.query(sql, (err, data) => {
    if (err) return res.json("ERROR");
    return res.json(data);
  });
});

app.post("/Doctor", (req, res) => {
  const sql =
    "INSERT INTO Doctor (`Doctor_id`,`name`,`Patient_name`,`degree`,`department`,`phone_number`) VALUES (?, ?, ?, ?,?,?)";
  const values = [
    req.body.Doctor_id,
    req.body.name,
    req.body.Patient_name,
    req.body.degree,
    req.body.department,
    req.body.phone_number,
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.log(err);
      console.log(values);
      return res.status(500).json(err);
    }
    return res.json(result);
  });
});

app.get("/doctor/:ID", (req, res) => {
  const sql = "SELECT * FROM doctor WHERE id = ?";
  db.query(sql, [req.params.ID], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0)
      return res.status(404).json({ message: "Doctor not found" });
    res.json(result[0]);
  });
});

app.put("/Doctor/update/:ID", (req, res) => {
  const sql = `
    UPDATE doctor 
    SET Doctor_id = ?, name = ?, Patient_name = ?, degree = ?, department = ?, phone_number = ?
    WHERE ID = ?
  `;

  const ID = req.params.ID;
  const values = [
    req.body.Doctor_id,
    req.body.name,
    req.body.Patient_name,
    req.body.degree,
    req.body.department,
    req.body.phone_number,
    ID,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error during update:", err);
      return res
        .status(500)
        .json({ message: "Error inside server", error: err });
    }
    return res.json({ message: "Doctor updated successfully", result });
  });
});

app.delete("/doctor/:ID", (req, res) => {
  const sql = "DELETE FROM doctor WHERE ID = ?";
  const ID = req.params.ID;

  db.query(sql, [ID], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Error inside server", error: err });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Doctor not found" });
    return res.json({ message: "Doctor deleted successfully" });
  });
});

/*patient*/
app.get("/patient", (req, res) => {
  const sql = "SELECT * FROM patient";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching patients:", err);
      return res
        .status(500)
        .json({ message: "Error fetching patients", error: err });
    }
    return res.json(result);
  });
});

app.get("/patient/:ID", (req, res) => {
  const sql = "SELECT * FROM patient WHERE ID = ?";
  db.query(sql, [req.params.ID], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0)
      return res.status(404).json({ message: "Patient not found" });
    return res.json(result[0]);
  });
});

app.post("/patient", (req, res) => {
  const sql =
    "INSERT INTO patient (`Patient_id`, `name`, `drugs`, `blood_type`, `bill`, `insurance`) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [
    req.body.Patient_id,
    req.body.name,
    req.body.drugs,
    req.body.blood_type,
    req.body.bill,
    req.body.insurance,
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting patient:", err);
      return res
        .status(500)
        .json({ message: "Failed to insert patient", error: err });
    }
    return res.json({ message: "Patient created successfully", result });
  });
});

app.put("/patient/update/:ID", (req, res) => {
  const sql = `
    UPDATE patient 
    SET Patient_id = ?, name = ?, drugs = ?, blood_type = ?, bill = ?, insurance = ?
    WHERE ID = ?
  `;
  const values = [
    req.body.Patient_id,
    req.body.name,
    req.body.drugs,
    req.body.blood_type,
    req.body.bill,
    req.body.insurance,
    req.params.ID,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error during update:", err);
      return res
        .status(500)
        .json({ message: "Error inside server", error: err });
    }
    return res.json({ message: "Patient updated successfully", result });
  });
});

app.delete("/patient/:ID", (req, res) => {
  const sql = "DELETE FROM patient WHERE ID = ?";
  const ID = req.params.ID;

  db.query(sql, [ID], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error inside server", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }
    return res.json({ message: "Patient deleted successfully" });
  });
});

/*NURSE*/
app.get("/nurse", (req, res) => {
  const sql = "SELECT * FROM nurse";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching nurses:", err);
      return res
        .status(500)
        .json({ message: "Error fetching nurses", error: err });
    }
    return res.json(result);
  });
});

app.get("/nurse/:ID", (req, res) => {
  const sql = "SELECT * FROM nurse WHERE ID = ?";
  db.query(sql, [req.params.ID], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0)
      return res.status(404).json({ message: "Nurse not found" });
    return res.json(result[0]);
  });
});

app.post("/nurse", (req, res) => {
  const sql =
    "INSERT INTO nurse (`Nurse_id`, `name`, `ward`, `Room`, `Patient_name`) VALUES (?, ?, ?, ?, ?)";
  const values = [
    req.body.Nurse_id,
    req.body.name,
    req.body.ward,
    req.body.Room,
    req.body.Patient_name,
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting nurse:", err);
      return res
        .status(500)
        .json({ message: "Failed to insert nurse", error: err });
    }
    return res.json({ message: "Nurse created successfully", result });
  });
});

app.put("/nurse/update/:ID", (req, res) => {
  const sql = `
    UPDATE nurse 
    SET Nurse_id = ?, name = ?, ward = ?, Room = ?, Patient_name = ?
    WHERE ID = ?
  `;
  const values = [
    req.body.Nurse_id,
    req.body.name,
    req.body.ward,
    req.body.Room,
    req.body.Patient_name,
    req.params.ID,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error during update:", err);
      return res
        .status(500)
        .json({ message: "Error inside server", error: err });
    }
    return res.json({ message: "Nurse updated successfully", result });
  });
});

app.delete("/nurse/:ID", (req, res) => {
  const sql = "DELETE FROM nurse WHERE ID = ?";
  const ID = req.params.ID;

  db.query(sql, [ID], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error inside server", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Nurse not found" });
    }
    return res.json({ message: "Nurse deleted successfully" });
  });
});

app.listen(8081, () => {
  console.log("Server listening on port 8081");
});
