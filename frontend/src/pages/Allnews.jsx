import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import config from "../config";
import "../styles/Allnews.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AllNews() {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/api/news`)
      .then((res) => res.json())
      .then((data) => {
        // Urutkan berdasarkan waktu terbaru
        const sorted = data.sort((a, b) => new Date(b.time) - new Date(a.time));
        setNewsList(sorted);

        const nullCategory = sorted.filter((item) => item.category === "NULL");
        console.log("📦 Total berita:", sorted.length);
        console.log("❌ Berita dengan category NULL:", nullCategory.length);
      })
      .catch((err) => console.error("❌ Gagal fetch news:", err));
  }, []);

  if (newsList.length === 0) return <p>Loading...</p>;

  const featuredNews = newsList[0];
  const otherNews = newsList.slice(1);

  const getCategoryClass = (cat) => {
    const lower = cat?.toLowerCase();
    return lower !== "null" ? lower : "umum";
  };

  const getCategoryText = (cat) => (cat !== "NULL" ? cat : "Umum");

  const formatTime = (time) => {
    const newsTime = new Date(time);
    const now = new Date();
    const diffMs = now - newsTime;
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffMinutes < 60) return `${diffMinutes} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    return newsTime.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="all-news-wrapper">
      <Navbar />

      <main className="all-news-container">
        {/* Berita Utama */}
        <div className="featured-news">
          <img
            src={featuredNews.image || "/fallback.jpg"}
            alt={featuredNews.title || "Judul tidak tersedia"}
          />
          <div className="featured-news-content">
            <div className="top-info">
              <span
                className={`category-label ${getCategoryClass(
                  featuredNews.category
                )}`}
              >
                {getCategoryText(featuredNews.category)}
              </span>
              <span className="time-text">{formatTime(featuredNews.time)}</span>
            </div>
            <h2>{featuredNews.title || "Judul tidak tersedia"}</h2>
            <p className="summary">
              {featuredNews.summary
                ? featuredNews.summary.length > 150
                  ? featuredNews.summary.slice(0, 150) + "..."
                  : featuredNews.summary
                : "Ringkasan tidak tersedia."}
            </p>

            <div className="bottom-info">
              <Link to={`/news/${featuredNews.id}`} className="read-more">
                Baca Selengkapnya
              </Link>
            </div>
          </div>
        </div>

        {/* Berita Lainnya */}
        <div className="news-grid">
          {otherNews.map((news) => (
            <div key={news.id} className="news-card">
              <img
                src={news.image || "/fallback.jpg"}
                alt={news.title || "Judul tidak tersedia"}
              />
              <div className="news-info">
                <div className="top-info">
                  <span
                    className={`category-label ${getCategoryClass(
                      news.category
                    )}`}
                  >
                    {getCategoryText(news.category)}
                  </span>
                  <span className="time-text">{formatTime(news.time)}</span>
                </div>
                <h3>{news.title || "Judul tidak tersedia"}</h3>
                <p className="summary">
                  {news.summary
                    ? news.summary.length > 100
                      ? news.summary.slice(0, 100) + "..."
                      : news.summary
                    : "Ringkasan tidak tersedia."}
                </p>

                <div className="bottom-info">
                  <Link to={`/news/${news.id}`} className="read-more-small">
                    Baca Selengkapnya
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AllNews;
