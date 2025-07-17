import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import "../Create/Createberita.css";

function Createberita() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "", // Tambahkan kategori di sini
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${config.API_BASE_URL}/api/news`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan berita");
      }

      await response.json();
      alert("✅ Berita berhasil disimpan!");
      navigate("/");
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Gagal menyimpan berita.");
    }
  };

  return (
    <div className="create-news-wrapper">
      <div className="create-news-container">
        <h2 className="create-news-title">Create Berita</h2>
        <form onSubmit={handleSubmit} className="create-news-form">
          <label>Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            placeholder="Enter description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>

          <label>Image URL</label>
          <input
            type="text"
            name="imageUrl"
            placeholder="Enter image URL"
            value={formData.imageUrl}
            onChange={handleChange}
          />

          <label>Kategori</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Pilih Kategori</option>
            <option value="Politik">Politik</option>
            <option value="Teknologi">Teknologi</option>
            <option value="Olahraga">Olahraga</option>
            <option value="Umum">Umum</option>
          </select>

          <button type="submit">Submit News</button>
        </form>
      </div>
    </div>
  );
}

export default Createberita;
