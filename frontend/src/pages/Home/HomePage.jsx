import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import config from "../../config";
import "./Home.css";

function Home() {
  const [newsList, setNewsList] = useState([]);
  const [trendingNews, setTrendingNews] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [visibleCount, setVisibleCount] = useState(3);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/api/interaction/news/all`)
      .then((res) => res.json())
      .then((data) => setNewsList(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/api/trending`)
      .then((res) => res.json())
      .then((data) => setTrendingNews(data))
      .catch((err) => console.error("Error fetching trending:", err));
  }, []);

  const handleSearchKeyword = () => {
    setSearchKeyword(searchInput.trim());
  };

  const validNews = newsList
    .filter(
      (item) =>
        item.title &&
        item.summary &&
        item.image &&
        item.category &&
        item.category !== "NULL"
    )
    .sort((a, b) => new Date(b.time) - new Date(a.time));

  const filteredByCategory = validNews
    .filter((item) =>
      categoryFilter === "Semua" ? true : item.category === categoryFilter
    )
    .sort((a, b) => new Date(b.time) - new Date(a.time));

  const filteredBySearch = validNews.filter((item) =>
    item.title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="home-layout">
      <Navbar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSearch={handleSearchKeyword}
      />

      <div className="container">
        <section className="trending">
          <h2 className="trending-title">Trending</h2>
          <p className="trending-subtitle">Berita paling populer</p>
          <div className="trending-grid">
            {Array.isArray(trendingNews) ? (
              trendingNews.map((item, idx) => (
                <Link
                  to={`/news/${item.id}`}
                  className="trending-card"
                  key={item.id}
                >
                  <img src={item.imageurl} alt={item.title} />
                  <span className="tag red">Trending #{idx + 1}</span>
                  <h4>{item.title}</h4>
                  <p>{item.description.slice(0, 100)}...</p>
                  <div className="meta">
                    ⏱{" "}
                    {item.date || item.time
                      ? new Date(item.date || item.time).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "Baru saja"}
                  </div>
                </Link>
              ))
            ) : (
              <p style={{ color: "red" }}>Gagal memuat berita trending.</p>
            )}
          </div>
        </section>

        <section className="berita-terbaru">
          <div className="section-header">
            <h3>Berita Terbaru</h3>
          </div>

          {filteredBySearch.length === 0 && (
            <p style={{ textAlign: "center", marginTop: "1rem" }}>
              Tidak ditemukan berita dengan judul:{" "}
              <strong>{searchKeyword}</strong>
            </p>
          )}

          <div className="terbaru-grid">
            {filteredBySearch.slice(0, 3).map((item) => (
              <Link
                to={`/news/${item.id}`}
                className="news-card-terbaru"
                key={item.id}
              >
                <div className="news-image-wrap">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="news-info">
                  <span
                    className={`tag ${item.category?.toLowerCase().trim()}`}
                  >
                    {item.category}
                  </span>
                  <h4>{item.title}</h4>
                  <p>{item.summary.slice(0, 100)}...</p>
                  <div className="meta">
                    ⏱{" "}
                    {new Date(item.time).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    • 👁 {item.views}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredBySearch.length > 3 && (
            <div className="see-more">
              <Link to="/all-news" className="primary-button">
                Lihat Selengkapnya →
              </Link>
            </div>
          )}
        </section>

        <section className="kategori-berita">
          <h3>Kategori Berita</h3>
          <div className="category-buttons">
            {["Semua", "Politik", "Teknologi", "Olahraga", "Umum"].map(
              (cat) => (
                <button
                  key={cat}
                  className={`category-button ${
                    categoryFilter === cat ? "active" : ""
                  }`}
                  onClick={() => {
                    setCategoryFilter(cat);
                    setVisibleCount(3);
                  }}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          <div className="card-grid">
            {filteredByCategory.slice(0, visibleCount).map((item) => (
              <Link to={`/news/${item.id}`} className="news-card" key={item.id}>
                <img src={item.image} alt={item.title} />
                <div className="content">
                  <span
                    className={`tag ${item.category?.toLowerCase().trim()}`}
                  >
                    {item.category}
                  </span>
                  <h4>{item.title}</h4>
                  <div className="meta">
                    ⏱{" "}
                    {new Date(item.time).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    • 👁 {item.views}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {visibleCount < filteredByCategory.length && (
            <div className="load-more">
              <button
                onClick={() => setVisibleCount(visibleCount + 3)}
                className="primary-button"
              >
                Muat Lainnya →
              </button>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
