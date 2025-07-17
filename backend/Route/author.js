const express = require("express");
const router = express.Router();
const pool = require("../db");

// ✅ GET semua berita milik author
router.get("/news/mine", async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const [rows] = await pool.query(
      `SELECT n.*,
        (SELECT COUNT(*) FROM views WHERE newsId = n.id) AS views,
        (SELECT COUNT(*) FROM likes WHERE news_id = n.id) AS likes,
        (SELECT COUNT(*) FROM comments WHERE newsId = n.id) AS commentsCount
      FROM news n
      WHERE n.authorId = ?
      ORDER BY n.time DESC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching author's news:", err);
    res.status(500).json({ message: "Gagal mengambil berita author" });
  }
});

// ✅ GET statistik total untuk dashboard author
router.get("/news/stats", async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const [[{ totalArticles }]] = await pool.query(
      "SELECT COUNT(*) AS totalArticles FROM news WHERE authorId = ?",
      [userId]
    );

    const [[{ totalViews }]] = await pool.query(
      `SELECT COUNT(*) AS totalViews FROM views 
       WHERE newsId IN (SELECT id FROM news WHERE authorId = ?)`,
      [userId]
    );

    const [[{ totalLikes }]] = await pool.query(
      `SELECT COUNT(*) AS totalLikes FROM likes 
       WHERE news_id IN (SELECT id FROM news WHERE authorId = ?)`,
      [userId]
    );

    const [[{ totalComments }]] = await pool.query(
      `SELECT COUNT(*) AS totalComments FROM comments 
       WHERE newsId IN (SELECT id FROM news WHERE authorId = ?)`,
      [userId]
    );

    res.json({
      totalArticles: totalArticles || 0,
      totalViews: totalViews || 0,
      totalLikes: totalLikes || 0,
      totalComments: totalComments || 0,
    });
  } catch (err) {
    console.error("❌ Error fetching author stats:", err);
    res.status(500).json({ message: "Gagal mengambil statistik author" });
  }
});

// ✅ GET single news
router.get("/news/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query("SELECT * FROM news WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error fetching single news:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ PUT update news
router.put("/news/:id", async (req, res) => {
  const { id } = req.params;
  const { title, summary, image, time, category, categoryColor } = req.body;

  try {
    await pool.query(
      `UPDATE news 
       SET title = ?, summary = ?, image = ?, time = ?, category = ?, categoryColor = ? 
       WHERE id = ?`,
      [title, summary, image, time, category, categoryColor, id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error updating news:", err);
    res.status(500).json({ success: false });
  }
});

// ✅ DELETE news
router.delete("/news/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM news WHERE id = ?", [id]);
    res.json({ success: true, message: "News deleted" });
  } catch (err) {
    console.error("❌ Error deleting news:", err);
    res.status(500).json({ success: false, message: "Failed to delete news" });
  }
});

module.exports = router;
