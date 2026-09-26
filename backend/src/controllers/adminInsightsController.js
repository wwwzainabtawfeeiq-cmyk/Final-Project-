const pool = require("../config/db");

const getAdminInsights = async (req, res) => {
    try {
        const usersResult = await pool.query(`
            SELECT
                COUNT(*) AS total_users,
                COUNT(*) FILTER (WHERE role = 'customer') AS customers,
                COUNT(*) FILTER (WHERE role = 'cook') AS cooks,
                COUNT(*) FILTER (WHERE role = 'admin') AS admins
            FROM users
        `);

        const mealsResult = await pool.query(`
            SELECT
                COUNT(*) AS total_meals,
                COUNT(*) FILTER (WHERE is_available = true) AS available_meals
            FROM meals
        `);

        const ordersResult = await pool.query(`
            SELECT
                COUNT(*) AS total_orders,
                COUNT(*) FILTER (WHERE status = 'completed') AS completed_orders,
                COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled_orders,
                COALESCE(
                    SUM(total_amount) FILTER (WHERE status = 'completed'),
                    0
                ) AS total_sales
            FROM orders
        `);

        const reviewsResult = await pool.query(`
            SELECT
                COUNT(*) AS total_reviews,
                COALESCE(AVG(rating), 0) AS average_rating
            FROM reviews
        `);

        const topMealResult = await pool.query(`
            SELECT
                m.id,
                m.name,
                COALESCE(SUM(oi.quantity), 0) AS sold_quantity,
                COALESCE(SUM(oi.quantity * oi.price), 0) AS sales
            FROM meals m
            INNER JOIN order_items oi ON oi.meal_id = m.id
            INNER JOIN orders o ON o.id = oi.order_id
            WHERE o.status = 'completed'
            GROUP BY m.id, m.name
            ORDER BY sold_quantity DESC, sales DESC
            LIMIT 1
        `);

        const users = usersResult.rows[0];
        const meals = mealsResult.rows[0];
        const orders = ordersResult.rows[0];
        const reviews = reviewsResult.rows[0];
        const topMeal = topMealResult.rows[0] || null;

        const insights = [];

        if (Number(orders.total_orders) === 0) {
            insights.push("لا توجد طلبات كافية حالياً لإنشاء تحليل للمبيعات.");
        } else {
            if (Number(orders.completed_orders) > 0) {
                insights.push("توجد طلبات مكتملة ويمكن متابعة أداء المبيعات.");
            }

            if (Number(orders.cancelled_orders) > 0) {
                insights.push("توجد طلبات ملغاة ويستحسن متابعة أسباب الإلغاء.");
            }
        }

        if (Number(reviews.average_rating) >= 4) {
            insights.push("متوسط تقييمات المنصة جيد بشكل عام.");
        } else if (
            Number(reviews.average_rating) > 0 &&
            Number(reviews.average_rating) < 3
        ) {
            insights.push("متوسط تقييمات المنصة يحتاج إلى متابعة وتحسين.");
        }

        if (
            Number(meals.available_meals) === 0 &&
            Number(meals.total_meals) > 0
        ) {
            insights.push("لا توجد وجبات متاحة حالياً.");
        }

        if (topMeal) {
            insights.push(`الوجبة الأكثر مبيعاً حالياً هي: ${topMeal.name}.`);
        }

        if (insights.length === 0) {
            insights.push("لا توجد بيانات كافية حالياً لإنشاء تحليل أوسع.");
        }

        res.json({
            success: true,
            data: {
                users: {
                    total_users: Number(users.total_users),
                    customers: Number(users.customers),
                    cooks: Number(users.cooks),
                    admins: Number(users.admins)
                },
                meals: {
                    total_meals: Number(meals.total_meals),
                    available_meals: Number(meals.available_meals)
                },
                orders: {
                    total_orders: Number(orders.total_orders),
                    completed_orders: Number(orders.completed_orders),
                    cancelled_orders: Number(orders.cancelled_orders),
                    total_sales: Number(orders.total_sales)
                },
                reviews: {
                    total_reviews: Number(reviews.total_reviews),
                    average_rating: Number(
                        Number(reviews.average_rating).toFixed(2)
                    )
                },
                top_meal: topMeal,
                insights
            }
        });

    } catch (error) {
        console.error("Admin Insights error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    getAdminInsights
};