import express from "express";
import Product from "../models/Product.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

// Get all pending products
router.get(
  "/products/pending",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const products = await Product.find({ status: "pending" })
      .populate("vendorId", "name email");
    res.json(products);
  }
);

// Approve / Reject product
router.put(
  "/product/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({ message: `Product ${status}`, product });
  }
);

export default router;
