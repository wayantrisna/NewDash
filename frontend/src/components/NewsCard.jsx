import React from "react";
import { Link } from "react-router-dom";
import "../styles/Newscard.css";

function NewsCard({ id, title, date, imageUrl }) {
  return (
    <Link to={`/news/${id}`} className="news-card">
      <img src={imageUrl} alt={title} className="news-image" />
      <div className="news-content">
        <h4 className="news-title">{title}</h4>
        <p className="news-date">{date}</p>
      </div>
    </Link>
  );
}

export default NewsCard;
