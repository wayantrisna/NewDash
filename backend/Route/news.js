const express = require("express");
const router = express.Router();
const pool = require("../db");

// ===============================
// POST: Kirim Laporan (Report) Berita atau Komentar
// ===============================
router.post("/report", async (req, res) => {
  const { reporterId, targetType, targetId, reason, note } = req.body;

  if (!reporterId || !targetType || !targetId || !reason) {
    return res.status(400).json({ error: "Semua field wajib diisi" });
  }

  if (!["news", "comment"].includes(targetType)) {
    return res
      .status(400)
      .json({ error: "Target type harus 'news' atau 'comment'" });
  }

  try {
    await pool.query(
      `INSERT INTO reports (reporterId, targetType, targetId, reason, note, createdAt)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [reporterId, targetType, targetId, reason, note]
    );

    res.status(201).json({ message: "Laporan berhasil dikirim" });
  } catch (err) {
    console.error("❌ Gagal mengirim laporan:", err);
    res.status(500).json({ error: "Gagal mengirim laporan" });
  }
});

// ===============================
// POST: Record view pada berita
// ===============================
router.post("/news/:id/view", async (req, res) => {
  const newsId = req.params.id;
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ message: "User ID required" });
  if (isNaN(newsId))
    return res.status(400).json({ message: "Invalid news ID" });

  try {
    const [check] = await pool.query(
      "SELECT * FROM views WHERE user_id = ? AND news_id = ?",
      [userId, newsId]
    );

    if (check.length === 0) {
      await pool.query("INSERT INTO views (user_id, news_id) VALUES (?, ?)", [
        userId,
        newsId,
      ]);
      return res.json({ message: "View recorded", viewed: true });
    }

    res.json({ message: "Already viewed", viewed: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// GET: Ambil semua berita
// ===============================
router.get("/news", async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM news");
    res.json(results);
  } catch (err) {
    console.error("❌ Error fetching news:", err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

// ===============================
// GET: Ambil berita berdasarkan ID
// ===============================
router.get("/news/:id", async (req, res) => {
  const newsId = req.params.id;
  try {
    const [results] = await pool.query("SELECT * FROM news WHERE id = ?", [
      newsId,
    ]);
    if (results.length === 0) {
      return res.status(404).json({ error: "News not found" });
    }
    res.json(results[0]);
  } catch (err) {
    console.error("❌ Error fetching news by ID:", err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

// ===============================
// POST: Tambah berita baru
// ===============================
router.post("/news", async (req, res) => {
  const { title, description, imageUrl, category } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ error: "Semua field wajib diisi!" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO news (title, summary, image, category) VALUES (?, ?, ?, ?)",
      [title, description, imageUrl, category]
    );

    res.status(201).json({
      message: "✅ Berita berhasil ditambahkan",
      newsId: result.insertId,
    });
  } catch (err) {
    console.error("❌ Error saat menyimpan berita:", err);
    res.status(500).json({ error: "Gagal menyimpan berita" });
  }
});

// ===============================
// GET: Ambil berita trending berdasarkan jumlah like
// ===============================
router.get("/trending", async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        n.id,
        n.title,
        n.image AS imageurl,
        n.summary AS description,
        DATE_FORMAT(n.time, '%Y-%m-%dT%H:%i:%sZ') AS time,
        COALESCE(l.likeCount, 0) AS totalLikes
      FROM news n
      LEFT JOIN (
        SELECT news_id, COUNT(*) AS likeCount
        FROM likes
        GROUP BY news_id
      ) l ON l.news_id = n.id
      ORDER BY totalLikes DESC
      LIMIT 3
    `);
    res.json(results);
  } catch (err) {
    console.error("❌ Error fetching trending news:", err);
    res.status(500).json({ error: "Gagal mengambil berita trending" });
  }
});

module.exports = router;
