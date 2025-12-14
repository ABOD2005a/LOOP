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

// SIGNUP ENDPOINT
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(gmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("login")
      .select("gmail")
      .eq("gmail", gmail)
      .maybeSingle();

    if (checkError) {
      return res
        .status(500)
        .json({ message: "Error checking email availability" });
    }

    if (existingUser) {
      return res.status(409).json({
        message: "This email is already registered. Please login instead.",
      });
    }

    // Hash the password
    const hash = await bcrypt.hash(password, 10);

    // Insert into Supabase
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
      // Handle duplicate key error as backup
      if (error.code === "23505") {
        return res.status(409).json({
          message: "This email is already registered. Please login instead.",
        });
      }

      return res
        .status(500)
        .json({ message: "Signup failed", error: error.message });
    }

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: data[0].id,
        first_name: data[0].first_name,
        last_name: data[0].last_name,
        gmail: data[0].gmail,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Signup failed", error: err.message });
  }
});

// LOGIN ENDPOINT
app.post("/login", async (req, res) => {
  try {
    const { gmail: inputEmail, password: inputPassword } = req.body;

    // Validate input
    if (!inputEmail || !inputPassword) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Query Supabase using 'gmail' field
    const { data, error } = await supabase
      .from("login")
      .select("*")
      .eq("gmail", inputEmail)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ message: "Server error during login" });
    }

    if (!data) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

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
    return res.status(500).json({
      message: "Login failed due to server error",
      error: err.message,
    });
  }
});

// GET ADDRESS ENDPOINT - Fetch user's address
app.get("/address/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userIdInt = parseInt(user_id);

    if (isNaN(userIdInt)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Fetch address from Supabase
    const { data, error } = await supabase
      .from("address")
      .select("*")
      .eq("user_id", userIdInt)
      .maybeSingle();

    if (error) {
      console.error("Supabase error:", error);
      return res
        .status(500)
        .json({ message: "Failed to fetch address", error: error.message });
    }

    if (!data) {
      return res.status(404).json({
        message: "No address found for this user",
        hasAddress: false,
      });
    }

    return res.status(200).json({
      message: "Address fetched successfully",
      hasAddress: true,
      address: data,
    });
  } catch (err) {
    console.error("Server error:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch address", error: err.message });
  }
});

// POST ADDRESS ENDPOINT - Create new address
app.post("/address", async (req, res) => {
  try {
    const { user_id, governorate, city, building_number, floor, apartment } =
      req.body;

    // Validate input
    if (!user_id) {
      return res
        .status(400)
        .json({ message: "User ID is required. Please login first." });
    }
    if (!governorate) {
      return res.status(400).json({ message: "Governorate is required" });
    }
    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }
    if (!building_number) {
      return res.status(400).json({ message: "Building number is required" });
    }
    if (floor === undefined || floor === null || floor === "") {
      return res.status(400).json({ message: "Floor is required" });
    }
    if (apartment === undefined || apartment === null || apartment === "") {
      return res.status(400).json({ message: "Apartment is required" });
    }

    // Convert floor and apartment to integers
    const floorInt = parseInt(floor);
    const apartmentInt = parseInt(apartment);

    // Validate that floor and apartment are valid numbers
    if (isNaN(floorInt)) {
      return res.status(400).json({ message: "Floor must be a valid number" });
    }
    if (isNaN(apartmentInt)) {
      return res
        .status(400)
        .json({ message: "Apartment must be a valid number" });
    }

    const userIdInt = parseInt(user_id);

    if (isNaN(userIdInt)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Check if address already exists for this user
    const { data: existingAddress } = await supabase
      .from("address")
      .select("*")
      .eq("user_id", userIdInt)
      .maybeSingle();

    if (existingAddress) {
      // Update existing address
      const { data, error } = await supabase
        .from("address")
        .update({
          governorate: governorate,
          city: city,
          building_number: building_number,
          floor: floorInt,
          apartment: apartmentInt,
        })
        .eq("user_id", userIdInt)
        .select();

      if (error) {
        return res
          .status(500)
          .json({ message: "Failed to update address", error: error.message });
      }

      return res
        .status(200)
        .json({ message: "Address updated successfully", data });
    } else {
      // Insert new address
      const { data, error } = await supabase
        .from("address")
        .insert([
          {
            user_id: userIdInt,
            governorate: governorate,
            city: city,
            building_number: building_number,
            floor: floorInt,
            apartment: apartmentInt,
          },
        ])
        .select();

      if (error) {
        return res
          .status(500)
          .json({ message: "Failed to save address", error: error.message });
      }

      return res
        .status(201)
        .json({ message: "Address saved successfully", data });
    }
  } catch (err) {
    console.error("Server error:", err);
    return res
      .status(500)
      .json({ message: "Address save failed", error: err.message });
  }
});

// PUT ADDRESS ENDPOINT - Update existing address
app.put("/address/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { governorate, city, building_number, floor, apartment } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userIdInt = parseInt(user_id);

    if (isNaN(userIdInt)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Validate input
    if (
      !governorate ||
      !city ||
      !building_number ||
      floor === undefined ||
      apartment === undefined
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const floorInt = parseInt(floor);
    const apartmentInt = parseInt(apartment);

    if (isNaN(floorInt) || isNaN(apartmentInt)) {
      return res
        .status(400)
        .json({ message: "Floor and apartment must be valid numbers" });
    }

    // Update address
    const { data, error } = await supabase
      .from("address")
      .update({
        governorate: governorate,
        city: city,
        building_number: building_number,
        floor: floorInt,
        apartment: apartmentInt,
      })
      .eq("user_id", userIdInt)
      .select();

    if (error) {
      return res
        .status(500)
        .json({ message: "Failed to update address", error: error.message });
    }

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ message: "Address not found for this user" });
    }

    return res
      .status(200)
      .json({ message: "Address updated successfully", data });
  } catch (err) {
    console.error("Server error:", err);
    return res
      .status(500)
      .json({ message: "Address update failed", error: err.message });
  }
});

// DELETE ADDRESS ENDPOINT - Delete user's address
app.delete("/address/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userIdInt = parseInt(user_id);

    if (isNaN(userIdInt)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const { data, error } = await supabase
      .from("address")
      .delete()
      .eq("user_id", userIdInt)
      .select();

    if (error) {
      return res
        .status(500)
        .json({ message: "Failed to delete address", error: error.message });
    }

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ message: "Address not found for this user" });
    }

    return res.status(200).json({ message: "Address deleted successfully" });
  } catch (err) {
    console.error("Server error:", err);
    return res
      .status(500)
      .json({ message: "Address deletion failed", error: err.message });
  }
});

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running",
    endpoints: {
      signup: "POST /signup",
      login: "POST /login",
      getAddress: "GET /address/:user_id",
      createAddress: "POST /address",
      updateAddress: "PUT /address/:user_id",
      deleteAddress: "DELETE /address/:user_id",
    },
  });
});

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
