import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import "./Createberita.css";

function Createberita() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);

    try {
      const response = await fetch(`${config.API_BASE_URL}/api/news`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Gagal menyimpan berita");
      await response.json();

      // Simulasi loading 2 detik
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);

        // Setelah 2 detik sukses, redirect
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }, 2000);
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Gagal menyimpan berita.");
      setIsLoading(false);
    }
  };

  return (
    <div className="create-news-wrapper">
      <div className="create-news-container">
        <h2 className="create-news-title">Create Berita</h2>

        {isLoading && <p style={{ color: "blue" }}>⏳ Menyimpan berita...</p>}
        {isSuccess && (
          <p style={{ color: "green", marginTop: "1rem" }}>
            ✅ Berita berhasil disimpan!
          </p>
        )}

        <form onSubmit={handleSubmit} className="create-news-form">
          <label>Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={isLoading}
          />

          <label>Description</label>
          <textarea
            name="description"
            placeholder="Enter description"
            value={formData.description}
            onChange={handleChange}
            required
            disabled={isLoading}
          ></textarea>

          <label>Image URL</label>
          <input
            type="text"
            name="imageUrl"
            placeholder="Enter image URL"
            value={formData.imageUrl}
            onChange={handleChange}
            disabled={isLoading}
          />

          <label>Kategori</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            disabled={isLoading}
          >
            <option value="">Pilih Kategori</option>
            <option value="Politik">Politik</option>
            <option value="Teknologi">Teknologi</option>
            <option value="Olahraga">Olahraga</option>
            <option value="Umum">Umum</option>
          </select>

          <button type="submit" disabled={isLoading || isSuccess}>
            {isLoading ? "Loading..." : "Submit News"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Createberita;
