const express = require("express");
const bcrypt = require("bcryptjs");
const { supabase, supabaseAdmin } = require("../config/supabase");
const { validateEmail, validateNumericId, handleError } = require("../utils/validation");

const router = express.Router();

// ==================== SIGNUP ====================
router.post("/signup", async (req, res) => {
  try {
    const { first_name, last_name, gmail, password, confirm_password } =
      req.body;

    if (!first_name || !last_name || !gmail || !password) {
      return handleError(res, 400, "All fields are required");
    }

    if (password !== confirm_password) {
      return handleError(res, 400, "Passwords do not match");
    }

    if (!validateEmail(gmail)) {
      return handleError(res, 400, "Invalid email format");
    }

    const { data: existingUser } = await supabase
      .from("login")
      .select("gmail")
      .eq("gmail", gmail)
      .maybeSingle();

    if (existingUser) {
      return handleError(
        res,
        409,
        "This email is already registered. Please login instead."
      );
    }

    const hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("login")
      .insert([{ first_name, last_name, gmail, password: hash }])
      .select();

    if (error) {
      return handleError(res, 500, "Signup failed", error);
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
    return handleError(res, 500, "Signup failed", err);
  }
});

// ==================== LOGIN ====================
router.post("/login", async (req, res) => {
  try {
    const { gmail: inputEmail, password: inputPassword } = req.body;

    if (!inputEmail || !inputPassword) {
      return handleError(res, 400, "Email and password are required");
    }

    const { data, error } = await supabase
      .from("login")
      .select("*")
      .eq("gmail", inputEmail)
      .maybeSingle();

    if (error || !data) {
      return handleError(res, 401, "Invalid email or password");
    }

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

    return handleError(res, 401, "Invalid email or password");
  } catch (err) {
    return handleError(res, 500, "Login failed", err);
  }
});

// ==================== UPDATE USER ====================
router.put("/user/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { first_name, last_name } = req.body;
    const userIdInt = parseInt(user_id);

    if (isNaN(userIdInt)) {
      return handleError(res, 400, "Invalid user ID format");
    }

    if (!first_name || !last_name) {
      return handleError(
        res,
        400,
        "First name and last name are required"
      );
    }

    const { data, error } = await supabaseAdmin
      .from("login")
      .update({ first_name: first_name.trim(), last_name: last_name.trim() })
      .eq("id", userIdInt)
      .select();

    if (error) {
      return handleError(res, 500, "Failed to update user", error);
    }

    return res.status(200).json({
      message: "User name updated successfully",
      user: data[0],
    });
  } catch (err) {
    return handleError(res, 500, "User update failed", err);
  }
});

module.exports = router;
