const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file (misal gambar)
app.use("/uploads", express.static("uploads"));

// Import Routers
const commentsRouter = require("./Route/comments");
const authRouter = require("./Route/auth");
const newsRouter = require("./Route/news");
const interactionRouter = require("./Route/interaction");
const profileRouter = require("./Route/profile");
const adminRouter = require("./Route/admin");

// Register Routes
app.use("/api", commentsRouter);
app.use("/api", authRouter);
app.use("/api", newsRouter);
app.use("/api/interaction", interactionRouter); // ✅ route interaction dibenerin
app.use("/api/profile", profileRouter);
app.use("/api/admin", adminRouter);

// Global Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Terjadi kesalahan di server." });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
