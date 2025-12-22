const express = require("express");
const { supabase, supabaseAdmin } = require("../config/supabase");
const { handleError } = require("../utils/validation");

const router = express.Router();

const VALID_STATUSES = [
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
];

router.post("/booking", async (req, res) => {
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
      items,
    } = req.body;

    if (!user_id) {
      return handleError(res, 400, "User ID is required");
    }
    if (!street || !building_number || !area) {
      return handleError(res, 400, "Address fields are required");
    }
    if (!pickup_date || !pickup_time) {
      return handleError(
        res,
        400,
        "Pickup date and time are required"
      );
    }
    if (!items || items.length === 0) {
      return handleError(res, 400, "At least one item is required");
    }

    const userIdInt = parseInt(user_id);
    if (isNaN(userIdInt)) {
      return handleError(res, 400, "Invalid user ID format");
    }

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
          status: "pending",
        },
      ])
      .select();

    if (bookingError) {
      console.error("Booking error:", bookingError);
      return handleError(res, 500, "Failed to create booking", bookingError);
    }

    const bookingId = bookingData[0].id;

    const itemsToInsert = items.map((item) => ({
      booking_id: bookingId,
      material_name: item.materialName,
      subtype_name: item.subTypeName || null,
      weight: parseFloat(item.weight),
      price_per_kg: parseFloat(item.pricePerKg),
      total_price: parseFloat(item.total),
    }));

    const { data: itemsData, error: itemsError } = await supabaseAdmin
      .from("booking_items")
      .insert(itemsToInsert)
      .select();

    if (itemsError) {
      await supabaseAdmin.from("bookings").delete().eq("id", bookingId);
      console.error("Items error:", itemsError);
      return handleError(res, 500, "Failed to add booking items", itemsError);
    }

    return res.status(201).json({
      message: "Booking created successfully",
      booking: {
        ...bookingData[0],
        items: itemsData,
      },
    });
  } catch (err) {
    console.error("Server error:", err);
    return handleError(res, 500, "Booking creation failed", err);
  }
});

// ==================== GET USER BOOKINGS ====================
router.get("/bookings/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const userIdInt = parseInt(user_id);

    if (isNaN(userIdInt)) {
      return handleError(res, 400, "Invalid user ID format");
    }

    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", userIdInt)
      .order("created_at", { ascending: false });

    if (bookingsError) {
      return handleError(res, 500, "Failed to fetch bookings", bookingsError);
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
      bookings: bookingsWithItems,
    });
  } catch (err) {
    return handleError(res, 500, "Failed to fetch bookings", err);
  }
});

// ==================== GET SINGLE BOOKING ====================
router.get("/booking/:booking_id", async (req, res) => {
  try {
    const { booking_id } = req.params;
    const bookingIdInt = parseInt(booking_id);

    if (isNaN(bookingIdInt)) {
      return handleError(res, 400, "Invalid booking ID format");
    }

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingIdInt)
      .single();

    if (bookingError || !booking) {
      return handleError(res, 404, "Booking not found");
    }

    const { data: items } = await supabase
      .from("booking_items")
      .select("*")
      .eq("booking_id", bookingIdInt);

    return res.status(200).json({
      message: "Booking fetched successfully",
      booking: { ...booking, items: items || [] },
    });
  } catch (err) {
    return handleError(res, 500, "Failed to fetch booking", err);
  }
});

// ==================== UPDATE BOOKING STATUS ====================
router.put("/booking/:booking_id/status", async (req, res) => {
  try {
    const { booking_id } = req.params;
    const { status } = req.body;
    const bookingIdInt = parseInt(booking_id);

    if (isNaN(bookingIdInt)) {
      return handleError(res, 400, "Invalid booking ID format");
    }

    if (!status || !VALID_STATUSES.includes(status)) {
      return handleError(
        res,
        400,
        "Invalid status. Must be one of: " + VALID_STATUSES.join(", ")
      );
    }

    const { data, error } = await supabaseAdmin
      .from("bookings")
      .update({ status })
      .eq("id", bookingIdInt)
      .select();

    if (error) {
      return handleError(
        res,
        500,
        "Failed to update booking status",
        error
      );
    }

    return res.status(200).json({
      message: "Booking status updated successfully",
      booking: data[0],
    });
  } catch (err) {
    return handleError(res, 500, "Status update failed", err);
  }
});

// ==================== DELETE BOOKING ====================
router.delete("/booking/:booking_id", async (req, res) => {
  try {
    const { booking_id } = req.params;
    const bookingIdInt = parseInt(booking_id);

    if (isNaN(bookingIdInt)) {
      return handleError(res, 400, "Invalid booking ID format");
    }

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
      return handleError(res, 500, "Failed to delete booking", error);
    }

    return res.status(200).json({ message: "Booking deleted successfully" });
  } catch (err) {
    return handleError(res, 500, "Booking deletion failed", err);
  }
});

module.exports = router;
