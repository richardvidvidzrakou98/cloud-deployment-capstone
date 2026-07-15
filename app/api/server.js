const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.API_PORT || 4000;

// Middleware
app.use(
  cors({
    origin: true, // Allow all origins in development
    credentials: true,
  }),
);
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Import routes
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");
const deliveryRouter = require("./routes/delivery");

// Use routes
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/delivery", deliveryRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    status: err.status || 500,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found", path: req.path });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 AgroLink Ghana API Server running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   Products API: http://localhost:${PORT}/api/products`);
  console.log(`   Environment: ${process.env.NODE_ENV || "development"}\n`);
});

module.exports = app;
