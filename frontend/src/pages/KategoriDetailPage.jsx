import React from "react";
import { useParams } from "react-router-dom";

// Contoh data artikel, sebaiknya Anda ambil dari API atau data yang sudah ada
const articles = [
  {
    id: 1,
    title: "Inovasi Terbaru di Teknologi",
    content: "Berita tentang inovasi terbaru di bidang teknologi.",
    category: "Teknologi",
  },
  {
    id: 2,
    title: "Pertandingan Akbar Olahraga",
    content: "Berita tentang pertandingan olahraga terbaru.",
    category: "Olahraga",
  },
  {
    id: 3,
    title: "Film Terbaru di Dunia Hiburan",
    content: "Berita tentang film terbaru yang tayang di bioskop.",
    category: "Umum",
  },
];

function DetailPage() {
  const { id } = useParams(); // Mengambil id dari URL
  const article = articles.find((article) => article.id === parseInt(id)); // Mencari artikel berdasarkan id

  if (!article) {
    return <div>Artikel tidak ditemukan.</div>; // Menangani kasus jika artikel tidak ada
  }

  return (
    <div className="container">
      <div className="content">
        <h1>{article.title}</h1>
        <p>{article.content}</p>
        <p>Kategori: {article.category}</p>
      </div>
    </div>
  );
}

export default DetailPage;
