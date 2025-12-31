import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/vendor",authRoutes);
app.use("/api/product",productRoutes)
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
