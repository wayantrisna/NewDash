const express = require("express");
const router = express.Router();
const pool = require("../db"); // Pastikan ini adalah pool MySQL2

// ===============================
// Middleware validasi komentar
// ===============================
const validateComment = (req, res, next) => {
  const { userId, commentText, newsId } = req.body;
  if (!userId || !commentText || !newsId) {
    return res.status(400).json({ error: "Semua field harus diisi" });
  }
  next();
};

// ===============================
// GET: Hitung total semua komentar
// ===============================
router.get("/comments/count", async (req, res) => {
  try {
    const [result] = await pool.query("SELECT COUNT(*) AS total FROM comments");
    res.json(result[0]); // hasil: { total: 20 } misalnya
  } catch (err) {
    console.error("❌ Error counting comments:", err);
    res.status(500).json({ error: "Gagal menghitung komentar" });
  }
});

// ===============================
// POST: Simpan komentar
// ===============================
router.post("/comments", validateComment, async (req, res) => {
  const { userId, newsId, commentText } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO comments (userId, commentText, newsId, created_at) VALUES (?, ?, ?, NOW())",
      [userId, commentText, newsId]
    );

    res.status(201).json({
      message: "Komentar berhasil disimpan",
      id: result.insertId,
    });
  } catch (err) {
    console.error("❌ Error inserting comment:", err);
    res.status(500).json({ error: "Gagal menyimpan komentar" });
  }
});

// ===============================
// GET: Ambil semua komentar untuk Admin
// ===============================
router.get("/comments", async (req, res) => {
  try {
    const [results] = await pool.query(
      `
      SELECT 
        c.id, 
        c.commentText, 
        c.created_at, 
        u.username, 
        u.profileImage,
        n.title as newsTitle
      FROM comments c
      JOIN users u ON c.userId = u.id
      JOIN news n ON c.newsId = n.id
      ORDER BY c.created_at DESC
      `
    );

    const formattedComments = results.map((comment) => ({
      id: comment.id,
      username: comment.username,
      userAvatar: comment.profileImage
        ? `http://localhost:3000/uploads/${comment.profileImage}`
        : "/default-avatar.png",
      content: comment.commentText,
      newsTitle: comment.newsTitle,
      createdAt: comment.created_at,
    }));

    res.json(formattedComments);
  } catch (err) {
    console.error("❌ Error fetching all comments:", err);
    res.status(500).json({ error: "Gagal mengambil semua komentar" });
  }
});

// ===============================
// GET: Ambil komentar berdasarkan ID berita
// (ubah path agar tidak konflik dengan DELETE)
// ===============================
router.get("/comments/news/:newsId", async (req, res) => {
  const { newsId } = req.params;
  try {
    const [results] = await pool.query(
      `
      SELECT 
        c.id, 
        c.commentText, 
        c.created_at, 
        u.username, 
        u.profileImage
      FROM comments c
      JOIN users u ON c.userId = u.id
      WHERE c.newsId = ?
      ORDER BY c.created_at ASC
      `,
      [newsId]
    );

    const formattedComments = results.map((comment) => ({
      ...comment,
      profileImage: comment.profileImage
        ? `http://localhost:3000/uploads/${comment.profileImage}`
        : "/default-avatar.png",
    }));

    res.json(formattedComments);
  } catch (err) {
    console.error("❌ Error fetching comments:", err);
    res.status(500).json({ error: "Gagal mengambil komentar" });
  }
});

// ===============================
// DELETE: Hapus komentar berdasarkan ID
// ===============================
router.delete("/comments/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM comments WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Komentar tidak ditemukan" });
    }

    res.json({ message: "Komentar berhasil dihapus" });
  } catch (err) {
    console.error("❌ Error deleting comment:", err);
    res.status(500).json({ error: "Gagal menghapus komentar" });
  }
});

module.exports = router;
