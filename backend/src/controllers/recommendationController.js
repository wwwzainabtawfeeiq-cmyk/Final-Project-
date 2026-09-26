const pool = require("../config/db");
const {
    normalize,
    containsAny
} = require("../services/aiService");

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
            normalize(x)
        );

        const dislikedFoods = (preferences.disliked_foods || []).map(x =>
            normalize(x)
        );

        const preferredTypes = (preferences.preferred_meal_types || []).map(x =>
            normalize(x)
        );

        const budgetMin = Number(preferences.budget_min || 0);
        const budgetMax = Number(
            preferences.budget_max || Number.MAX_SAFE_INTEGER
        );

        const recommendations = meals.map(meal => {
            let score = 0;
            const reasons = [];

            const mealText = normalize(
                `${meal.name || ""} ${meal.description || ""}`
            );

            if (containsAny(mealText, favoriteFoods)) {
                score += 40;
                reasons.push("Matches your favorite foods");
            }

            if (containsAny(mealText, dislikedFoods)) {
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
                if (containsAny(mealText, preferredTypes)) {
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


const explainRecommendation = async (req, res) => {
    try {
        const userId = req.user.id;
        const mealId = req.params.mealId;

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

        const mealResult = await pool.query(
            `SELECT
                id,
                name,
                description,
                price,
                available_quantity
             FROM meals
             WHERE id = $1`,
            [mealId]
        );

        if (mealResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Meal not found"
            });
        }

        const preferences = preferenceResult.rows[0];
        const meal = mealResult.rows[0];

        const favoriteFoods = (preferences.favorite_foods || []).map(x =>
            normalize(x)
        );

        const dislikedFoods = (preferences.disliked_foods || []).map(x =>
            normalize(x)
        );

        const preferredTypes = (preferences.preferred_meal_types || []).map(x =>
            normalize(x)
        );

        const budgetMin = Number(preferences.budget_min || 0);
        const budgetMax = Number(
            preferences.budget_max || Number.MAX_SAFE_INTEGER
        );

        const mealText = normalize(
            `${meal.name || ""} ${meal.description || ""}`
        );

        const matchedFavorites = favoriteFoods.filter(food =>
            mealText.includes(food)
        );

        const conflicts = dislikedFoods.filter(food =>
            mealText.includes(food)
        );

        const price = Number(meal.price);

        const budgetMatch =
            price >= budgetMin && price <= budgetMax;

        const typeMatch = preferredTypes.filter(type =>
            mealText.includes(type)
        );

        let score = 0;
        const reasons = [];

        if (matchedFavorites.length > 0) {
            score += 40;
            reasons.push(
                `Matches your favorite foods: ${matchedFavorites.join(", ")}`
            );
        }

        if (conflicts.length > 0) {
            score -= 50;
            reasons.push(
                `Contains disliked foods: ${conflicts.join(", ")}`
            );
        }

        if (budgetMatch) {
            score += 30;
            reasons.push("The price is within your preferred budget");
        } else if (price < budgetMin) {
            score += 10;
            reasons.push("The price is below your preferred budget");
        }

        if (typeMatch.length > 0) {
            score += 20;
            reasons.push(
                `Matches your preferred meal type: ${typeMatch.join(", ")}`
            );
        }

        score = Math.max(0, Math.min(score, 100));

        res.json({
            success: true,
            data: {
                meal_id: meal.id,
                meal_name: meal.name,
                match_score: score,
                explanation: reasons,
                matched_preferences: matchedFavorites,
                conflicts,
                budget_match: budgetMatch
            }
        });

    } catch (error) {
        console.error("Explain recommendation error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    getSmartRecommendations,
    explainRecommendation
};
