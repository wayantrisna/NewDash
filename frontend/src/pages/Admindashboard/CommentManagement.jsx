import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";
import "./styles/CommentManagement.css";

export default function CommentManagement() {
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${config.API_BASE_URL}/api/comments`);
      setComments(response.data);
    } catch (error) {
      console.error("Gagal mengambil komentar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setSelectedCommentId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedCommentId) return;

    setIsDeleting(true);
    try {
      await axios.delete(
        `${config.API_BASE_URL}/api/comments/${selectedCommentId}`
      );
      setComments((prev) =>
        prev.filter((comment) => comment.id !== selectedCommentId)
      );
      setSuccessMessage("✅ Komentar berhasil dihapus.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Gagal menghapus komentar:", error);
    } finally {
      setIsDeleting(false);
      setShowModal(false);
      setSelectedCommentId(null);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setSelectedCommentId(null);
  };

  return (
    <div className="comments-container">
      {(isLoading || isDeleting) && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}

      <div className="header-actions">
        <h1>Manajemen Komentar</h1>
        <button onClick={() => window.history.back()} className="back-btn">
          ⬅ Kembali ke Dashboard
        </button>
      </div>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {!isLoading && (
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
            {comments.length > 0 ? (
              comments.map((comment) => (
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
                      disabled={isDeleting}
                    >
                      {isDeleting && selectedCommentId === comment.id
                        ? "Menghapus..."
                        : "Hapus"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Tidak ada komentar ditemukan.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Konfirmasi Hapus</h2>
            <p>Apakah Anda yakin ingin menghapus komentar ini?</p>
            <div className="modal-actions">
              <button
                onClick={handleDelete}
                className="confirm-btn"
                disabled={isDeleting}
              >
                {isDeleting ? "Menghapus..." : "Ya, hapus"}
              </button>
              <button
                onClick={cancelDelete}
                className="cancel-btn"
                disabled={isDeleting}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
