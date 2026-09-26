const pool = require("../config/db");

const verifyCook = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            UPDATE users
            SET is_verified = TRUE
            WHERE id = $1
              AND role = 'cook'
            RETURNING id, name, email, role, is_verified
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Cook not found"
            });
        }

        res.json({
            success: true,
            message: "Cook verified successfully",
            cook: result.rows[0]
        });

    } catch (error) {
        console.error("Verify cook error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const unverifyCook = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            UPDATE users
            SET is_verified = FALSE
            WHERE id = $1
              AND role = 'cook'
            RETURNING id, name, email, role, is_verified
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Cook not found"
            });
        }

        res.json({
            success: true,
            message: "Cook verification removed",
            cook: result.rows[0]
        });

    } catch (error) {
        console.error("Unverify cook error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const getCookTrustScore = async (req, res) => {
    try {
        const { id } = req.params;

        const cookResult = await pool.query(
            `
            SELECT id, name, email, is_verified
            FROM users
            WHERE id = $1 AND role = 'cook'
            `,
            [id]
        );

        if (cookResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Cook not found"
            });
        }

        const stats = await pool.query(
            `
            SELECT
                COUNT(DISTINCT o.id) AS total_orders,
                COUNT(DISTINCT CASE WHEN o.status = 'completed' THEN o.id END) AS completed_orders,
                COUNT(r.id) AS total_reviews,
                COALESCE(AVG(r.rating), 0) AS average_rating
            FROM users u
            LEFT JOIN orders o ON o.chef_id = u.id
            LEFT JOIN reviews r ON r.cook_id = u.id
            WHERE u.id = $1
            `,
            [id]
        );

        const data = stats.rows[0];

        const totalOrders = Number(data.total_orders);
        const completedOrders = Number(data.completed_orders);
        const totalReviews = Number(data.total_reviews);
        const averageRating = Number(data.average_rating);

        const completionRate =
            totalOrders > 0
                ? (completedOrders / totalOrders) * 100
                : 0;

        const ratingScore =
            (averageRating / 5) * 100;

        const orderScore =
            Math.min(totalOrders, 20) / 20 * 100;

        const reviewScore =
            Math.min(totalReviews, 10) / 10 * 100;

        const trustScore =
            Math.round(
                ratingScore * 0.45 +
                completionRate * 0.30 +
                orderScore * 0.15 +
                reviewScore * 0.10
            );

        res.json({
            success: true,
            cook: cookResult.rows[0],
            trust_score: trustScore,
            statistics: {
                total_orders: totalOrders,
                completed_orders: completedOrders,
                completion_rate: Number(completionRate.toFixed(2)),
                total_reviews: totalReviews,
                average_rating: Number(averageRating.toFixed(2))
            }
        });

    } catch (error) {
        console.error("Cook trust score error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    verifyCook,
    unverifyCook,
    getCookTrustScore
};