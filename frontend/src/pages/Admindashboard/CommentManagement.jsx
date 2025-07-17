import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";
import "./styles/CommentManagement.css";

export default function CommentManagement() {
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/api/comments`);
      setComments(response.data);
    } catch (error) {
      console.error("Gagal mengambil komentar:", error);
    }
  };

  const confirmDelete = (id) => {
    setSelectedCommentId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${config.API_BASE_URL}/api/comments/${selectedCommentId}`
      );
      setComments((prev) =>
        prev.filter((comment) => comment.id !== selectedCommentId)
      );
      setShowModal(false);
      setSelectedCommentId(null);
    } catch (error) {
      console.error("Gagal menghapus komentar:", error);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setSelectedCommentId(null);
  };

  return (
    <div className="comments-container">
      <div className="header-actions">
        <h1>Manajemen Komentar</h1>
        <button onClick={() => window.history.back()} className="back-btn">
          ⬅ Kembali ke Dashboard
        </button>
      </div>

      <table className="comments-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Komentar</th>
            <th>Berita</th>
            <th>Tanggal</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => (
            <tr key={comment.id}>
              <td>
                <img
                  src={comment.userAvatar || "/default-avatar.png"}
                  alt="avatar"
                  className="avatar"
                />
                {comment.username}
              </td>
              <td>{comment.content}</td>
              <td>{comment.newsTitle}</td>
              <td>{new Date(comment.createdAt).toLocaleString()}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => confirmDelete(comment.id)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL KONFIRMASI */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Konfirmasi Hapus</h2>
            <p>Apakah Anda yakin ingin menghapus komentar ini?</p>
            <div className="modal-actions">
              <button onClick={handleDelete} className="confirm-btn">
                Ya, hapus
              </button>
              <button onClick={cancelDelete} className="cancel-btn">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
