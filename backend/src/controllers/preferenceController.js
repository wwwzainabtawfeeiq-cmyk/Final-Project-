const pool = require("../config/db");

const getMyPreferences = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM user_preferences
             WHERE user_id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.json({
                success: true,
                data: null
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Get preferences error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const updateMyPreferences = async (req, res) => {
    try {
        const {
            favorite_foods,
            disliked_foods,
            spice_level,
            diet_type,
            budget_min,
            budget_max,
            preferred_meal_types
        } = req.body;

        const result = await pool.query(
            `INSERT INTO user_preferences
            (
                user_id,
                favorite_foods,
                disliked_foods,
                spice_level,
                diet_type,
                budget_min,
                budget_max,
                preferred_meal_types,
                updated_at
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_TIMESTAMP)
            ON CONFLICT (user_id)
            DO UPDATE SET
                favorite_foods = EXCLUDED.favorite_foods,
                disliked_foods = EXCLUDED.disliked_foods,
                spice_level = EXCLUDED.spice_level,
                diet_type = EXCLUDED.diet_type,
                budget_min = EXCLUDED.budget_min,
                budget_max = EXCLUDED.budget_max,
                preferred_meal_types = EXCLUDED.preferred_meal_types,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *`,
            [
                req.user.id,
                favorite_foods || [],
                disliked_foods || [],
                spice_level || null,
                diet_type || null,
                budget_min || null,
                budget_max || null,
                preferred_meal_types || []
            ]
        );

        res.json({
            success: true,
            message: "Preferences updated successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Update preferences error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    getMyPreferences,
    updateMyPreferences
};