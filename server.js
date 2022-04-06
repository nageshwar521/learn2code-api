require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./app/routes/auth");
const usersRoutes = require("./app/routes/users");
const rolesRoutes = require("./app/routes/roles");
const ordersRoutes = require("./app/routes/orders");
const permissionsRoutes = require("./app/routes/permissions");
const branchesRoutes = require("./app/routes/branches");
const couponsRoutes = require("./app/routes/coupons");
const servicesRoutes = require("./app/routes/services");
const transactionsRoutes = require("./app/routes/transactions");
const { verifyToken } = require("./app/middlewares/auth");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/test", (req, res) => {
  res.send("Api is working");
});
app.use("/api/auth", authRoutes);
app.use("/api/users", verifyToken, usersRoutes);
app.use("/api/roles", verifyToken, rolesRoutes);
app.use("/api/orders", verifyToken, ordersRoutes);
app.use("/api/permissions", verifyToken, permissionsRoutes);
app.use("/api/branches", verifyToken, branchesRoutes);
app.use("/api/coupons", verifyToken, couponsRoutes);
app.use("/api/services", verifyToken, servicesRoutes);
app.use("/api/transactions", verifyToken, transactionsRoutes);

app.listen(5000, () => {
  // initDB();
  console.log("Server running at http://127.0.0.1:5000");
});
