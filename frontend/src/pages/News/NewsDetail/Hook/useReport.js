import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "${config.API_BASE_URL}";

export function useReport() {
  const report = async (userId, targetType, targetId, reason, note) => {
    if (!userId) {
      alert("Kamu harus login terlebih dahulu untuk melaporkan.");
      return;
    }

    if (!reason.trim()) return;

    try {
      await axios.post(`${BASE_URL}/api/interaction/reports`, {
        reporterId: userId,
        targetType,
        targetId,
        reason,
        note: note || "",
      });
    } catch (err) {
      console.error("❌ Gagal mengirim laporan:", err);
      throw err;
    }
  };

  return { report };
}
