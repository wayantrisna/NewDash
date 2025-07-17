const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

// ===============================
// POST: Login pengguna
// ===============================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      token: "dummy-token-123",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage || "",
        about: user.about || "",
      },
    });
  } catch (error) {
    console.error("❌ Error during login:", error);
    res.status(500).json({ error: "Server error during login" });
  }
});

// ===============================
// POST: Registrasi pengguna
// ===============================
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("❌ Error during registration:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// ===============================
// GET: Total User Count
// ===============================
router.get("/users/count", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) AS totalUsers FROM users");
    res.json({ totalUsers: rows[0].totalUsers });
  } catch (error) {
    console.error("❌ Error fetching user count:", error);
    res.status(500).json({ error: "Failed to count users" });
  }
});

module.exports = router;
