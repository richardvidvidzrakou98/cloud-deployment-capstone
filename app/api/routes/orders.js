const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");

const ORDERS_FILE = path.join(__dirname, "../data/orders.json");

// Helper function to read orders
async function getOrders() {
  const data = await fs.readFile(ORDERS_FILE, "utf8");
  return JSON.parse(data);
}

// Helper function to save orders
async function saveOrders(orders) {
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
}

// GET /api/orders - Get all orders (for admin purposes)
router.get("/", async (req, res, next) => {
  try {
    const orders = await getOrders();
    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/orders - Create a new order
router.post("/", async (req, res, next) => {
  try {
    const { items, deliveryInfo, total, deliveryCost } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Order must contain at least one item",
      });
    }

    if (!deliveryInfo || !deliveryInfo.name || !deliveryInfo.phone || !deliveryInfo.region) {
      return res.status(400).json({
        success: false,
        error: "Delivery information is incomplete",
      });
    }

    // Read existing orders
    const orders = await getOrders();

    // Create new order
    const newOrder = {
      id: orders.length > 0 ? Math.max(...orders.map((o) => o.id)) + 1 : 1,
      orderNumber: `AGR${Date.now()}`,
      items,
      deliveryInfo,
      total: total || items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      deliveryCost: deliveryCost || 0,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to orders array
    orders.push(newOrder);

    // Save to file
    await saveOrders(orders);

    // Return success response
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/:id - Get single order by ID
router.get("/:id", async (req, res, next) => {
  try {
    const orders = await getOrders();
    const orderId = parseInt(req.params.id);
    const order = orders.find((o) => o.id === orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
