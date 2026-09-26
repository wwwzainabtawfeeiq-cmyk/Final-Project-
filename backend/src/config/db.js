const { Pool } = require("pg");
const path = require("path");

require("dotenv").config({
    path: path.resolve(__dirname, "../../.env")
});

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.on("connect", () => {
    console.log("Connected to PostgreSQL database");
});

pool.on("error", (err) => {
    console.error("Unexpected PostgreSQL error:", err);
});

module.exports = pool;