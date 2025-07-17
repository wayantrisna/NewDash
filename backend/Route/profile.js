const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");

// Konfigurasi penyimpanan file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

// ✅ GET: Ambil data user
router.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT id, username, email, role, about, profileImage FROM users WHERE id = ?",
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = rows[0];
    user.profileImage = user.profileImage
      ? `/uploads/${user.profileImage}`
      : "/default-avatar.png";

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// ✅ PUT: Update profile user
router.put("/update/:id", upload.single("profileImage"), async (req, res) => {
  const { id } = req.params;
  const { username, email, about } = req.body;
  const profileImage = req.file ? req.file.filename : null;

  if (!username || !email) {
    return res.status(400).json({ error: "Username dan Email wajib diisi" });
  }

  try {
    if (profileImage) {
      await pool.query(
        "UPDATE users SET username = ?, email = ?, about = ?, profileImage = ? WHERE id = ?",
        [username, email, about, profileImage, id]
      );
    } else {
      await pool.query(
        "UPDATE users SET username = ?, email = ?, about = ? WHERE id = ?",
        [username, email, about, id]
      );
    }

    const [updatedUser] = await pool.query(
      "SELECT id, username, email, role, about, profileImage FROM users WHERE id = ?",
      [id]
    );

    if (updatedUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = updatedUser[0];
    user.profileImage = user.profileImage
      ? `/uploads/${user.profileImage}`
      : "/default-avatar.png";

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

module.exports = router;
