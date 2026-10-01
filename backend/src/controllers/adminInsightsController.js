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
                COUNT(*) FILTER (WHERE status = 'delivered') AS completed_orders,
                COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled_orders,
                COALESCE(
                    SUM(total_amount) FILTER (WHERE status = 'delivered'),
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

        const monthlyRevenueResult = await pool.query(`
            SELECT
                EXTRACT(MONTH FROM created_at)::int AS month_number,
                COALESCE(
                    SUM(total_amount) FILTER (WHERE status = 'delivered'),
                    0
                ) AS revenue
            FROM orders
            WHERE created_at >= DATE_TRUNC('year', CURRENT_DATE)
            GROUP BY EXTRACT(MONTH FROM created_at)
            ORDER BY month_number
        `);

        const categoryStatsResult = await pool.query(`
            SELECT
                c.id,
                c.name,
                COUNT(oi.id)::int AS orders
            FROM categories c
            LEFT JOIN meals m ON m.category_id = c.id
            LEFT JOIN order_items oi ON oi.meal_id = m.id
            LEFT JOIN orders o
                ON o.id = oi.order_id
                AND o.status = 'delivered'
            GROUP BY c.id, c.name
            ORDER BY orders DESC, c.id ASC
        `);

        const topCooksResult = await pool.query(`
            SELECT
                u.id,
                u.name,
                COUNT(DISTINCT o.id)::int AS orders,
                COALESCE(SUM(o.total_amount), 0) AS revenue,
                COALESCE(AVG(r.rating), 0) AS rating
            FROM users u
            LEFT JOIN orders o
                ON o.chef_id = u.id
                AND o.status = 'delivered'
            LEFT JOIN reviews r
                ON r.cook_id = u.id
            WHERE u.role = 'cook'
            GROUP BY u.id, u.name
            ORDER BY orders DESC, revenue DESC
            LIMIT 5
        `);

        const recentActivityResult = await pool.query(`
            SELECT *
            FROM (
                SELECT
                    'order' AS type,
                    o.id,
                    o.created_at AS activity_time,
                    CASE
                        WHEN o.status = 'cancelled'
                            THEN 'Order cancelled'
                        ELSE 'New order'
                    END AS title,
                    u.name AS actor_name
                FROM orders o
                JOIN users u ON u.id = o.customer_id

                UNION ALL

                SELECT
                    'cook' AS type,
                    u.id,
                    u.created_at AS activity_time,
                    'New cook joined' AS title,
                    u.name AS actor_name
                FROM users u
                WHERE u.role = 'cook'

                UNION ALL

                SELECT
                    'review' AS type,
                    r.id,
                    r.created_at AS activity_time,
                    'New review' AS title,
                    u.name AS actor_name
                FROM reviews r
                JOIN users u ON u.id = r.customer_id
            ) activity
            ORDER BY activity_time DESC
            LIMIT 5
        `);

        const topMealResult = await pool.query(`
            SELECT
                m.id,
                m.name,
                COALESCE(SUM(oi.quantity), 0)::int AS sold_quantity,
                COALESCE(SUM(oi.quantity * oi.price), 0) AS sales
            FROM meals m
            INNER JOIN order_items oi ON oi.meal_id = m.id
            INNER JOIN orders o ON o.id = oi.order_id
            WHERE o.status = 'delivered'
            GROUP BY m.id, m.name
            ORDER BY sold_quantity DESC, sales DESC
            LIMIT 1
        `);

        const users = usersResult.rows[0];
        const meals = mealsResult.rows[0];
        const orders = ordersResult.rows[0];
        const reviews = reviewsResult.rows[0];
        const topMeal = topMealResult.rows[0] || null;

        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const monthlyRevenue = monthlyRevenueResult.rows.map((row) => ({
            month_number: Number(row.month_number),
            month: monthNames[Number(row.month_number) - 1],
            revenue: Number(row.revenue)
        }));

        const totalCategoryOrders = categoryStatsResult.rows.reduce(
            (sum, row) => sum + Number(row.orders),
            0
        );

        const categoryStats = categoryStatsResult.rows.map((row) => ({
            id: row.id,
            name: row.name,
            orders: Number(row.orders),
            percent:
                totalCategoryOrders > 0
                    ? Math.round((Number(row.orders) / totalCategoryOrders) * 100)
                    : 0
        }));

        const topCooks = topCooksResult.rows.map((row) => ({
            id: row.id,
            name: row.name,
            orders: Number(row.orders),
            revenue: Number(row.revenue),
            rating: Number(Number(row.rating).toFixed(2))
        }));

        const insights = [];

        if (Number(orders.total_orders) === 0) {
            insights.push("No orders are available yet for sales analysis.");
        } else {
            if (Number(orders.completed_orders) > 0) {
                insights.push("Delivered orders are available for sales analysis.");
            }

            if (Number(orders.cancelled_orders) > 0) {
                insights.push("There are cancelled orders that can be reviewed.");
            }
        }

        if (Number(reviews.average_rating) >= 4) {
            insights.push("The platform average rating is currently 4 or higher.");
        } else if (
            Number(reviews.average_rating) > 0 &&
            Number(reviews.average_rating) < 3
        ) {
            insights.push("The platform average rating is currently below 3.");
        }

        if (
            Number(meals.available_meals) === 0 &&
            Number(meals.total_meals) > 0
        ) {
            insights.push("There are currently no available meals.");
        }

        if (topMeal) {
            insights.push(`Top selling meal: ${topMeal.name}.`);
        }

        if (insights.length === 0) {
            insights.push("There is not enough data yet for broader insights.");
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
                monthly_revenue: monthlyRevenue,
                category_stats: categoryStats,
                top_cooks: topCooks,
                recent_activity: recentActivityResult.rows,
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
