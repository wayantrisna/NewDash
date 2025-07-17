// backend/db.js
require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "newsdash",
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
