// backend/db.js
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "newsdash", // ganti sesuai database kamu
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool
  .getConnection()
  .then(() => console.log("✅ Connected to MySQL with Pool."))
  .catch((err) =>
    console.error("❌ Error connecting to MySQL with Pool:", err)
  );

module.exports = pool;
