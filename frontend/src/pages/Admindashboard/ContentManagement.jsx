import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import "./styles/ContentManagement.css";

function ArticleManagement() {
  const [articles, setArticles] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/admin/news/all`);
      if (!res.ok) throw new Error("Gagal mengambil data artikel");
      const data = await res.json();
      setArticles(data);
    } catch (err) {
      console.error("Gagal fetch artikel:", err);
    }
  };

  const confirmDelete = (article) => {
    setSelectedArticle(article);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${config.API_BASE_URL}/api/admin/news/${selectedArticle.id}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        fetchArticles();
        alert("Artikel berhasil dihapus");
      } else {
        alert("Gagal menghapus artikel");
      }
    } catch (err) {
      console.error("Gagal menghapus artikel:", err);
      alert("Terjadi kesalahan saat menghapus artikel");
    } finally {
      setShowModal(false);
      setSelectedArticle(null);
    }
  };

  return (
    <div className="contentmanagement">
      <h2 className="page-title">Manajemen Artikel</h2>

      <div className="top-bar">
        <button
          className="show-all-button"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Tampilkan Lebih Sedikit" : "Tampilkan Semua"}
        </button>
        <button
          className="back-button"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← Kembali ke Dashboard
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Judul</th>
            <th>Kategori</th>
            <th>Gambar</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(articles) && articles.length > 0 ? (
            (showAll ? articles : articles.slice(0, 10)).map((item) => (
              <tr key={item.id || item.title}>
                <td>{item.title || "-"}</td>
                <td>{item.category || "-"}</td>
                <td>
                  {item.image ? (
                    <img src={item.image} alt="thumbnail" width={50} />
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => confirmDelete(item)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Tidak ada data</td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && selectedArticle && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Konfirmasi Hapus</h3>
            <p>
              Yakin ingin menghapus artikel{" "}
              <strong>{selectedArticle.title}</strong>?
            </p>
            <div className="modal-actions">
              <button onClick={handleDelete} className="confirm-button">
                Ya, Hapus
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="cancel-button"
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

export default ArticleManagement;
