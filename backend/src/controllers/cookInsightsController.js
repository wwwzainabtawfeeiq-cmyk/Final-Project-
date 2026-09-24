const pool = require("../config/db");

const getCookInsights = async (req, res) => {
    try {
        const cookId = req.user.id;

        const statisticsResult = await pool.query(`
            SELECT
                COUNT(DISTINCT o.id) AS total_orders,
                COUNT(DISTINCT o.id) FILTER (WHERE o.status = 'completed') AS completed_orders,
                COUNT(DISTINCT o.id) FILTER (WHERE o.status = 'cancelled') AS cancelled_orders,
                COALESCE(
                    SUM(oi.quantity * oi.price)
                    FILTER (WHERE o.status = 'completed'),
                    0
                ) AS total_sales,
                COALESCE(AVG(r.rating), 0) AS average_rating
            FROM orders o
            INNER JOIN order_items oi ON oi.order_id = o.id
            INNER JOIN meals m ON m.id = oi.meal_id
            LEFT JOIN reviews r ON r.cook_id = $1
            WHERE m.cook_id = $1
        `, [cookId]);

        const mealsResult = await pool.query(`
            SELECT
                COUNT(*) AS total_meals,
                COUNT(*) FILTER (WHERE is_available = true) AS available_meals,
                COUNT(*) FILTER (
                    WHERE is_available = true
                    AND available_quantity <= 3
                ) AS low_stock_meals
            FROM meals
            WHERE cook_id = $1
        `, [cookId]);

        const topMealResult = await pool.query(`
            SELECT
                m.id,
                m.name,
                COALESCE(SUM(oi.quantity), 0) AS sold_quantity,
                COALESCE(SUM(oi.quantity * oi.price), 0) AS sales
            FROM meals m
            LEFT JOIN order_items oi ON oi.meal_id = m.id
            LEFT JOIN orders o
                ON o.id = oi.order_id
                AND o.status = 'completed'
            WHERE m.cook_id = $1
            GROUP BY m.id, m.name
            ORDER BY sold_quantity DESC, sales DESC
            LIMIT 1
        `, [cookId]);

        const statistics = statisticsResult.rows[0];
        const meals = mealsResult.rows[0];
        const topMeal = topMealResult.rows[0] || null;

        const insights = [];

        if (Number(statistics.completed_orders) > 0) {
            insights.push("لديك طلبات مكتملة ويمكن متابعة أداء المبيعات.");
        }

        if (Number(meals.low_stock_meals) > 0) {
            insights.push("بعض الوجبات أصبحت قليلة الكمية، يفضل تحديث الكمية المتوفرة.");
        }

        if (Number(statistics.average_rating) >= 4) {
            insights.push("متوسط التقييمات جيد، حافظ على جودة الوجبات والخدمة.");
        }

        if (
            Number(statistics.average_rating) > 0 &&
            Number(statistics.average_rating) < 3
        ) {
            insights.push("متوسط التقييم يحتاج إلى تحسين من خلال متابعة آراء المستخدمين.");
        }

        if (topMeal) {
            insights.push(`الوجبة الأكثر طلباً حالياً هي: ${topMeal.name}.`);
        }

        if (insights.length === 0) {
            insights.push("لا توجد بيانات كافية حالياً لإنشاء تحليل أوسع.");
        }

        res.json({
            success: true,
            data: {
                statistics: {
                    total_orders: Number(statistics.total_orders),
                    completed_orders: Number(statistics.completed_orders),
                    cancelled_orders: Number(statistics.cancelled_orders),
                    total_sales: Number(statistics.total_sales),
                    average_rating: Number(
                        Number(statistics.average_rating).toFixed(2)
                    )
                },
                meals: {
                    total_meals: Number(meals.total_meals),
                    available_meals: Number(meals.available_meals),
                    low_stock_meals: Number(meals.low_stock_meals)
                },
                top_meal: topMeal,
                insights
            }
        });

    } catch (error) {
        console.error("Cook Insights error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    getCookInsights
};
