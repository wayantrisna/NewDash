import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import "./styles/ContentManagement.css";

function ArticleManagement() {
  const [articles, setArticles] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isFetching, setIsFetching] = useState(false); // loading saat buka halaman
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setIsFetching(true);
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/admin/news/all`);
      if (!res.ok) throw new Error("Gagal mengambil data artikel");
      const data = await res.json();
      setArticles(data);
    } catch (err) {
      console.error("Gagal fetch artikel:", err);
    } finally {
      setIsFetching(false);
    }
  };

  const confirmDelete = (article) => {
    setSelectedArticle(article);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedArticle) return;

    setIsDeleting(true);
    setShowModal(false);

    try {
      const res = await fetch(
        `${config.API_BASE_URL}/api/admin/news/${selectedArticle.id}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        await fetchArticles();
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setIsDeleting(false);
        }, 2000);
      } else {
        console.error("Gagal menghapus artikel");
        setIsDeleting(false);
      }
    } catch (err) {
      console.error("Gagal menghapus artikel:", err);
      setIsDeleting(false);
    } finally {
      setSelectedArticle(null);
    }
  };

  return (
    <div className="contentmanagement">
      {(isFetching || isDeleting || isSuccess) && (
        <div className="overlay">
          <div className="spinner"></div>
          {isSuccess && (
            <p className="success-message">Artikel berhasil dihapus!</p>
          )}
        </div>
      )}

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

      {!isFetching && (
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
                      disabled={isDeleting}
                    >
                      {isDeleting && selectedArticle?.id === item.id
                        ? "Menghapus..."
                        : "Hapus"}
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
      )}

      {showModal && selectedArticle && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Konfirmasi Hapus</h3>
            <p>
              Yakin ingin menghapus artikel{" "}
              <strong>{selectedArticle.title}</strong>?
            </p>
            <div className="modal-actions">
              <button
                onClick={handleDelete}
                className="delete-confirm-button"
                disabled={isDeleting}
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="cancel-button"
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

export default ArticleManagement;
