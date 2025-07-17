const express = require("express");
const router = express.Router();
const pool = require("../db");

// ===============================
// GET ALL NEWS WITH AUTHOR, LIKES, VIEWS
// ===============================
router.get("/news/all", async (req, res) => {
  const query = `
    SELECT 
      n.*, 
      u.username AS authorName,
      (SELECT COUNT(*) FROM likes WHERE news_id = n.id) AS likes,
      (SELECT COUNT(*) FROM views WHERE news_id = n.id) AS views
    FROM news n
    LEFT JOIN users u ON n.authorId = u.id
    ORDER BY n.id DESC
  `;

  try {
    const [results] = await pool.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error("❌ Error fetching all news:", err);
    return res.status(500).json({ error: "Failed to fetch all news" });
  }
});

// ===============================
// LIKE FUNCTIONALITY
// ===============================

// Simpan like
router.post("/likes", async (req, res) => {
  const { news_id, user_id } = req.body;
  if (!news_id || !user_id)
    return res.status(400).json({ error: "news_id dan user_id wajib diisi" });

  try {
    const [exists] = await pool.query(
      "SELECT * FROM likes WHERE news_id = ? AND user_id = ?",
      [news_id, user_id]
    );

    if (exists.length > 0)
      return res.status(400).json({ error: "Anda sudah memberikan like" });

    const [result] = await pool.query(
      "INSERT INTO likes (news_id, user_id) VALUES (?, ?)",
      [news_id, user_id]
    );

    res
      .status(201)
      .json({ message: "Like berhasil disimpan", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: "Gagal menyimpan like" });
  }
});

// Hapus like
router.delete("/likes", async (req, res) => {
  const { news_id, user_id } = req.body;
  if (!news_id || !user_id)
    return res.status(400).json({ error: "news_id dan user_id wajib diisi" });

  try {
    const [result] = await pool.query(
      "DELETE FROM likes WHERE news_id = ? AND user_id = ?",
      [news_id, user_id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Like tidak ditemukan" });

    res.status(200).json({ message: "Like berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: "Gagal menghapus like" });
  }
});

// Hitung like
router.get("/likes/count/:newsId", async (req, res) => {
  try {
    const [results] = await pool.query(
      "SELECT COUNT(*) AS likeCount FROM likes WHERE news_id = ?",
      [req.params.newsId]
    );
    res.json({ likeCount: results[0].likeCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch like count" });
  }
});

// Cek like user
router.get("/likes/check/:newsId/:userId", async (req, res) => {
  const { newsId, userId } = req.params;
  try {
    const [results] = await pool.query(
      "SELECT * FROM likes WHERE news_id = ? AND user_id = ?",
      [newsId, userId]
    );
    res.json({ hasLiked: results.length > 0 });
  } catch (err) {
    res.status(500).json({ error: "Gagal memeriksa status like" });
  }
});

// ===============================
// BOOKMARK FUNCTIONALITY
// ===============================

// Simpan bookmark
router.post("/bookmarks", async (req, res) => {
  const { news_id, user_id } = req.body;
  if (!news_id || !user_id)
    return res.status(400).json({ error: "news_id dan user_id wajib diisi" });

  try {
    const [result] = await pool.query(
      "INSERT INTO bookmarks (news_id, user_id) VALUES (?, ?)",
      [news_id, user_id]
    );
    res
      .status(201)
      .json({ message: "Bookmark berhasil disimpan", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: "Gagal menyimpan bookmark" });
  }
});

// Hapus bookmark
router.delete("/bookmarks", async (req, res) => {
  const { news_id, user_id } = req.body;
  if (!news_id || !user_id)
    return res.status(400).json({ error: "news_id dan user_id wajib diisi" });

  try {
    const [results] = await pool.query(
      "DELETE FROM bookmarks WHERE news_id = ? AND user_id = ?",
      [news_id, user_id]
    );
    res.status(200).json({ message: "Bookmark berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: "Gagal menghapus bookmark" });
  }
});

// Cek bookmark user
router.get("/bookmarks/check/:newsId/:userId", async (req, res) => {
  const { newsId, userId } = req.params;
  try {
    const [results] = await pool.query(
      "SELECT * FROM bookmarks WHERE news_id = ? AND user_id = ?",
      [newsId, userId]
    );
    res.json({ hasBookmarked: results.length > 0 });
  } catch (err) {
    res.status(500).json({ error: "Gagal memeriksa status bookmark" });
  }
});

// Ambil berita yang dibookmark user
router.get("/bookmarks/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const [results] = await pool.query(
      `
      SELECT news.* FROM bookmarks
      JOIN news ON bookmarks.news_id = news.id
      WHERE bookmarks.user_id = ?
    `,
      [userId]
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookmarked news" });
  }
});

// ===============================
// SEARCH NEWS
// ===============================
router.get("/search", (req, res) => {
  const keyword = `%${req.query.keyword}%`;
  const sql = `
    SELECT * FROM news
    WHERE title LIKE ?
    ORDER BY time DESC
  `;
  pool.query(sql, [keyword], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

router.post("/reports", async (req, res) => {
  const { reporterId, targetType, targetId, reason, note } = req.body;

  if (!reporterId || !targetType || !targetId || !reason) {
    return res.status(400).json({ error: "Data laporan tidak lengkap" });
  }

  try {
    await pool.query(
      `INSERT INTO reports (reporterId, targetType, targetId, reason, note, createdAt)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [reporterId, targetType, targetId, reason, note || null]
    );

    res
      .status(201)
      .json({ success: true, message: "Laporan berhasil dikirim" });
  } catch (err) {
    console.error("Gagal menyimpan laporan:", err);
    res.status(500).json({ error: "Gagal menyimpan laporan" });
  }
});

module.exports = router;
