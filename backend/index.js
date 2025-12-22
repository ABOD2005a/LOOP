const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const collectorRoutes = require("./routes/collector");
const addressRoutes = require("./routes/address");
const bookingRoutes = require("./routes/booking");

const app = express();

app.use(cors());
app.use(express.json());
app.use(authRoutes);
app.use(collectorRoutes);
app.use(addressRoutes);
app.use(bookingRoutes);
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running ✅",
    endpoints: {
      auth: {
        signup: "POST /signup",
        login: "POST /login",
        updateUser: "PUT /user/:user_id",
      },
      collector: {
        collectorSignup: "POST /collector/signup",
        collectorLogin: "POST /collector",
        getCollector: "GET /collector/:collector_id",
        updatePassword: "PUT /collector/:collector_id/password",
        deleteCollector: "DELETE /collector/:collector_id",
      },
      address: {
        getAddress: "GET /address/:user_id",
        createAddress: "POST /address",
        updateAddress: "PUT /address/:user_id",
        deleteAddress: "DELETE /address/:user_id",
      },
      bookings: {
        createBooking: "POST /booking",
        getUserBookings: "GET /bookings/:user_id",
        getSingleBooking: "GET /booking/:booking_id",
        updateBookingStatus: "PUT /booking/:booking_id/status",
        deleteBooking: "DELETE /booking/:booking_id",
      },
    },
  });
});

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});
