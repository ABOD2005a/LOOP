const express = require("express");
const bcrypt = require("bcryptjs");
const { supabase, supabaseAdmin } = require("../config/supabase");
const { validateEmail, handleError } = require("../utils/validation");

const router = express.Router();

router.post("/collector/signup", async (req, res) => {
  try {
    const { gmail, password, confirm_password } = req.body;

    console.log("Collector signup attempt:", { gmail });

    if (!gmail || !password) {
      return handleError(res, 400, "All fields are required");
    }

    if (password !== confirm_password) {
      return handleError(res, 400, "Passwords do not match");
    }

    if (!validateEmail(gmail)) {
      return handleError(res, 400, "Invalid email format");
    }

    const { data: existingCollector } = await supabase
      .from("collector")
      .select("collector_gmail")
      .eq("collector_gmail", gmail)
      .maybeSingle();

    if (existingCollector) {
      return handleError(
        res,
        409,
        "This email is already registered as a collector."
      );
    }

    const hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabaseAdmin
      .from("collector")
      .insert([{ collector_gmail: gmail, collector_password: hash }])
      .select();

    if (error) {
      console.error("Collector signup error:", error);
      return handleError(res, 500, "Collector signup failed", error);
    }

    console.log("Collector signup successful:", data[0]);

    return res.status(201).json({
      message: "Collector registered successfully",
      collector: {
        id: data[0].collector_id,
        gmail: data[0].collector_gmail,
      },
    });
  } catch (err) {
    console.error("Collector signup exception:", err);
    return handleError(res, 500, "Collector signup failed", err);
  }
});

// ==================== COLLECTOR LOGIN (PLAIN TEXT PASSWORD) ====================
router.post("/collector", async (req, res) => {
  try {
    const { gmail, password } = req.body;

    console.log("=== COLLECTOR LOGIN START ===");
    console.log("Received body:", req.body);
    console.log("Collector login attempt for:", gmail);

    if (!gmail || !password) {
      console.log("Missing gmail or password");
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    console.log("Querying database for collector...");
    
    // Use supabaseAdmin to bypass RLS
    const { data: allCollectors } = await supabaseAdmin
      .from("collector")
      .select("collector_gmail");
    
    console.log("All collectors in database:", allCollectors);
    console.log("Looking for email:", gmail);
    
    const { data, error } = await supabaseAdmin
      .from("collector")
      .select("*")
      .eq("collector_gmail", gmail)
      .maybeSingle();

    if (error) {
      console.error("Database query error:", error);
      return res.status(500).json({
        success: false,
        message: "Database error",
        error: error.message
      });
    }

    if (!data) {
      console.log("No collector found with email:", gmail);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    console.log("Collector found:", {
      id: data.collector_id,
      gmail: data.collector_gmail,
      hasPassword: !!data.collector_password
    });

    console.log("Verifying password...");
    console.log("Received password:", password);
    console.log("Stored password:", data.collector_password);

    // PLAIN TEXT PASSWORD COMPARISON
    const isPasswordCorrect = password === data.collector_password;

    console.log("Password match:", isPasswordCorrect);

    if (isPasswordCorrect) {
      console.log("✓ Password verified, login successful");
      return res.status(200).json({
        success: true,
        message: "Collector login successful",
        collector: {
          id: data.collector_id,
          gmail: data.collector_gmail,
        },
      });
    }

    console.log("✗ Password verification failed");
    return res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });
  } catch (err) {
    console.error("=== COLLECTOR LOGIN ERROR ===");
    console.error("Exception:", err);
    console.error("Stack:", err.stack);
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: err.message
    });
  }
});

// ==================== GET COLLECTOR ====================
router.get("/collector/:collector_id", async (req, res) => {
  try {
    const { collector_id } = req.params;
    const collectorIdInt = parseInt(collector_id);

    if (isNaN(collectorIdInt)) {
      return handleError(res, 400, "Invalid collector ID format");
    }

    const { data, error } = await supabase
      .from("collector")
      .select("collector_id, collector_gmail, created_at")
      .eq("collector_id", collectorIdInt)
      .maybeSingle();

    if (error || !data) {
      return handleError(res, 404, "Collector not found");
    }

    return res.status(200).json({
      message: "Collector fetched successfully",
      collector: data,
    });
  } catch (err) {
    return handleError(res, 500, "Failed to fetch collector", err);
  }
});

// ==================== UPDATE COLLECTOR PASSWORD ====================
router.put("/collector/:collector_id/password", async (req, res) => {
  try {
    const { collector_id } = req.params;
    const { current_password, new_password } = req.body;
    const collectorIdInt = parseInt(collector_id);

    if (isNaN(collectorIdInt)) {
      return handleError(res, 400, "Invalid collector ID format");
    }

    if (!current_password || !new_password) {
      return handleError(
        res,
        400,
        "Current and new password are required"
      );
    }

    const { data: collector, error: fetchError } = await supabase
      .from("collector")
      .select("*")
      .eq("collector_id", collectorIdInt)
      .maybeSingle();

    if (fetchError || !collector) {
      return handleError(res, 404, "Collector not found");
    }

    const isValid = await bcrypt.compare(
      current_password,
      collector.collector_password
    );

    if (!isValid) {
      return handleError(res, 401, "Current password is incorrect");
    }

    const hash = await bcrypt.hash(new_password, 10);

    const { data, error } = await supabaseAdmin
      .from("collector")
      .update({ collector_password: hash })
      .eq("collector_id", collectorIdInt)
      .select("collector_id, collector_gmail");

    if (error) {
      return handleError(res, 500, "Failed to update password", error);
    }

    return res.status(200).json({
      message: "Password updated successfully",
      collector: data[0],
    });
  } catch (err) {
    return handleError(res, 500, "Password update failed", err);
  }
});

// ==================== DELETE COLLECTOR ====================
router.delete("/collector/:collector_id", async (req, res) => {
  try {
    const { collector_id } = req.params;
    const collectorIdInt = parseInt(collector_id);

    if (isNaN(collectorIdInt)) {
      return handleError(res, 400, "Invalid collector ID format");
    }

    const { data, error } = await supabaseAdmin
      .from("collector")
      .delete()
      .eq("collector_id", collectorIdInt)
      .select();

    if (error) {
      return handleError(res, 500, "Failed to delete collector", error);
    }

    return res.status(200).json({ message: "Collector deleted successfully" });
  } catch (err) {
    return handleError(res, 500, "Collector deletion failed", err);
  }
});

module.exports = router;