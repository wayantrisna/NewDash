import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import config from "../../../config";
import "./Styles/NewsSection.css";

const API_URL = config.API_BASE_URL;

const NewsSection = ({ newsId }) => {
  const [news, setNews] = useState(null);
  const [userId, setUserId] = useState(null);
  const hasRecordedView = useRef(false); // Flag agar view hanya dicatat sekali

  // Ambil userId dari localStorage atau sessionStorage
  useEffect(() => {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (user && user.id) {
      setUserId(user.id);
    }
  }, []);

  // Ambil detail berita
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/news/${newsId}`);
        setNews(res.data);
      } catch (err) {
        console.error("❌ Gagal mengambil detail berita:", err);
      }
    };

    if (newsId) {
      fetchNews();
    }
  }, [newsId]);

  // Catat view hanya sekali & hanya jika userId tersedia
  useEffect(() => {
    const recordView = async () => {
      try {
        await fetch(`${API_URL}/api/news/${newsId}/view`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId, // Akan null jika tidak login
          }),
        });
        console.log("✅ View tercatat untuk berita:", newsId);
      } catch (err) {
        console.error("❌ Gagal mencatat view:", err);
      }
    };

    if (newsId && userId && !hasRecordedView.current) {
      recordView();
      hasRecordedView.current = true;
    }
  }, [newsId, userId]);

  const estimateReadTime = (text) => {
    const wordsPerMinute = 200;
    const textLength = text.split(" ").length;
    return Math.ceil(textLength / wordsPerMinute);
  };

  if (!news) return <p>Memuat detail berita...</p>;

  const readTime = estimateReadTime(news.summary || "");

  return (
    <div className="news-detail-section">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <a href="/">Beranda</a> &gt;{" "}
        <a href={`/kategori/${news.category?.toLowerCase()}`}>
          {news.category?.toUpperCase() || "UMUM"}
        </a>{" "}
        &gt; <span>{news.title}</span>
      </div>

      {/* Meta Info */}
      <div className="meta-top">
        <span className={`tag ${news.category?.toLowerCase().trim()}`}>
          {news.category}
        </span>
        <span className="dot">•</span>
        <span>
          {news.time
            ? new Date(news.time).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "-"}
        </span>
        <span className="dot">•</span>
        <span>{readTime} menit baca</span>
      </div>

      {/* Judul */}
      <h1 className="news-title">{news.title}</h1>

      {/* Gambar */}
      <div className="news-image">
        <img src={news.image} alt={news.title} />
      </div>

      {/* Isi Berita */}
      <div className="news-content">
        <p className="intro">{news.summary}</p>
        {news.content?.split("\n").map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>

      <hr className="divider" />
    </div>
  );
};

export default NewsSection;
