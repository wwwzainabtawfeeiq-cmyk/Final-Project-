const pool = require("../config/db");

async function createAddress(req, res) {
    try {
        const { title, address, city } = req.body;

        if (!title || !address || !city) {
            return res.status(400).json({
                success: false,
                message: "Title, address and city are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO addresses (user_id, title, address, city)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [req.user.id, title, address, city]
        );

        res.status(201).json({
            success: true,
            message: "Address created successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Create address error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

async function getMyAddresses(req, res) {
    try {
        const result = await pool.query(
            `SELECT *
             FROM addresses
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [req.user.id]
        );

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error("Get addresses error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

async function deleteAddress(req, res) {
    try {
        const result = await pool.query(
            `DELETE FROM addresses
             WHERE id = $1 AND user_id = $2
             RETURNING *`,
            [req.params.id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        res.json({
            success: true,
            message: "Address deleted successfully"
        });
    } catch (error) {
        console.error("Delete address error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

module.exports = {
    createAddress,
    getMyAddresses,
    deleteAddress
};
