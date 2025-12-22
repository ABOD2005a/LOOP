const express = require("express");
const { supabase, supabaseAdmin } = require("../config/supabase");
const { handleError } = require("../utils/validation");

const router = express.Router();

// ==================== GET ADDRESS ====================
router.get("/address/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const userIdInt = parseInt(user_id);

    if (isNaN(userIdInt)) {
      return handleError(res, 400, "Invalid user ID format");
    }

    const { data, error } = await supabase
      .from("address")
      .select("*")
      .eq("user_id", userIdInt)
      .maybeSingle();

    if (error) {
      return handleError(res, 500, "Failed to fetch address", error);
    }

    if (!data) {
      return res.status(404).json({
        message: "No address found",
        hasAddress: false,
      });
    }

    return res.status(200).json({
      message: "Address fetched successfully",
      hasAddress: true,
      address: data,
    });
  } catch (err) {
    return handleError(res, 500, "Failed to fetch address", err);
  }
});

// ==================== CREATE/UPDATE ADDRESS ====================
router.post("/address", async (req, res) => {
  try {
    const { user_id, governorate, city, building_number, floor, apartment } =
      req.body;

    if (
      !user_id ||
      !governorate ||
      !city ||
      !building_number ||
      floor === undefined ||
      apartment === undefined
    ) {
      return handleError(res, 400, "All fields are required");
    }

    const userIdInt = parseInt(user_id);
    const floorInt = parseInt(floor);
    const apartmentInt = parseInt(apartment);

    if (isNaN(userIdInt) || isNaN(floorInt) || isNaN(apartmentInt)) {
      return handleError(
        res,
        400,
        "Invalid format for numeric fields"
      );
    }

    const { data: existingAddress } = await supabaseAdmin
      .from("address")
      .select("*")
      .eq("user_id", userIdInt)
      .maybeSingle();

    if (existingAddress) {
      const { data, error } = await supabaseAdmin
        .from("address")
        .update({
          governorate,
          city,
          building_number,
          floor: floorInt,
          apartment: apartmentInt,
        })
        .eq("user_id", userIdInt)
        .select();

      if (error) {
        return handleError(res, 500, "Failed to update address", error);
      }

      return res.status(200).json({
        message: "Address updated successfully",
        data,
      });
    } else {
      const { data, error } = await supabaseAdmin
        .from("address")
        .insert([
          {
            user_id: userIdInt,
            governorate,
            city,
            building_number,
            floor: floorInt,
            apartment: apartmentInt,
          },
        ])
        .select();

      if (error) {
        return handleError(res, 500, "Failed to save address", error);
      }

      return res.status(201).json({
        message: "Address saved successfully",
        data,
      });
    }
  } catch (err) {
    return handleError(res, 500, "Address save failed", err);
  }
});

// ==================== UPDATE ADDRESS ====================
router.put("/address/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { governorate, city, building_number, floor, apartment } = req.body;
    const userIdInt = parseInt(user_id);

    if (isNaN(userIdInt)) {
      return handleError(res, 400, "Invalid user ID format");
    }

    const { data, error } = await supabaseAdmin
      .from("address")
      .update({
        governorate,
        city,
        building_number,
        floor: parseInt(floor),
        apartment: parseInt(apartment),
      })
      .eq("user_id", userIdInt)
      .select();

    if (error) {
      return handleError(res, 500, "Failed to update address", error);
    }

    return res.status(200).json({
      message: "Address updated successfully",
      data,
    });
  } catch (err) {
    return handleError(res, 500, "Address update failed", err);
  }
});

// ==================== DELETE ADDRESS ====================
router.delete("/address/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const userIdInt = parseInt(user_id);

    if (isNaN(userIdInt)) {
      return handleError(res, 400, "Invalid user ID format");
    }

    const { data, error } = await supabaseAdmin
      .from("address")
      .delete()
      .eq("user_id", userIdInt)
      .select();

    if (error) {
      return handleError(res, 500, "Failed to delete address", error);
    }

    return res.status(200).json({ message: "Address deleted successfully" });
  } catch (err) {
    return handleError(res, 500, "Address deletion failed", err);
  }
});

module.exports = router;
