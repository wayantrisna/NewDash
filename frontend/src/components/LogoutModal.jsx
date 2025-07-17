import React from "react";
import "../styles/LogoutModal.css";

const LogoutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleLogout = () => {
    // Logika untuk logout
    console.log("Logout berhasil");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Log out of X?</h2>
        <p>
          You can always log back in at any time. If you just want to switch
          accounts, you can do that by adding an existing account.
        </p>
        <div className="modal-buttons">
          <button className="logout-button" onClick={handleLogout}>
            Log out
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
