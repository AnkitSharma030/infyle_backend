import express from "express";
import Product from "../models/Product.js";
// import authMiddleware from "../middlewares/auth.middleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Add Product (Vendor)
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      vendorId: req.user.id,
    });

    res.status(201).json({
      message: "Product submitted for approval",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add product" });
  }
});

// Get Vendor Products
router.get("/vendor/:vendorId", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({
      vendorId: req.params.vendorId,
    }).sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

export default router;
