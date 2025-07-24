import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReportButton from "../../../components/ReportButton";
import config from "../../../config";
import "./Styles/ActionButton.css";

function ActionButtons({ newsId }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = `${config.API_BASE_URL}/api/interaction`;

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  // 🧠 Utilitas: Cek login
  const checkLogin = () => {
    if (!userId) {
      navigate("/login");
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!userId || !newsId) return;

    const fetchStatus = async () => {
      try {
        const [likeRes, bookmarkRes] = await Promise.all([
          fetch(`${BASE_URL}/likes/check/${newsId}/${userId}`).then((res) =>
            res.json()
          ),
          fetch(`${BASE_URL}/bookmarks/check/${newsId}/${userId}`).then((res) =>
            res.json()
          ),
        ]);
        setIsLiked(likeRes.hasLiked);
        setIsBookmarked(bookmarkRes.hasBookmarked);
      } catch (err) {
        console.error("Gagal fetch status like/bookmark:", err);
      }
    };

    const fetchLikeCount = async () => {
      try {
        const res = await fetch(`${BASE_URL}/likes/count/${newsId}`);
        const data = await res.json();
        setLikeCount(data.likeCount || 0);
      } catch (err) {
        console.error("Gagal fetch jumlah like:", err);
      }
    };

    fetchStatus();
    fetchLikeCount();
  }, [newsId, userId, BASE_URL]);

  const handleLike = async () => {
    if (!checkLogin()) return;

    try {
      const endpoint = `${BASE_URL}/likes`;
      const method = isLiked ? "DELETE" : "POST";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, news_id: newsId }),
      });
      const data = await res.json();
      if (data.message || data.id) {
        setIsLiked(!isLiked);
        setLikeCount((prev) => prev + (isLiked ? -1 : 1));
      }
    } catch (err) {
      console.error("Gagal toggle like:", err);
    }
  };

  const handleBookmark = async () => {
    if (!checkLogin()) return;

    try {
      const endpoint = `${BASE_URL}/bookmarks`;
      const method = isBookmarked ? "DELETE" : "POST";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, news_id: newsId }),
      });
      const data = await res.json();
      if (data.message || data.id) {
        setIsBookmarked(!isBookmarked);
      }
    } catch (err) {
      console.error("Gagal toggle bookmark:", err);
    }
  };

  return (
    <div className="action-buttons">
      <button
        className={`like-button ${isLiked ? "liked" : ""}`}
        onClick={handleLike}
      >
        {isLiked ? `💖 ${likeCount}` : `👍 ${likeCount} Like`}
      </button>

      <button
        className={`bookmark-button ${isBookmarked ? "bookmarked" : ""}`}
        onClick={handleBookmark}
      >
        {isBookmarked ? "🔖 Bookmarked" : "🔖 Bookmark"}
      </button>

      <ReportButton
        userId={userId}
        targetType="news"
        targetId={newsId}
        onNotLoggedIn={() => navigate("/login")}
      />
    </div>
  );
}

export default ActionButtons;
