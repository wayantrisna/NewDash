import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import NewsSection from "./NewsSection";
import ActionButton from "./ActionButton";
import CommentSection from "./CommentSection";
import "./styles/NewsDetail.css";

const NewsDetail = () => {
  const { id } = useParams();
  const newsId = id;
  const userId =
    sessionStorage.getItem("userId") || localStorage.getItem("userId");

  return (
    <div className="page-container">
      <Navbar />

      <div className="news-detail-wrapper">
        <NewsSection newsId={newsId} userId={userId} />
        <ActionButton newsId={newsId} userId={userId} />
        <CommentSection newsId={newsId} userId={userId} />
      </div>

      <Footer />
    </div>
  );
};

export default NewsDetail;
