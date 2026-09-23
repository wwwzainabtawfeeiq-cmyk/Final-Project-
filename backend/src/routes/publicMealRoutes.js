const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                m.id,
                m.name,
                m.description,
                m.price,
                m.category_id,
                m.cook_id,
                m.available_quantity
            FROM meals m
            ORDER BY m.id DESC
        `);

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error("Get meals error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

module.exports = router;
