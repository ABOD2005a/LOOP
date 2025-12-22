const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL || "https://xkhhilqskmxxemmcrnmg.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhraGhpbHFza214eGVtbWNybm1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwMjUyNjAsImV4cCI6MjA4MDYwMTI2MH0.xMEI9YPWvtjfIVYM9ImMW6HeZEBsOZ70ef5nQHsOhfg";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhraGhpbHFza214eGVtbWNybm1nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTAyNTI2MCwiZXhwIjoyMDgwNjAxMjYwfQ.tq8yo41bLnHy2662n03kumzIbb2TofGFwgXHBeU1jZU";

const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// ==================== AUTH ENDPOINTS ====================

app.post("/signup", async (req, res) => {
  try {
    const { first_name, last_name, gmail, password, confirm_password } = req.body;

    if (!first_name || !last_name || !gmail || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(gmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const { data: existingUser } = await supabase
      .from("login")
      .select("gmail")
      .eq("gmail", gmail)
      .maybeSingle();

    if (existingUser) {
      return res.status(409).json({
        message: "This email is already registered. Please login instead.",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("login")
      .insert([{ first_name, last_name, gmail, password: hash }])
      .select();

    if (error) {
      return res.status(500).json({ message: "Signup failed", error: error.message });
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
    return res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { gmail: inputEmail, password: inputPassword } = req.body;

    if (!inputEmail || !inputPassword) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const { data, error } = await supabase
      .from("login")
      .select("*")
      .eq("gmail", inputEmail)
      .maybeSingle();

    if (error || !data) {
      return res.status(401).json({ message: "Invalid email or password" });
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

    return res.status(401).json({ message: "Invalid email or password" });
  } catch (err) {
    return res.status(500).json({ message: "Login failed", error: err.message });
  }
});

app.put("/user/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { first_name, last_name } = req.body;
    const userIdInt = parseInt(user_id);

    if (isNaN(userIdInt)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    if (!first_name || !last_name) {
      return res.status(400).json({ message: "First name and last name are required" });
    }

    const { data, error } = await supabaseAdmin
      .from("login")
      .update({ first_name: first_name.trim(), last_name: last_name.trim() })
      .eq("id", userIdInt)
      .select();

    if (error) {
      return res.status(500).json({ message: "Failed to update user", error: error.message });
    }

    return res.status(200).json({
      message: "User name updated successfully",
      user: data[0],
    });
  } catch (err) {
    return res.status(500).json({ message: "User update failed", error: err.message });
  }
});

// ==================== ADDRESS ENDPOINTS ====================

app.get("/address/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const userIdInt = parseInt(user_id);

    if (isNaN(userIdInt)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const { data, error } = await supabase
      .from("address")
      .select("*")
      .eq("user_id", userIdInt)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ message: "Failed to fetch address", error: error.message });
    }

    if (!data) {
      return res.status(404).json({ message: "No address found", hasAddress: false });
    }

    return res.status(200).json({
      message: "Address fetched successfully",
      hasAddress: true,
      address: data,
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch address", error: err.message });
  }
});

app.post("/address", async (req, res) => {
  try {
    const { user_id, governorate, city, building_number, floor, apartment } = req.body;

    if (!user_id || !governorate || !city || !building_number || floor === undefined || apartment === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userIdInt = parseInt(user_id);
    const floorInt = parseInt(floor);
    const apartmentInt = parseInt(apartment);

    if (isNaN(userIdInt) || isNaN(floorInt) || isNaN(apartmentInt)) {
      return res.status(400).json({ message: "Invalid format for numeric fields" });
    }

    const { data: existingAddress } = await supabaseAdmin
      .from("address")
      .select("*")
      .eq("user_id", userIdInt)
      .maybeSingle();

    if (existingAddress) {
      const { data, error } = await supabaseAdmin
        .from("address")
        .update({ governorate, city, building_number, floor: floorInt, apartment: apartmentInt })
        .eq("user_id", userIdInt)
        .select();

      if (error) {
        return res.status(500).json({ message: "Failed to update address", error: error.message });
      }

      return res.status(200).json({ message: "Address updated successfully", data });
    } else {
      const { data, error } = await supabaseAdmin
        .from("address")
        .insert([{ user_id: userIdInt, governorate, city, building_number, floor: floorInt, apartment: apartmentInt }])
        .select();

      if (error) {
        return res.status(500).json({ message: "Failed to save address", error: error.message });
      }

      return res.status(201).json({ message: "Address saved successfully", data });
    }
  } catch (err) {
    return res.status(500).json({ message: "Address save failed", error: err.message });
  }
});

app.put("/address/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { governorate, city, building_number, floor, apartment } = req.body;
    const userIdInt = parseInt(user_id);

    if (isNaN(userIdInt)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const { data, error } = await supabaseAdmin
      .from("address")
      .update({ governorate, city, building_number, floor: parseInt(floor), apartment: parseInt(apartment) })
      .eq("user_id", userIdInt)
      .select();

    if (error) {
      return res.status(500).json({ message: "Failed to update address", error: error.message });
    }

    return res.status(200).json({ message: "Address updated successfully", data });
  } catch (err) {
    return res.status(500).json({ message: "Address update failed", error: err.message });
  }
});

app.delete("/address/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const userIdInt = parseInt(user_id);

    if (isNaN(userIdInt)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const { data, error } = await supabaseAdmin
      .from("address")
      .delete()
      .eq("user_id", userIdInt)
      .select();

    if (error) {
      return res.status(500).json({ message: "Failed to delete address", error: error.message });
    }

    return res.status(200).json({ message: "Address deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Address deletion failed", error: err.message });
  }
});

// ==================== BOOKING ENDPOINTS ====================

app.post("/booking", async (req, res) => {
  try {
    const {
      user_id,
      street,
      building_number,
      floor,
      apartment,
      area,
      landmark,
      pickup_date,
      pickup_time,
      notes,
      total_weight,
      total_earnings,
      total_co2_saved,
      items
    } = req.body;

    // Validation
    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    if (!street || !building_number || !area) {
      return res.status(400).json({ message: "Address fields are required" });
    }
    if (!pickup_date || !pickup_time) {
      return res.status(400).json({ message: "Pickup date and time are required" });
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "At least one item is required" });
    }

    const userIdInt = parseInt(user_id);
    if (isNaN(userIdInt)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Insert booking
    const { data: bookingData, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .insert([
        {
          user_id: userIdInt,
          street,
          building_number,
          floor: floor || null,
          apartment: apartment || null,
          area,
          landmark: landmark || null,
          pickup_date,
          pickup_time,
          notes: notes || null,
          total_weight: parseFloat(total_weight),
          total_earnings: parseFloat(total_earnings),
          total_co2_saved: parseFloat(total_co2_saved),
          status: "pending"
        }
      ])
      .select();

    if (bookingError) {
      console.error("Booking error:", bookingError);
      return res.status(500).json({ 
        message: "Failed to create booking", 
        error: bookingError.message 
      });
    }

    const bookingId = bookingData[0].id;

    // Insert booking items
    const itemsToInsert = items.map(item => ({
      booking_id: bookingId,
      material_name: item.materialName,
      subtype_name: item.subTypeName || null,
      weight: parseFloat(item.weight),
      price_per_kg: parseFloat(item.pricePerKg),
      total_price: parseFloat(item.total)
    }));

    const { data: itemsData, error: itemsError } = await supabaseAdmin
      .from("booking_items")
      .insert(itemsToInsert)
      .select();

    if (itemsError) {
      // Rollback booking if items fail
      await supabaseAdmin.from("bookings").delete().eq("id", bookingId);
      console.error("Items error:", itemsError);
      return res.status(500).json({ 
        message: "Failed to add booking items", 
        error: itemsError.message 
      });
    }

    return res.status(201).json({
      message: "Booking created successfully",
      booking: {
        ...bookingData[0],
        items: itemsData
      }
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ 
      message: "Booking creation failed", 
      error: err.message 
    });
  }
});

app.get("/bookings/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const userIdInt = parseInt(user_id);

    if (isNaN(userIdInt)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", userIdInt)
      .order("created_at", { ascending: false });

    if (bookingsError) {
      return res.status(500).json({ 
        message: "Failed to fetch bookings", 
        error: bookingsError.message 
      });
    }

    const bookingsWithItems = await Promise.all(
      bookings.map(async (booking) => {
        const { data: items } = await supabase
          .from("booking_items")
          .select("*")
          .eq("booking_id", booking.id);

        return { ...booking, items: items || [] };
      })
    );

    return res.status(200).json({
      message: "Bookings fetched successfully",
      bookings: bookingsWithItems
    });
  } catch (err) {
    return res.status(500).json({ 
      message: "Failed to fetch bookings", 
      error: err.message 
    });
  }
});

app.get("/booking/:booking_id", async (req, res) => {
  try {
    const { booking_id } = req.params;
    const bookingIdInt = parseInt(booking_id);

    if (isNaN(bookingIdInt)) {
      return res.status(400).json({ message: "Invalid booking ID format" });
    }

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingIdInt)
      .single();

    if (bookingError || !booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const { data: items } = await supabase
      .from("booking_items")
      .select("*")
      .eq("booking_id", bookingIdInt);

    return res.status(200).json({
      message: "Booking fetched successfully",
      booking: { ...booking, items: items || [] }
    });
  } catch (err) {
    return res.status(500).json({ 
      message: "Failed to fetch booking", 
      error: err.message 
    });
  }
});

app.put("/booking/:booking_id/status", async (req, res) => {
  try {
    const { booking_id } = req.params;
    const { status } = req.body;
    const bookingIdInt = parseInt(booking_id);

    if (isNaN(bookingIdInt)) {
      return res.status(400).json({ message: "Invalid booking ID format" });
    }

    const validStatuses = ["pending", "confirmed", "in_progress", "completed", "cancelled"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: "Invalid status. Must be one of: " + validStatuses.join(", ")
      });
    }

    const { data, error } = await supabaseAdmin
      .from("bookings")
      .update({ status })
      .eq("id", bookingIdInt)
      .select();

    if (error) {
      return res.status(500).json({ 
        message: "Failed to update booking status", 
        error: error.message 
      });
    }

    return res.status(200).json({
      message: "Booking status updated successfully",
      booking: data[0]
    });
  } catch (err) {
    return res.status(500).json({ 
      message: "Status update failed", 
      error: err.message 
    });
  }
});

app.delete("/booking/:booking_id", async (req, res) => {
  try {
    const { booking_id } = req.params;
    const bookingIdInt = parseInt(booking_id);

    if (isNaN(bookingIdInt)) {
      return res.status(400).json({ message: "Invalid booking ID format" });
    }

    // Delete items first
    await supabaseAdmin
      .from("booking_items")
      .delete()
      .eq("booking_id", bookingIdInt);

    const { data, error } = await supabaseAdmin
      .from("bookings")
      .delete()
      .eq("id", bookingIdInt)
      .select();

    if (error) {
      return res.status(500).json({ 
        message: "Failed to delete booking", 
        error: error.message 
      });
    }

    return res.status(200).json({ 
      message: "Booking deleted successfully" 
    });
  } catch (err) {
    return res.status(500).json({ 
      message: "Booking deletion failed", 
      error: err.message 
    });
  }
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running ✅",
    endpoints: {
      auth: {
        signup: "POST /signup",
        login: "POST /login",
        updateUser: "PUT /user/:user_id"
      },
      address: {
        getAddress: "GET /address/:user_id",
        createAddress: "POST /address",
        updateAddress: "PUT /address/:user_id",
        deleteAddress: "DELETE /address/:user_id"
      },
      bookings: {
        createBooking: "POST /booking",
        getUserBookings: "GET /bookings/:user_id",
        getSingleBooking: "GET /booking/:booking_id",
        updateBookingStatus: "PUT /booking/:booking_id/status",
        deleteBooking: "DELETE /booking/:booking_id"
      }
    },
  });
});

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});