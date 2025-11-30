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
    if (data.length === 0)
      return res.status(401).send("Invalid email or password");

    const result = bcrypt.compareSync(inputPassword, data[0].Password);
    if (result) {
      return res.status(200).send("login successfully");
    }
    return res.status(401).send("Invalid email or password");
  });
});

app.listen(8081, () => {
  console.log("Server listening on port 8081");
});
