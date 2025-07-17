import React from "react";
import { Routes, Route } from "react-router-dom";

// Mengimpor halaman
import HomePage from "./pages/Home/HomePage";
import NewsDetail from "./pages/News/NewsDetail/NewsDetail";
import LoginPage from "./pages/Login/LoginPage";
import SignUpPage from "./pages/Signup/SignUpPage";
import Createberita from "./pages/Create/Createberita";
import BookmarkPage from "./pages/Bookmark/BookmarkPage";
import AllNews from "./pages/Home/component/Allnews";
import Editprofile from "./pages/Editprofile";
import Search from "./pages/Search";
import AdminDashboard from "./pages/Admindashboard/AdminDashboard";
import CommentManagement from "./pages/Admindashboard/CommentManagement";
import UserManagement from "./pages/Admindashboard/UserManagement";
import ContentManagement from "./pages/Admindashboard/ContentManagement";
// import AuthorDashboard from "./pages/Author/AuthorDashboard";
// import ArticlesAuthor from "./pages/Author/ArticlesAuthor";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/news/:id" element={<NewsDetail />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/create" element={<Createberita />} />
      <Route path="/bookmarks" element={<BookmarkPage />} />
      <Route path="/editprofile" element={<Editprofile />} />
      <Route path="/search" element={<Search />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/create" element={<Createberita />} />
      <Route path="/admin/comments" element={<CommentManagement />} />
      <Route path="/admin/articles" element={<ContentManagement />} />{" "}
      <Route path="/admin/user" element={<UserManagement />} />
      {/* <Route path="/author/dashboard" element={<AuthorDashboard />} />a
      <Route path="/author/create" element={<Createberita />} /> */}
      {/* <Route path="/author/articles" element={<ArticlesAuthor />} /> */}
      <Route path="/all-news" element={<AllNews />} />
    </Routes>
  );
}

export default App;

console.log("App rendered");
