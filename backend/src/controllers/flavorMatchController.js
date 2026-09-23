const pool = require("../config/db");

const getFlavorMatch = async (req, res) => {
    try {
        const mealId = req.params.mealId;
        const userId = req.user.id;

        const pref = await pool.query(
            "SELECT * FROM user_preferences WHERE user_id = $1",
            [userId]
        );

        if (pref.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Taste profile not found"
            });
        }

        const meal = await pool.query(
            `SELECT id, name, description, price, tags
             FROM meals
             WHERE id = $1`,
            [mealId]
        );

        if (meal.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Meal not found"
            });
        }

        const preferences = pref.rows[0];
        const data = meal.rows[0];

        const favorites = (preferences.favorite_foods || [])
            .map(x => String(x).toLowerCase());

        const dislikes = (preferences.disliked_foods || [])
            .map(x => String(x).toLowerCase());

        const tags = (data.tags || [])
            .map(x => String(x).toLowerCase());

        const matched = favorites.filter(x =>
            tags.some(tag => tag.includes(x) || x.includes(tag))
        );

        const disliked = dislikes.filter(x =>
            tags.some(tag => tag.includes(x) || x.includes(tag))
        );

        let score = 50;
        score += matched.length * 20;
        score -= disliked.length * 30;
        score = Math.max(0, Math.min(score, 100));

        res.json({
            success: true,
            data: {
                meal_id: data.id,
                meal_name: data.name,
                flavor_match_score: score,
                matched_preferences: matched,
                conflicts: disliked
            }
        });
    } catch (error) {
        console.error("Flavor Match error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = { getFlavorMatch };
