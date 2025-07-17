import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/KategoriDetailPage.css";

function Technology() {
  const techNewsList = [
    {
      id: 1,
      title: "AI Revolutionizes Healthcare",
      description:
        "AI membantu dokter mendiagnosa penyakit lebih cepat dan akurat.",
      imageUrl: "https://via.placeholder.com/600x300",
      date: "18 Juni 2025",
    },
    {
      id: 2,
      title: "Startup Indonesia Ciptakan Mobil Terbang",
      description:
        "Prototipe mobil terbang pertama akan diuji coba di Jakarta.",
      imageUrl: "https://via.placeholder.com/600x300",
      date: "15 Juni 2025",
      highlight: true,
    },
  ];

  return (
    <div className="category-layout">
      <Navbar />
      <div className="main-content">
        <div className="category-content">
          <div className="category-news">
            {techNewsList.map((news) => (
              <Link
                to={`/news/${news.id}`}
                key={news.id}
                className={`category-news-card ${
                  news.highlight ? "highlight" : ""
                }`}
              >
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  className="category-news-img"
                />
                <h2>{news.title}</h2>
                <p>{news.description}</p>
                <p className="news-date">{news.date}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Technology;
