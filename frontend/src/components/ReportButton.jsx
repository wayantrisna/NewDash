import React, { useState, useEffect } from "react";
import { useReport } from "../pages/News/NewsDetail/hook/useReport";
import "../styles/ReportButton.css";

function ReportButton({ userId, targetType, targetId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customNote, setCustomNote] = useState("");

  const { report } = useReport(); // tidak passing userId di sini

  const reasonsList = [
    "Konten seksual",
    "Konten kekerasan atau menjijikkan",
    "Konten kebencian atau pelecehan",
    "Pelecehan atau penindasan",
    "Lainnya",
  ];

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!userId) {
      alert("Kamu harus login terlebih dahulu untuk melaporkan.");
      return;
    }

    if (!selectedReason) {
      alert("Silakan pilih satu alasan terlebih dahulu.");
      return;
    }

    try {
      await report(
        userId,
        targetType,
        targetId,
        selectedReason,
        selectedReason === "Lainnya" ? customNote : ""
      );

      alert("✅ Laporan berhasil dikirim!");
      resetForm();
    } catch (err) {
      console.error("❌ Gagal kirim laporan:", err);
      alert("❌ Gagal mengirim laporan.");
    }
  };

  const resetForm = () => {
    setIsOpen(false);
    setSelectedReason("");
    setCustomNote("");
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="report-modal-trigger">
        🚩 Laporkan
      </button>

      {isOpen && (
        <div className="report-modal-overlay">
          <div className="report-modal">
            <div className="modal-header">
              <h3>Laporkan</h3>
              <button onClick={resetForm} className="close-btn">
                ✕
              </button>
            </div>

            <p className="modal-subtext">
              Kami akan memeriksa semua hal terkait Pedoman Komunitas.
            </p>

            <div className="radio-group">
              {reasonsList.map((reason) => (
                <label key={reason} className="radio-label">
                  <input
                    type="radio"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                  />
                  {reason}
                </label>
              ))}
            </div>

            {selectedReason === "Lainnya" && (
              <textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Tambahkan catatan atau detail lainnya..."
                className="custom-note-input"
              />
            )}

            <button
              onClick={handleSubmit}
              className={`next-btn ${!selectedReason ? "disabled" : ""}`}
              disabled={!selectedReason}
            >
              Kirim Laporan
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ReportButton;
