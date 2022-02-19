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

app.use("/api/auth", auth);
app.use("/api/admin/booking", bookings);
app.use("/api/admin/room_types", rooms);
app.use("/api/admin/user", user);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
