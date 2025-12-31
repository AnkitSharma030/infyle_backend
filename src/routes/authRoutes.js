import express from "express";
import bcrypt from "bcryptjs";
import Vendor from "../models/Vendor.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Vendor Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ message: "Vendor already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const vendor = await Vendor.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    const token = jwt.sign(
      { id: vendor._id, role: vendor.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Signup successful",
      token,
      vendor,
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed" });
  }
});

export default router;


// Vendor Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: vendor._id, role: vendor.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      vendor,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});
