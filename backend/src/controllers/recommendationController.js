const pool = require("../config/db");

const getSmartRecommendations = async (req, res) => {
    try {
        const userId = req.user.id;

        const preferenceResult = await pool.query(
            `SELECT *
             FROM user_preferences
             WHERE user_id = $1`,
            [userId]
        );

        if (preferenceResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Taste profile not found"
            });
        }

        const preferences = preferenceResult.rows[0];

        const mealsResult = await pool.query(`
            SELECT
                m.id,
                m.name,
                m.description,
                m.price,
                m.category_id,
                m.cook_id,
                m.available_quantity
            FROM meals m
            WHERE m.available_quantity > 0
            ORDER BY m.id DESC
        `);

        const meals = mealsResult.rows;

        const favoriteFoods = (preferences.favorite_foods || []).map(x =>
            String(x).toLowerCase()
        );

        const dislikedFoods = (preferences.disliked_foods || []).map(x =>
            String(x).toLowerCase()
        );

        const preferredTypes = (preferences.preferred_meal_types || []).map(x =>
            String(x).toLowerCase()
        );

        const budgetMin = Number(preferences.budget_min || 0);
        const budgetMax = Number(
            preferences.budget_max || Number.MAX_SAFE_INTEGER
        );

        const recommendations = meals.map(meal => {
            let score = 0;
            const reasons = [];

            const mealText =
                `${meal.name || ""} ${meal.description || ""}`.toLowerCase();

            if (favoriteFoods.some(food => mealText.includes(food))) {
                score += 40;
                reasons.push("Matches your favorite foods");
            }

            if (dislikedFoods.some(food => mealText.includes(food))) {
                score -= 50;
                reasons.push("Contains a disliked food");
            }

            const price = Number(meal.price);

            if (price >= budgetMin && price <= budgetMax) {
                score += 30;
                reasons.push("Within your preferred budget");
            } else if (price < budgetMin) {
                score += 10;
                reasons.push("Below your preferred budget");
            }

            if (preferredTypes.length > 0) {
                const typeMatch = preferredTypes.some(type =>
                    mealText.includes(type)
                );

                if (typeMatch) {
                    score += 20;
                    reasons.push("Matches your preferred meal type");
                }
            }

            score = Math.max(0, Math.min(score, 100));

            return {
                ...meal,
                match_score: score,
                reasons
            };
        });

        recommendations.sort((a, b) => b.match_score - a.match_score);

        res.json({
            success: true,
            data: recommendations.slice(0, 10)
        });

    } catch (error) {
        console.error("Smart recommendations error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    getSmartRecommendations
};
