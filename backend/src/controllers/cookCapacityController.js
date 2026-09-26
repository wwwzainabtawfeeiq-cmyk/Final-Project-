const pool = require("../config/db");

const getCookCapacity = async (req, res) => {
    try {
        const cookId = req.user.id;

        const cookResult = await pool.query(
            `
            SELECT id, name, email
            FROM users
            WHERE id = $1
              AND role = 'cook'
            `,
            [cookId]
        );

        if (cookResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Cook not found"
            });
        }

        const ordersResult = await pool.query(
            `
            SELECT
                COUNT(*) FILTER (
                    WHERE status IN ('pending', 'accepted', 'preparing')
                ) AS active_orders,

                COUNT(*) FILTER (
                    WHERE scheduled_at IS NOT NULL
                      AND scheduled_at > NOW()
                      AND status NOT IN ('cancelled', 'completed')
                ) AS scheduled_orders,

                COALESCE(SUM(
                    CASE
                        WHEN status IN ('pending', 'accepted', 'preparing')
                        THEN oi.quantity
                        ELSE 0
                    END
                ), 0) AS requested_quantity

            FROM orders o
            LEFT JOIN order_items oi ON oi.order_id = o.id
            WHERE o.chef_id = $1
            `,
            [cookId]
        );

        const mealsResult = await pool.query(
            `
            SELECT
                COUNT(*) FILTER (WHERE is_available = TRUE) AS available_meals,
                COALESCE(SUM(
                    CASE
                        WHEN is_available = TRUE
                        THEN available_quantity
                        ELSE 0
                    END
                ), 0) AS available_quantity
            FROM meals
            WHERE cook_id = $1
            `,
            [cookId]
        );

        const orders = ordersResult.rows[0];
        const meals = mealsResult.rows[0];

        const activeOrders = Number(orders.active_orders || 0);
        const scheduledOrders = Number(orders.scheduled_orders || 0);
        const requestedQuantity = Number(orders.requested_quantity || 0);
        const availableMeals = Number(meals.available_meals || 0);
        const availableQuantity = Number(meals.available_quantity || 0);

        const totalDemand = requestedQuantity + scheduledOrders;

        let pressureScore = 0;

        if (activeOrders >= 5) {
            pressureScore += 40;
        } else if (activeOrders >= 3) {
            pressureScore += 25;
        } else {
            pressureScore += 10;
        }

        if (scheduledOrders >= 5) {
            pressureScore += 30;
        } else if (scheduledOrders >= 3) {
            pressureScore += 20;
        } else {
            pressureScore += 5;
        }

        if (availableQuantity > 0 && requestedQuantity >= availableQuantity) {
            pressureScore += 30;
        } else if (availableQuantity > 0 && requestedQuantity >= availableQuantity * 0.7) {
            pressureScore += 20;
        } else {
            pressureScore += 5;
        }

        let capacityStatus;

        if (pressureScore >= 70) {
            capacityStatus = "high";
        } else if (pressureScore >= 40) {
            capacityStatus = "medium";
        } else {
            capacityStatus = "low";
        }

        let recommendation;

        if (capacityStatus === "high") {
            recommendation =
                "«·÷€ÿ ⁄·Ï «·ÿ»«Œ ⁄«·Ì° Ì›÷·  ﬁ·Ì· «” ﬁ»«· «·ÿ·»«  «·ÃœÌœ… √Ê “Ì«œ… «·ﬂ„Ì«  «·„ Ê›—….";
        } else if (capacityStatus === "medium") {
            recommendation =
                "«·ÿ»«Œ ⁄‰œÂ ÷€ÿ „ Ê”ÿ° Ì›÷· „ «»⁄… «·ÿ·»«  Ê«·ﬂ„Ì«  «·„ Ê›—… ﬁ»· «” ﬁ»«· ÿ·»«  ≈÷«›Ì….";
        } else {
            recommendation =
                "«·”⁄… «·Õ«·Ì… „‰«”»…° Ê«·ÿ»«Œ Ìﬂœ— Ì” ﬁ»· ÿ·»«  ≈÷«›Ì….";
        }

        res.json({
            success: true,
            cook: cookResult.rows[0],
            capacity: {
                active_orders: activeOrders,
                scheduled_orders: scheduledOrders,
                requested_quantity: requestedQuantity,
                available_meals: availableMeals,
                available_quantity: availableQuantity,
                total_demand: totalDemand,
                pressure_score: pressureScore,
                status: capacityStatus,
                recommendation
            }
        });

    } catch (error) {
        console.error("Cook capacity error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    getCookCapacity
};
