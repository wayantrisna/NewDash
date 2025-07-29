import React, { useState, useEffect } from "react";
import { AiOutlineFileAdd } from "react-icons/ai";
import { FaUserFriends, FaTags } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import "./styles/DashboardOverview.css";

const API_URL = config.API_BASE_URL || "${config.API_BASE_URL}";

function DashboardOverview() {
  const navigate = useNavigate();

  const [latestArticles, setLatestArticles] = useState([]);
  const [showAllArticles, setShowAllArticles] = useState(false);
  const [totalComments, setTotalComments] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllReports, setShowAllReports] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchArticles(),
      fetchTotalComments(),
      fetchTotalViews(),
      fetchTotalUsers(),
      fetchReports(),
    ]).finally(() => setLoading(false));
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch(`${API_URL}/api/news`);
      if (!res.ok) throw new Error("Failed to fetch articles");
      const data = await res.json();
      setLatestArticles(data.reverse());
    } catch (err) {
      console.error("❌ Error fetching articles:", err.message);
    }
  };

  const fetchTotalComments = async () => {
    try {
      const res = await fetch(`${API_URL}/api/comments/count`);
      if (!res.ok) throw new Error("Failed to fetch comments count");
      const data = await res.json();
      setTotalComments(data?.total ?? 0);
    } catch (err) {
      console.error("❌ Error fetching comments count:", err.message);
    }
  };

  const fetchTotalViews = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/news/total-views`);
      if (!res.ok) throw new Error("Failed to fetch total views");
      const data = await res.json();
      setTotalViews(data?.totalViews ?? 0);
    } catch (err) {
      console.error("❌ Error fetching total views:", err.message);
    }
  };

  const fetchTotalUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/count`);
      if (!res.ok) throw new Error("Failed to fetch total users");
      const data = await res.json();
      setTotalUsers(data?.totalUsers ?? 0);
    } catch (err) {
      console.error("❌ Error fetching total users:", err.message);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/reports`);
      if (!res.ok) throw new Error("Failed to fetch reports");
      const data = await res.json();
      console.log("📌 Data Reports:", data);
      setReports(data);
    } catch (err) {
      console.error("❌ Error fetching reports:", err.message);
    }
  };

  const handleCreateArticle = () => {
    navigate("/admin/create");
  };

  const toggleShowAll = () => {
    setShowAllArticles(!showAllArticles);
  };

  const toggleShowAllReports = () => {
    setShowAllReports(!showAllReports);
  };

  const handleNavigateToDetail = (id) => {
    navigate(`/news/${id}`);
  };

  const handleNavigateToReported = (report) => {
    if (report.targetType === "news") {
      navigate(`/news/${report.targetId}`);
    } else if (report.targetType === "comment" && report.newsId) {
      navigate(`/news/${report.newsId}#comment-${report.targetId}`);
    } else {
      alert("Target laporan tidak ditemukan.");
    }
  };

  const articlesToShow = showAllArticles
    ? latestArticles
    : latestArticles.slice(0, 3);

  const quickActions = [
    {
      icon: <AiOutlineFileAdd />,
      label: "Artikel Baru",
      onClick: handleCreateArticle,
    },
  ];

  if (loading)
    return (
      <div className="dashboard-loading-overlay">
        <div className="dashboard-spinner"></div>
      </div>
    );

  return (
    <div className="admin-dashboard-container">
      <div className="stat-boxes">
        <div className="stat-card blue">
          <h3>Total Artikel</h3>
          <p>{latestArticles.length}</p>
        </div>
        <div className="stat-card green">
          <h3>Total Views</h3>
          <p>{totalViews}</p>
        </div>
        <div className="stat-card purple">
          <h3>User</h3>
          <p>{totalUsers}</p>
        </div>
        <div className="stat-card orange">
          <h3>Komentar</h3>
          <p>{totalComments}</p>
        </div>
      </div>

      <div className="content-grid">
        <div className="latest-articles">
          <div className="section-header">
            <h3>Artikel Terbaru</h3>
            <button onClick={toggleShowAll} className="lihat-semua-btn">
              {showAllArticles ? "Sembunyikan" : "Lihat Semua"}
            </button>
          </div>
          <ul>
            {articlesToShow.map((article) => (
              <li
                key={article.id}
                onClick={() => handleNavigateToDetail(article.id)}
                style={{ cursor: "pointer" }}
              >
                {article.image && <img src={article.image} alt="news" />}
                <div>
                  <h4>{article.title}</h4>
                  <small>
                    {article.category} •{" "}
                    {article.time
                      ? new Date(article.time).toLocaleString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Baru saja"}
                  </small>
                  <span className="status published">Published</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="quick-actions">
          {quickActions.map((action, index) => (
            <button key={index} className="btn" onClick={action.onClick}>
              {action.icon} {action.label}
            </button>
          ))}
        </div>
      </div>

      <div className="recent-activities">
        <div className="section-header">
          <h3>Hasil Report</h3>
          <button onClick={toggleShowAllReports} className="lihat-semua-btn">
            {showAllReports ? "Sembunyikan" : "Lihat Semua"}
          </button>
        </div>
        <ul>
          {reports.length === 0 ? (
            <li>Tidak ada laporan</li>
          ) : (
            (showAllReports ? reports : reports.slice(0, 3)).map((report) => (
              <li
                key={report.id}
                onClick={() => handleNavigateToReported(report)}
                style={{ cursor: "pointer" }}
              >
                <div>
                  <strong>{report.reporterName || "Unknown User"}</strong>{" "}
                  melaporkan <em>{report.targetType}</em> dengan alasan:{" "}
                  <strong>{report.reason}</strong>
                  {report.note && (
                    <>
                      <br />
                      <small>Catatan: {report.note}</small>
                    </>
                  )}
                  <br />
                  <small>{new Date(report.createdAt).toLocaleString()}</small>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default DashboardOverview;
