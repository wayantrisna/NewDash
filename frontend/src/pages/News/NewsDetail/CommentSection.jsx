import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { nestComments } from "./Hook/nestComment";
import config from "../../../config";
import "./Styles/CommentSection.css";

function CommentSection({ newsId }) {
  const [comments, setComments] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [commentText, setCommentText] = useState("");

  const navigate = useNavigate();

  const sessionUser = JSON.parse(sessionStorage.getItem("user"));
  const localUser = JSON.parse(localStorage.getItem("user"));
  const userId = sessionUser?.id || localUser?.id;

  const fetchComments = useCallback(async () => {
    try {
      const res = await axios.get(
        `${config.API_BASE_URL}/api/comments/news/${newsId}`
      );
      const nested = nestComments(res.data);
      setComments(nested);
    } catch (err) {
      console.error("Gagal mengambil komentar:", err);
    }
  }, [newsId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentSubmit = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    if (!commentText.trim()) return;

    try {
      await axios.post(`${config.API_BASE_URL}/api/comments`, {
        userId,
        newsId,
        commentText,
      });
      setCommentText("");
      fetchComments();
    } catch (err) {
      console.error("Gagal mengirim komentar:", err);
    }
  };

  const renderComments = (commentList, depth = 0) => {
    return commentList
      .slice(0, depth === 0 ? visibleCount : commentList.length)
      .map((comment) => (
        <div
          key={comment.id}
          className="comment-item"
          style={{ marginLeft: depth * 20 }}
        >
          <div className="comment-header">
            <img
              src={comment.profileImage || "/default-avatar.png"}
              alt={comment.username}
              className="comment-avatar"
            />
            <div className="comment-body">
              <span className="username">{comment.username}</span>
              <p className="comment-text">{comment.commentText}</p>
            </div>
          </div>
        </div>
      ));
  };

  return (
    <div className="comment-section">
      <h3>Komentar Pembaca ({comments.length})</h3>

      <div className="comment-input">
        <textarea
          placeholder="Tulis komentar Anda..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button onClick={handleCommentSubmit}>Kirim</button>
      </div>

      <div className="comments-list">{renderComments(comments)}</div>

      {visibleCount < comments.length && (
        <div className="load-more-wrapper">
          <button onClick={() => setVisibleCount((prev) => prev + 2)}>
            Muat Komentar Lainnya
          </button>
        </div>
      )}
    </div>
  );
}

export default CommentSection;
