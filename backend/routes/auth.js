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

    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email:', inputEmail);
    console.log('Password length:', inputPassword?.length);

    if (!inputEmail || !inputPassword) {
      return handleError(res, 400, "Email and password are required");
    }

    // First check if it's an admin login
    console.log('Checking admin table...');
    const { data: adminData, error: adminError } = await supabase
      .from("admin")
      .select("*")
      .eq("gmail", inputEmail)
      .maybeSingle();

    console.log('Admin found:', !!adminData);

    if (adminData && !adminError) {
      console.log('Comparing admin password...');
      const isValidPassword = await bcrypt.compare(inputPassword, adminData.password);
      console.log('Admin password valid:', isValidPassword);
      
      if (isValidPassword) {
        // 🆕 Create admin session
        console.log('Creating admin session for user_id:', adminData.id);
        const { data: sessionData, error: sessionError } = await supabase
          .from("user_sessions")
          .insert([{ user_id: adminData.id, is_active: true }])
          .select();
        
        if (sessionError) {
          console.error('❌ Session creation error:', sessionError);
          console.error('Error details:', JSON.stringify(sessionError, null, 2));
        } else {
          console.log('✅ Admin session created:', sessionData);
        }

        console.log('✓ Admin login successful');
        return res.status(200).json({
          message: "Admin login successfully",
          user: {
            id: adminData.id,
            gmail: adminData.gmail,
            isAdmin: true,
          },
        });
      } else {
        console.log('✗ Admin password incorrect');
      }
    }

    // If not admin, check regular user login
    console.log('Checking login table...');
    const { data, error } = await supabase
      .from("login")
      .select("*")
      .eq("gmail", inputEmail)
      .maybeSingle();

    console.log('User found:', !!data);

    if (error || !data) {
      console.log('✗ User not found');
      return handleError(res, 401, "Invalid email or password");
    }

    console.log('Comparing user password...');
    const result = await bcrypt.compare(inputPassword, data.password);
    console.log('User password valid:', result);

    if (result) {
      // 🆕 Create user session
      console.log('Creating user session for user_id:', data.id);
      const { data: sessionData, error: sessionError } = await supabase
        .from("user_sessions")
        .insert([{ user_id: data.id, is_active: true }])
        .select();
      
      if (sessionError) {
        console.error('❌ Session creation error:', sessionError);
        console.error('Error details:', JSON.stringify(sessionError, null, 2));
      } else {
        console.log('✅ User session created:', sessionData);
      }

      console.log('✓ User login successful');
      return res.status(200).json({
        message: "Login successfully",
        user: {
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          gmail: data.gmail,
          isAdmin: false,
        },
      });
    }

    console.log('✗ Password incorrect');
    return handleError(res, 401, "Invalid email or password");
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    return handleError(res, 500, "Login failed", err);
  }
});

// ==================== LOGOUT ====================
router.post("/logout", async (req, res) => {
  try {
    const { user_id } = req.body;

    console.log('=== LOGOUT ATTEMPT ===');
    console.log('User ID:', user_id);

    if (!user_id) {
      return handleError(res, 400, "User ID is required");
    }

    const userIdInt = parseInt(user_id);
    if (isNaN(userIdInt)) {
      return handleError(res, 400, "Invalid user ID format");
    }

    // Update active sessions to inactive
    const { data, error } = await supabase
      .from("user_sessions")
      .update({ 
        is_active: false, 
        logout_time: new Date().toISOString() 
      })
      .eq("user_id", userIdInt)
      .eq("is_active", true)
      .select();

    if (error) {
      console.error('Logout error:', error);
      return handleError(res, 500, "Logout failed", error);
    }

    console.log('✓ Logout successful, sessions closed:', data?.length || 0);

    return res.status(200).json({
      message: "Logout successful",
      sessions_closed: data?.length || 0,
    });
  } catch (err) {
    console.error('LOGOUT ERROR:', err);
    return handleError(res, 500, "Logout failed", err);
  }
});

// ==================== GET ACTIVE USERS ====================
router.get("/users/active", async (req, res) => {
  try {
    console.log('=== FETCHING ACTIVE USERS ===');

    // Get count of unique active users
    const { data, error } = await supabase
      .from("user_sessions")
      .select("user_id")
      .eq("is_active", true);

    if (error) {
      console.error('Active users fetch error:', error);
      return handleError(res, 500, "Failed to fetch active users", error);
    }

    // Count unique user_ids
    const uniqueUsers = new Set(data.map(session => session.user_id));
    const activeUsers = uniqueUsers.size;

    console.log('✓ Active users count:', activeUsers);
    console.log('Total active sessions:', data.length);

    return res.status(200).json({
      activeUsers: activeUsers,
      totalSessions: data.length,
    });
  } catch (err) {
    console.error('ACTIVE USERS ERROR:', err);
    return handleError(res, 500, "Failed to fetch active users", err);
  }
});

// ==================== CLEANUP STALE SESSIONS ====================
router.post("/sessions/cleanup", async (req, res) => {
  try {
    console.log('=== CLEANING UP STALE SESSIONS ===');

    // Calculate 24 hours ago
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    // Close sessions older than 24 hours
    const { data, error } = await supabase
      .from("user_sessions")
      .update({ 
        is_active: false, 
        logout_time: new Date().toISOString() 
      })
      .eq("is_active", true)
      .lt("login_time", twentyFourHoursAgo.toISOString())
      .select();

    if (error) {
      console.error('Cleanup error:', error);
      return handleError(res, 500, "Cleanup failed", error);
    }

    console.log('✓ Cleaned up sessions:', data?.length || 0);

    return res.status(200).json({
      message: "Stale sessions cleaned up",
      sessions_closed: data?.length || 0,
    });
  } catch (err) {
    console.error('CLEANUP ERROR:', err);
    return handleError(res, 500, "Cleanup failed", err);
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