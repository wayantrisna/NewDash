import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import config from "../../config";
import "../Bookmark/Bookmark.css";

function BookmarkPage() {
  const [bookmarkedNews, setBookmarkedNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage] = useState(10);
  const navigate = useNavigate();
  const hasFetchedRef = useRef(false);

  const userId =
    JSON.parse(localStorage.getItem("user"))?.id ||
    JSON.parse(sessionStorage.getItem("user"))?.id;

  useEffect(() => {
    if (!userId) {
      console.warn("User belum login, redirect ke login.");
      navigate("/login");
      return;
    }

    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    console.log("🔎 Fetching bookmarks for userId:", userId);

    fetch(`${config.API_BASE_URL}/api/interaction/bookmarks/user/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const updated = data.map((item) => ({
          ...item,
          category: item.category || "Umum",
          timeAgo: getTimeAgo(item.time),
        }));
        setBookmarkedNews(updated);
      })
      .catch((err) => console.error("❌ Error fetching bookmarks:", err));
  }, [userId, navigate]);

  const filteredNews =
    selectedCategory === "Semua Kategori"
      ? bookmarkedNews
      : bookmarkedNews.filter(
          (n) => n.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = filteredNews.slice(indexOfFirstNews, indexOfLastNews);
  const totalPages = Math.ceil(filteredNews.length / newsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bookmarks-layout">
      <Navbar />
      <main className="bookmarks-content">
        <div className="bookmark-header">
          <div>
            <h2>Bookmark Saya</h2>
            <p>Artikel yang telah Anda simpan untuk dibaca nanti</p>
          </div>
          <div className="bookmark-filter">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option>Semua Kategori</option>
              <option>Politik</option>
              <option>Teknologi</option>
              <option>Olahraga</option>
              <option>Umum</option>
            </select>
          </div>
        </div>

        <div className="bookmark-list">
          {currentNews.length === 0 ? (
            <p className="no-bookmark">Tidak ada berita yang dibookmark.</p>
          ) : (
            currentNews.map((news) => (
              <Link
                to={`/news/${news.id}`}
                key={news.id}
                className="bookmark-card"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="bookmark-thumbnail">
                  <img
                    src={
                      news.image?.startsWith("http")
                        ? news.image
                        : `${config.API_BASE_URL}/uploads/${news.image}`
                    }
                    alt={news.title}
                  />
                </div>

                <div className="bookmark-card-body">
                  <div className="bookmark-meta">
                    <span className={`tag ${news.category.toLowerCase()}`}>
                      {news.category}
                    </span>
                    <span className="time">{news.timeAgo}</span>
                  </div>
                  <h3 className="bookmark-title">{news.title}</h3>
                  <p className="bookmark-summary">
                    {news.summary?.length > 100
                      ? news.summary.slice(0, 100) + "..."
                      : news.summary}
                  </p>
                  <div className="bookmark-footer">
                    <span className="source">{news.source}</span>
                    <span className="bookmark-icon">🔖</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={currentPage === index + 1 ? "active" : ""}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function getTimeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Baru saja";
  if (diffHours < 24) return `${diffHours} jam lalu`;
  return `${diffDays} hari lalu`;
}

export default BookmarkPage;
