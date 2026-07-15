const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");

const PRODUCTS_FILE = path.join(__dirname, "../data/products.json");
const CATEGORIES_FILE = path.join(__dirname, "../data/categories.json");

// Helper function to read products
async function getProducts() {
  const data = await fs.readFile(PRODUCTS_FILE, "utf8");
  return JSON.parse(data);
}

// Helper function to read categories
async function getCategories() {
  const data = await fs.readFile(CATEGORIES_FILE, "utf8");
  return JSON.parse(data);
}

// GET /api/products - Get all products with optional filtering
router.get("/", async (req, res, next) => {
  try {
    const products = await getProducts();
    const { category, region, organic, featured, search } = req.query;

    let filtered = products;

    // Filter by category
    if (category) {
      filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by region
    if (region) {
      filtered = filtered.filter((p) => p.region.toLowerCase() === region.toLowerCase());
    }

    // Filter by organic
    if (organic === "true") {
      filtered = filtered.filter((p) => p.organic === true);
    }

    // Filter by featured
    if (featured === "true") {
      filtered = filtered.filter((p) => p.featured === true);
    }

    // Search by name or description
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      );
    }

    res.json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/categories - Get all categories
router.get("/categories", async (req, res, next) => {
  try {
    const categories = await getCategories();
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id - Get single product by ID
router.get("/:id", async (req, res, next) => {
  try {
    const products = await getProducts();
    const productId = parseInt(req.params.id);
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
