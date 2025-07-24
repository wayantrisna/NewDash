// === Load .env variables ===
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();

// Gunakan PORT dari .env jika tersedia
const PORT = process.env.PORT || 3000;

// === Middleware ===
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// === Routes ===
const commentsRouter = require("./Route/comments");
const authRouter = require("./Route/auth");
const newsRouter = require("./Route/news");
const interactionRouter = require("./Route/interaction");
const profileRouter = require("./Route/profile");
const adminRouter = require("./Route/admin");

app.use("/api", commentsRouter);
app.use("/api", authRouter);
app.use("/api", newsRouter);
app.use("/api/interaction", interactionRouter);
app.use("/api/profile", profileRouter);
app.use("/api/admin", adminRouter);

// === Error Handling ===
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Terjadi kesalahan di server." });
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
