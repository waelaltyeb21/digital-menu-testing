// -------------------------------------------------------------------
// Libraries
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
// -------------------------------------------------------------------
// // Enviromantal Variables
require("dotenv").config();
const PORT = process.env.PORT;
const MONGO_URI = process.env.DB_URI;
// // -------------------------------------------------------------------
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://digital-menu1.web.app",
    ],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  },
  pingTimeout: 10000,
  pingInterval: 5000,
});
module.exports = io;
// -------------------------------------------------------------------
io.setMaxListeners(20);
// -------------------------------------------------------------------
// Socket.io
io.on("connection", (socket) => {
  io.emit("connection", "Welcome To Our Humble Restaurant!");
  // -----------------------------------------
  io.on("disconnect", () => {
    io.emit("disconnect", "The Client Has Left");
  });
  // -----------------------------------------
  io.on("error", (error) => {
    io.emit("disconnect", error);
  });
});
// -------------------------------------------------------------------
// Routes
const Dishes = require("../Routes/Dishes");
const Categories = require("../Routes/Categories");
const Orders = require("../Routes/Orders");
const Restaurants = require("../Routes/Restaurants");
const Tables = require("../Routes/Tables");
const Register = require("../Routes/Register");
// -------------------------------------------------------------------
app.use(express.json());
// -------------------------------------------------------------------
// CROS ORIGIN
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://digital-menu1.web.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
// -------------------------------------------------------------------
// Routes
app.use("/api/restaurants", Restaurants);
app.use("/api/dishes", Dishes);
app.use("/api/categories", Categories);
app.use("/api/orders", Orders);
app.use("/api/tables", Tables);
app.use("/api/register", Register);
// 404 - Route Not Found
app.get("*", (req, res) => {
  return res.status(404).json({ msg: "404 - Route Not Found!" });
});
// -------------------------------------------------------------------
// Server Port
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected To DB!");
    server.listen(5000, () => console.log(`Server Running On Port ${5000}`));
    app.listen(PORT, () => console.log(`Server Running On Port ${PORT}`));
  })
  .catch((err) => console.log("Something Went Wrong!", err));
