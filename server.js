require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");
const { initDB } = require("./app/db/connection");
const authRoutes = require("./app/routes/auth");
const usersRoutes = require("./app/routes/users");
const { verifyToken } = require("./app/middlewares/auth");

const app = express();
const server = http.createServer(app);

const io = socketIo(server).sockets;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/users", verifyToken, usersRoutes);

require("./app/middlewares/socket")(io);

app.listen(5000, () => {
  initDB();
  console.log("Server running at http://localhost:5000");
});
