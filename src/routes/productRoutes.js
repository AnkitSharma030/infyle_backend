import express from "express";
import Product from "../models/Product.js";
// import authMiddleware from "../middlewares/auth.middleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// Add Product (Vendor)
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let imageUrl = "";

    // Upload image to Cloudinary if provided
    if (image) {
      try {
        const uploadResult = await cloudinary.uploader.upload(image, {
          folder: "products",
          resource_type: "auto",
        });
        imageUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({ message: "Failed to upload image" });
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image: imageUrl,
      vendorId: req.user.id,
    });

    res.status(201).json({
      message: "Product submitted for approval",
      product,
    });
  } catch (error) {
    console.error("Product creation error:", error);
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
