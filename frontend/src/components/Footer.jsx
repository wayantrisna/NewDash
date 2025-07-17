import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-info">
          <h3>NewsDash</h3>
          <p>
            Berita terbaru dan tren terkini. Tetap terinformasi bersama kami!
          </p>
        </div>

        <div className="footer-links">
          <h4>Link Cepat</h4>
          <ul>
            <li>
              <a href="#">Beranda</a>
            </li>
            <li>
              <a href="#">Tentang Kami</a>
            </li>
            <li>
              <a href="#">Kebijakan Privasi</a>
            </li>
            <li>
              <a href="#">Kontak</a>
            </li>
          </ul>
        </div>

        <div className="footer-social">
          <h4>Ikuti Kami</h4>
          <div className="social-icons">
            <a href="#">
              <FaFacebook />
            </a>
            <a href="#">
              <FaInstagram />
            </a>
            <a href="#">
              <FaTwitter />
            </a>
            <a href="#">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 NewsDash. Semua hak dilindungi.</p>
      </div>
    </footer>
  );
}

export default Footer;
