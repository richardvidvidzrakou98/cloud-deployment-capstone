const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");

const REGIONS_FILE = path.join(__dirname, "../data/regions.json");

// Helper function to read regions
async function getRegions() {
  const data = await fs.readFile(REGIONS_FILE, "utf8");
  return JSON.parse(data);
}

// GET /api/delivery/regions - Get all delivery regions
router.get("/regions", async (req, res, next) => {
  try {
    const regions = await getRegions();
    res.json({
      success: true,
      data: regions,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/delivery/calculate - Calculate delivery cost
router.post("/calculate", async (req, res, next) => {
  try {
    const { regionId, weight } = req.body;

    // Validation
    if (!regionId || !weight) {
      return res.status(400).json({
        success: false,
        error: "Region ID and weight are required",
      });
    }

    if (weight <= 0) {
      return res.status(400).json({
        success: false,
        error: "Weight must be greater than 0",
      });
    }

    // Get regions
    const regions = await getRegions();
    const region = regions.find((r) => r.id === parseInt(regionId));

    if (!region) {
      return res.status(404).json({
        success: false,
        error: "Region not found",
      });
    }

    // Calculate delivery cost
    const deliveryCost = region.basePrice + weight * region.pricePerKg;

    res.json({
      success: true,
      data: {
        region: region.name,
        weight,
        basePrice: region.basePrice,
        pricePerKg: region.pricePerKg,
        deliveryCost: Math.round(deliveryCost * 100) / 100, // Round to 2 decimals
        estimatedDays: region.estimatedDays,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
