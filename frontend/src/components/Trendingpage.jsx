import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../TrendingPage/TrendingPage.css"; // Pastikan untuk membuat file CSS ini

function TrendingPage() {
  const [trendingTopics, setTrendingTopics] = useState([]);

  useEffect(() => {
    // Mengambil data trending dari API
    fetch("${config.API_BASE_URL}/api/trending") // Ganti dengan endpoint yang sesuai
      .then((response) => response.json())
      .then((data) => setTrendingTopics(data))
      .catch((error) =>
        console.error("Error fetching trending topics:", error)
      );
  }, []);

  return (
    <div className="trending-layout">
      <Navbar />
      <div className="trending-content">
        <h2 className="section-title">Trending Topics</h2>
        <div className="trending-topics">
          {trendingTopics.map((topic, index) => (
            <div className="trending-topic" key={index}>
              <span className="topic-rank">#{index + 1}</span>
              <span className="topic-name">{topic.name}</span>
              <span className="topic-tweets">{topic.tweets} tweets</span>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TrendingPage;
