const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl =
  process.env.SUPABASE_URL || "https://xkhhilqskmxxemmcrnmg.supabase.co";
const supabaseKey =
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhraGhpbHFza214eGVtbWNybm1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwMjUyNjAsImV4cCI6MjA4MDYwMTI2MH0.xMEI9YPWvtjfIVYM9ImMW6HeZEBsOZ70ef5nQHsOhfg";
const supabase = createClient(supabaseUrl, supabaseKey);

app.post("/signup", async (req, res) => {
  try {
    const { first_name, last_name, gmail, password, confirm_password } =
      req.body;

    // Validate input
    if (!first_name || !last_name || !gmail || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash the password (using 'password' from req.body, not 'Password')
    const hash = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    // Insert into Supabase with correct field names
    const { data, error } = await supabase
      .from("login")
      .insert([
        {
          first_name,
          last_name,
          gmail,
          password: hash,
        },
      ])
      .select();

    if (error) {
      console.error("Signup Error:", error);
      return res
        .status(500)
        .json({ message: "Signup failed", error: error.message });
    }

    return res
      .status(200)
      .json({ message: "User registered successfully", data });
  } catch (err) {
    console.error("Signup Error:", err);
    return res
      .status(500)
      .json({ message: "Signup failed", error: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { gmail: inputEmail, password: inputPassword } = req.body;

    // Validate input
    if (!inputEmail || !inputPassword) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    console.log("Login attempt:", inputEmail);

    // Query Supabase using 'gmail' field
    const { data, error } = await supabase
      .from("login")
      .select("*")
      .eq("gmail", inputEmail)
      .single();

    if (error || !data) {
      console.error("Login Error:", error);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("User found:", data.first_name, data.last_name);

    // Compare password
    const result = await bcrypt.compare(inputPassword, data.password);

    if (result) {
      return res.status(200).json({
        message: "Login successfully",
        user: {
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          gmail: data.gmail,
        },
      });
    }

    return res.status(401).json({ message: "Invalid email or password" });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({
      message: "Login failed due to server error",
      error: err.message,
    });
  }
});

app.listen(8081, () => {
  console.log("Server listening on port 8081");
});
