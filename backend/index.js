const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const collectorRoutes = require("./routes/collector");
const addressRoutes = require("./routes/address");
const bookingRoutes = require("./routes/bookings");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:5174",
      "https://localhost:8081",
      "https://localhost:8080",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoutes);
app.use("/api", collectorRoutes);
app.use("/api", addressRoutes);
app.use("/api", bookingRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running ✅",
    endpoints: {
      auth: {
        signup: "POST /api/signup",
        login: "POST /api/login",
        logout: "POST /api/logout",
        updateUser: "PUT /api/user/:user_id",
        getActiveUsers: "GET /api/users/active",
      },
      collector: {
        collectorLogin: "POST /api/collector",
        getCollector: "GET /api/collector/:collector_id",
        updatePassword: "PUT /api/collector/:collector_id/password",
        deleteCollector: "DELETE /api/collector/:collector_id",
      },
      address: {
        getAddress: "GET /api/address/:user_id",
        createAddress: "POST /api/address",
        updateAddress: "PUT /api/address/:user_id",
        deleteAddress: "DELETE /api/address/:user_id",
      },
      bookings: {
        createBooking: "POST /api/booking",
        getAllBookings: "GET /api/bookings",
        getUserBookings: "GET /api/bookings/:user_id",
        getSingleBooking: "GET /api/booking/:booking_id",
        updateBookingStatus: "PUT /api/bookings/:booking_id/status",
        deleteBooking: "DELETE /api/booking/:booking_id",
      },
    },
  });
});

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});