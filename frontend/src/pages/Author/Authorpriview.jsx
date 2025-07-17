import React, { useState, useEffect } from "react";
import { AiOutlineFileAdd } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import "./styles/Authorpriview.css";

const API_URL = config.API_BASE_URL || "${config.API_BASE_URL}";

function Authorpriview() {
  const navigate = useNavigate();
  const [myArticles, setMyArticles] = useState([]);
  const [totalArticles, setTotalArticles] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [loading, setLoading] = useState(true);

  const localUser = JSON.parse(localStorage.getItem("user"));
  const userId = localUser?.id;

  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId]);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchMyArticles(), fetchAuthorStats()]);
    setLoading(false);
  };

  const fetchMyArticles = async () => {
    try {
      const res = await fetch(`${API_URL}/api/news/mine?userId=${userId}`);
      if (!res.ok) throw new Error("Gagal mengambil artikel");
      const data = await res.json();
      setMyArticles(data);
    } catch (err) {
      console.error("❌ Gagal ambil artikel:", err.message);
    }
  };

  const fetchAuthorStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/news/stats?userId=${userId}`);
      if (!res.ok) throw new Error("Gagal mengambil statistik");
      const data = await res.json();
      setTotalArticles(data.totalArticles || 0);
      setTotalViews(data.totalViews || 0);
      setTotalLikes(data.totalLikes || 0);
      setTotalComments(data.totalComments || 0);
    } catch (err) {
      console.error("❌ Gagal ambil statistik:", err.message);
    }
  };

  const handleCreateArticle = () => {
    navigate("/author/create");
  };

  const handleNavigateToDetail = (id) => {
    navigate(`/news/${id}`);
  };

  if (loading) return <div>Memuat data...</div>;

  return (
    <div className="author-priview-container">
      <h2>Statistik Saya</h2>
      <div className="author-stat-boxes">
        <div className="author-stat-card blue">
          <h3>Artikel</h3>
          <p>{totalArticles}</p>
        </div>
        <div className="author-stat-card green">
          <h3>Views</h3>
          <p>{totalViews}</p>
        </div>
        <div className="author-stat-card purple">
          <h3>Likes</h3>
          <p>{totalLikes}</p>
        </div>
        <div className="author-stat-card orange">
          <h3>Komentar</h3>
          <p>{totalComments}</p>
        </div>
      </div>

      <div className="author-quick-actions">
        <button className="author-btn" onClick={handleCreateArticle}>
          <AiOutlineFileAdd /> Tulis Artikel Baru
        </button>
      </div>

      <div className="author-latest-articles">
        <h3>Artikel Saya</h3>
        {myArticles.length === 0 ? (
          <p>Belum ada artikel.</p>
        ) : (
          <ul>
            {myArticles.map((article) => (
              <li
                key={article.id}
                onClick={() => handleNavigateToDetail(article.id)}
              >
                <img
                  src={
                    article.image || "https://source.unsplash.com/50x50/?news"
                  }
                  alt="news"
                />
                <div>
                  <h4>{article.title}</h4>
                  <small>
                    {article.category} • {article.views ?? 0} views •{" "}
                    {article.totalLikes ?? 0} likes •{" "}
                    {article.totalComments ?? 0} comments
                  </small>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Authorpriview;
