import express from "express";
import bcrypt from "bcryptjs";
import Vendor from "../models/Vendor.js";
import jwt from "jsonwebtoken";

const router = express.Router();
import passport from "passport";

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

// Google Auth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    // Determine redirect logic
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    // Redirect to frontend with token
    res.redirect(`http://localhost:3000/auth/callback?token=${token}`);
  }
);

// Get Current User (for OAuth callback)
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const vendor = await Vendor.findById(decoded.id);

    res.json(vendor);
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
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
