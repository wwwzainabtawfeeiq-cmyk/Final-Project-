const pool = require("../config/db");

const setMealCost = async (req, res) => {
    try {
        const mealId = req.params.mealId;
        const {
            ingredient_cost = 0,
            packaging_cost = 0,
            delivery_cost = 0,
            profit_margin = 20
        } = req.body;

        const result = await pool.query(
            `INSERT INTO meal_costs
                (meal_id, ingredient_cost, packaging_cost, delivery_cost, profit_margin)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (meal_id)
             DO UPDATE SET
                ingredient_cost = EXCLUDED.ingredient_cost,
                packaging_cost = EXCLUDED.packaging_cost,
                delivery_cost = EXCLUDED.delivery_cost,
                profit_margin = EXCLUDED.profit_margin,
                updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [
                mealId,
                ingredient_cost,
                packaging_cost,
                delivery_cost,
                profit_margin
            ]
        );

        res.json({
            success: true,
            message: "Meal cost saved successfully",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("Set Meal Cost error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    setMealCost
};
