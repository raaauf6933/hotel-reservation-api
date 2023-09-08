const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cloudStorage = require("./startup/cloudStorage");

// Routes
const rooms = require("./routes/rooms");
const bookings = require("./routes/bookings");
const auth = require("./routes/auth");
const user = require("./routes/users");
const email = require("./routes/emailTest");
const reports = require("./routes/reports");
const amenities = require("./routes/amenities");
const discounts = require("./routes/discount");
const customers = require("./routes/customers");

const { expiredBooking } = require("./startup/cronJobs");

require("dotenv").config();

app.use(
  cors({
    origin: "*", // <-- location of the react app
    credentials: true,
    allowedHeaders: "*",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

cloudStorage();

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log(`db connected`))
  .catch((err) => console.log(err));

// Cron Jobs
expiredBooking();

// API Routes
app.use("/api/admin/auth", auth);
app.use("/api/admin/customers", customers)
app.use("/api/admin/booking", bookings);
app.use("/api/admin/room_types", rooms);
app.use("/api/admin/user", user);
app.use("/api/admin/email", email);
app.use("/api/admin/reports", reports);
app.use("/api/admin/amenity", amenities);
app.use("/api/admin/discount", discounts);
app.use("/api/admin/reviews", require("./routes/reviews"));
app.use("/api/admin/about_us", require("./routes/about_us"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
