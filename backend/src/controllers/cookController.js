const pool = require("../config/db");

async function createCookProfile(req, res) {
    try {
        const { bio, phone, address } = req.body;
        const userId = req.user.id;

        const existingProfile = await pool.query(
            "SELECT id FROM cook_profiles WHERE user_id = $1",
            [userId]
        );

        if (existingProfile.rows.length > 0) {
            return res.status(409).json({
                message: "Cook profile already exists"
            });
        }

        const result = await pool.query(
            `INSERT INTO cook_profiles (user_id, bio, phone, address)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [userId, bio || null, phone || null, address || null]
        );

        res.status(201).json({
            message: "Cook profile created successfully",
            profile: result.rows[0]
        });

    } catch (error) {
        console.error("Create cook profile error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
}

async function getMyCookProfile(req, res) {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT cp.*, u.name, u.email
             FROM cook_profiles cp
             JOIN users u ON cp.user_id = u.id
             WHERE cp.user_id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Cook profile not found"
            });
        }

        res.json({
            profile: result.rows[0]
        });

    } catch (error) {
        console.error("Get cook profile error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
}

async function updateCookProfile(req, res) {
    try {
        const { bio, phone, address } = req.body;
        const userId = req.user.id;

        const result = await pool.query(
            `UPDATE cook_profiles
             SET bio = $1,
                 phone = $2,
                 address = $3
             WHERE user_id = $4
             RETURNING *`,
            [bio || null, phone || null, address || null, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Cook profile not found"
            });
        }

        res.json({
            message: "Cook profile updated successfully",
            profile: result.rows[0]
        });

    } catch (error) {
        console.error("Update cook profile error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
}

async function getCookStatistics(req, res) {
    try {
        const cookId = req.user.id;

        const result = await pool.query(
            `SELECT
                COUNT(DISTINCT o.id) AS total_orders,
                COUNT(DISTINCT CASE
                    WHEN o.status = 'delivered' THEN o.id
                END) AS completed_orders,
                COUNT(DISTINCT CASE
                    WHEN o.status = 'cancelled' THEN o.id
                END) AS cancelled_orders,
                COALESCE(
                    SUM(
                        CASE
                            WHEN o.status = 'delivered' THEN o.total_amount
                            ELSE 0
                        END
                    ),
                    0
                ) AS total_sales,
                COALESCE(
                    (
                        SELECT AVG(rating)
                        FROM reviews
                        WHERE cook_id = $1
                    ),
                    0
                ) AS average_rating
             FROM orders o
             WHERE o.chef_id = $1`,
            [cookId]
        );

        res.json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error("Get cook statistics error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

module.exports = {
    createCookProfile,
    getMyCookProfile,
    updateCookProfile,
    getCookStatistics
};
