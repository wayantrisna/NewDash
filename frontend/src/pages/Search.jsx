import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import config from "../config";
import "./Home/Home.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResult() {
  const query = useQuery();
  const keyword = query.get("keyword") || "";
  const [newsList, setNewsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 6;

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/api/news`)
      .then((res) => res.json())
      .then((data) => setNewsList(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  const filteredNews = newsList.filter(
    (item) =>
      item.title?.toLowerCase().includes(keyword.toLowerCase()) &&
      item.title &&
      item.summary &&
      item.image &&
      item.category &&
      item.category !== "NULL"
  );

  // Pagination logic
  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = filteredNews.slice(indexOfFirstNews, indexOfLastNews);
  const totalPages = Math.ceil(filteredNews.length / newsPerPage);

  return (
    <div className="home-layout">
      <Navbar />
      <div className="container">
        <h2>
          Hasil Pencarian untuk: <strong>{keyword}</strong>
        </h2>

        {filteredNews.length === 0 ? (
          <p style={{ marginTop: "20px", textAlign: "center" }}>
            Tidak ditemukan berita dengan judul tersebut.
          </p>
        ) : (
          <>
            <div className="card-grid">
              {currentNews.map((item) => (
                <Link
                  to={`/news/${item.id}`}
                  key={item.id}
                  className="news-card"
                >
                  <img src={item.image} alt={item.title} />
                  <div className="content">
                    <span
                      className={`tag ${item.category?.toLowerCase().trim()}`}
                    >
                      {item.category}
                    </span>
                    <h4>{item.title}</h4>
                    <p>{item.summary.slice(0, 100)}...</p>
                    <div className="meta">
                      <span>📰</span>{" "}
                      {new Date(item.time).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      • <span>👁</span> {item.views || 0}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={currentPage === index + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
