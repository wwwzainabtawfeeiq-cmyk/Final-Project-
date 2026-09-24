const pool = require("../config/db");

const calculateFairPrice = async (req, res) => {
    try {
        const mealId = req.params.mealId;

        const result = await pool.query(
            `SELECT
                m.id,
                m.name,
                m.price,
                c.ingredient_cost,
                c.packaging_cost,
                c.delivery_cost,
                c.profit_margin
             FROM meals m
             JOIN meal_costs c ON c.meal_id = m.id
             WHERE m.id = $1`,
            [mealId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Meal cost data not found"
            });
        }

        const meal = result.rows[0];

        const ingredientCost = Number(meal.ingredient_cost);
        const packagingCost = Number(meal.packaging_cost);
        const deliveryCost = Number(meal.delivery_cost);
        const profitMargin = Number(meal.profit_margin);

        const totalCost =
            ingredientCost +
            packagingCost +
            deliveryCost;

        const suggestedProfit =
            totalCost * (profitMargin / 100);

        const suggestedPrice =
            totalCost + suggestedProfit;

        const currentPrice = Number(meal.price);

        let priceStatus;

        if (currentPrice < suggestedPrice) {
            priceStatus = "Current price is below the suggested fair price";
        } else if (currentPrice > suggestedPrice) {
            priceStatus = "Current price is above the suggested fair price";
        } else {
            priceStatus = "Current price matches the suggested fair price";
        }

        res.json({
            success: true,
            data: {
                meal_id: meal.id,
                meal_name: meal.name,
                current_price: currentPrice,
                ingredient_cost: ingredientCost,
                packaging_cost: packagingCost,
                delivery_cost: deliveryCost,
                total_cost: Number(totalCost.toFixed(2)),
                profit_margin: profitMargin,
                suggested_profit: Number(suggestedProfit.toFixed(2)),
                suggested_fair_price: Number(suggestedPrice.toFixed(2)),
                price_status: priceStatus
            }
        });

    } catch (error) {
        console.error("Fair Price Calculator error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    calculateFairPrice
};
