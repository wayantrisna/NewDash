const express = require("express");
const router = express.Router();
const pool = require("../db");

// =======================
// Statistik Dashboard
// =======================
router.get("/stats", async (req, res) => {
  try {
    const [[articles], [users], [comments]] = await Promise.all([
      pool.query("SELECT COUNT(*) AS total FROM news"),
      pool.query("SELECT COUNT(*) AS total FROM users"),
      pool.query("SELECT COUNT(*) AS total FROM comments"),
    ]);
    res.json({
      totalArticles: articles.total,
      totalUsers: users.total,
      totalComments: comments.total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

// ======================================
// GET: Semua berita (untuk Admin Panel)
// ======================================
router.get("/news/all", async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        n.id, 
        n.title, 
        n.category, 
        n.image AS image, 
        n.time AS createdAt, 
        u.username AS authorName
      FROM news n
      LEFT JOIN users u ON n.authorId = u.id
      ORDER BY n.time DESC
    `);
    res.status(200).json(results);
  } catch (err) {
    console.error("❌ Gagal fetch semua berita (admin):", err);
    res.status(500).json({ error: "Gagal mengambil semua berita" });
  }
});

// ======================================
// GET: Semua berita (untuk Admin Panel)
// ======================================
router.get("/news/all", async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        n.id, n.title, n.category, n.imageUrl AS image, n.createdAt,
        u.username AS authorName
      FROM news n
      LEFT JOIN users u ON n.authorId = u.id
      ORDER BY n.createdAt DESC
    `);
    res.status(200).json(results);
  } catch (err) {
    console.error("❌ Gagal fetch semua berita (admin):", err);
    res.status(500).json({ error: "Gagal mengambil semua berita" });
  }
});

// =======================
// Edit Berita
// =======================
router.put("/news/:id", async (req, res) => {
  const newsId = req.params.id;
  const { title, description, imageUrl, category, status } = req.body;

  if (!title || !description || !category || !status) {
    return res
      .status(400)
      .json({ success: false, message: "Data tidak lengkap" });
  }

  try {
    await pool.query(
      "UPDATE news SET title = ?, description = ?, imageUrl = ?, category = ?, status = ? WHERE id = ?",
      [title, description, imageUrl, category, status, newsId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error updating news" });
  }
});

// =======================
// Delete Berita (dengan data terkait)
// =======================
router.delete("/news/:id", async (req, res) => {
  const newsId = req.params.id;

  try {
    // Hapus data terkait terlebih dahulu
    await pool.query("DELETE FROM views WHERE news_id = ?", [newsId]);
    await pool.query("DELETE FROM news_likes WHERE news_id = ?", [newsId]);
    await pool.query("DELETE FROM comments WHERE newsId = ?", [newsId]);
    await pool.query(
      "DELETE FROM reports WHERE targetType = 'news' AND targetId = ?",
      [newsId]
    );

    // Terakhir, hapus berita-nya
    await pool.query("DELETE FROM news WHERE id = ?", [newsId]);

    res.sendStatus(204); // Sukses tanpa response body
  } catch (err) {
    console.error("Error deleting news:", err);
    res.status(500).json({ message: "Gagal menghapus berita" });
  }
});


// =======================
// Semua Komentar
// =======================
router.get("/comments", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.id, c.commentText, c.createdAt, c.parentId, c.newsId,
             u.name AS username, u.profileImage,
             n.title AS newsTitle
      FROM comments c
      LEFT JOIN users u ON c.userId = u.id
      LEFT JOIN news n ON c.newsId = n.id
      ORDER BY c.createdAt DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error get all comments:", err);
    res.status(500).json({ message: "Gagal mengambil komentar" });
  }
});

// =======================
// Delete Komentar
// =======================
router.delete("/comments/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM comments WHERE id = ?", [req.params.id]);
    res.json({ message: "Komentar berhasil dihapus" });
  } catch (err) {
    console.error("Error delete comment:", err);
    res.status(500).json({ message: "Gagal menghapus komentar" });
  }
});

// =======================
// Semua User
// =======================
router.get("/users", async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, username, email, role, created_at FROM users ORDER BY id DESC"
    );
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Gagal mengambil data user" });
  }
});

// =======================
// Update Role User
// =======================
router.put("/users/:id/role", async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    await pool.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);
    res.json({ success: true, message: "Role berhasil diperbarui" });
  } catch (err) {
    console.error("Error update role:", err);
    res.status(500).json({ success: false, message: "Gagal update role" });
  }
});

// =======================
// Hapus User & Data Terkait
// =======================
router.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    await pool.query("DELETE FROM comments WHERE userId = ?", [userId]);
    await pool.query("DELETE FROM news WHERE authorId = ?", [userId]);
    await pool.query("DELETE FROM news_likes WHERE userId = ?", [userId]);
    await pool.query("DELETE FROM reports WHERE reporterId = ?", [userId]);
    await pool.query("DELETE FROM users WHERE id = ?", [userId]);

    res.json({
      success: true,
      message: "User & data terkait berhasil dihapus",
    });
  } catch (err) {
    console.error("Gagal menghapus user:", err);
    res.status(500).json({ success: false, message: "Gagal menghapus user" });
  }
});

// =======================
// Laporan Konten
// =======================
router.get("/reports", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        r.id, r.targetType, r.targetId, r.reason, r.note, r.createdAt,
        u.username AS reporterName, u.email AS reporterEmail,
        CASE
          WHEN r.targetType = 'news' THEN (SELECT title FROM news WHERE id = r.targetId)
          WHEN r.targetType = 'comment' THEN (SELECT commentText FROM comments WHERE id = r.targetId)
          ELSE NULL
        END AS reportedContent
      FROM reports r
      JOIN users u ON r.reporterId = u.id
      ORDER BY r.createdAt DESC
      LIMIT 10;
    `);
    res.json(rows);
  } catch (err) {
    console.error("Gagal ambil laporan:", err);
    res
      .status(500)
      .json({ error: "Gagal mengambil laporan", details: err.message });
  }
});

// Hapus laporan berdasarkan ID
router.delete("/reports/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM reports WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "Laporan berhasil dihapus" });
  } catch (err) {
    console.error("Gagal menghapus laporan:", err);
    res.status(500).json({ error: "Gagal menghapus laporan" });
  }
});

// =======================
// Total Semua View
// =======================
router.get("/news/total-views", async (req, res) => {
  try {
    const [results] = await pool.query(
      "SELECT COUNT(*) AS totalViews FROM views"
    );
    res.json({ totalViews: results[0].totalViews || 0 });
  } catch (err) {
    console.error("❌ Error fetching total views:", err);
    res.status(500).json({ error: "Failed to get total views" });
  }
});

module.exports = router;
