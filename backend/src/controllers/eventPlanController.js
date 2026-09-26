const pool = require("../config/db");

const createEventPlan = async (req, res) => {
    try {
        const {
            event_name,
            event_type,
            guest_count,
            budget,
            event_date,
            notes
        } = req.body;

        if (!event_name || !guest_count) {
            return res.status(400).json({
                success: false,
                message: "Event name and guest count are required"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO event_plans
            (
                customer_id,
                event_name,
                event_type,
                guest_count,
                budget,
                event_date,
                notes
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
            `,
            [
                req.user.id,
                event_name,
                event_type || null,
                guest_count,
                budget || null,
                event_date || null,
                notes || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Event plan created successfully",
            eventPlan: result.rows[0]
        });

    } catch (error) {
        console.error("Create event plan error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const getMyEventPlans = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT *
            FROM event_plans
            WHERE customer_id = $1
            ORDER BY id DESC
            `,
            [req.user.id]
        );

        res.json({
            success: true,
            eventPlans: result.rows
        });

    } catch (error) {
        console.error("Get event plans error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const getEventPlanById = async (req, res) => {
    try {
        const { id } = req.params;

        const plan = await pool.query(
            `
            SELECT *
            FROM event_plans
            WHERE id = $1
              AND customer_id = $2
            `,
            [id, req.user.id]
        );

        if (plan.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Event plan not found"
            });
        }

        const items = await pool.query(
            `
            SELECT
                epi.id,
                epi.meal_id,
                m.name AS meal_name,
                epi.quantity,
                epi.unit_price,
                (epi.quantity * epi.unit_price) AS total_price
            FROM event_plan_items epi
            JOIN meals m ON m.id = epi.meal_id
            WHERE epi.event_plan_id = $1
            ORDER BY epi.id
            `,
            [id]
        );

        res.json({
            success: true,
            eventPlan: plan.rows[0],
            items: items.rows
        });

    } catch (error) {
        console.error("Get event plan error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const addMealToEventPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { meal_id, quantity } = req.body;

        if (!meal_id || !quantity || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Meal and quantity are required"
            });
        }

        const plan = await pool.query(
            `
            SELECT id
            FROM event_plans
            WHERE id = $1
              AND customer_id = $2
            `,
            [id, req.user.id]
        );

        if (plan.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Event plan not found"
            });
        }

        const meal = await pool.query(
            `
            SELECT id, price
            FROM meals
            WHERE id = $1
            `,
            [meal_id]
        );

        if (meal.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Meal not found"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO event_plan_items
            (
                event_plan_id,
                meal_id,
                quantity,
                unit_price
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [
                id,
                meal_id,
                quantity,
                meal.rows[0].price
            ]
        );

        res.status(201).json({
            success: true,
            message: "Meal added to event plan successfully",
            item: result.rows[0]
        });

    } catch (error) {
        console.error("Add event meal error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const removeMealFromEventPlan = async (req, res) => {
    try {
        const { id, itemId } = req.params;

        const result = await pool.query(
            `
            DELETE FROM event_plan_items epi
            USING event_plans ep
            WHERE epi.id = $1
              AND epi.event_plan_id = ep.id
              AND ep.id = $2
              AND ep.customer_id = $3
            RETURNING epi.*
            `,
            [itemId, id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Event plan item not found"
            });
        }

        res.json({
            success: true,
            message: "Meal removed from event plan successfully"
        });

    } catch (error) {
        console.error("Remove event meal error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const updateEventPlanStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "draft",
            "planned",
            "completed",
            "cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        const result = await pool.query(
            `
            UPDATE event_plans
            SET status = $1
            WHERE id = $2
              AND customer_id = $3
            RETURNING *
            `,
            [status, id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Event plan not found"
            });
        }

        res.json({
            success: true,
            message: "Event plan status updated successfully",
            eventPlan: result.rows[0]
        });

    } catch (error) {
        console.error("Update event plan status error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const getEventPlanRecommendations = async (req, res) => {
    try {
        const { id } = req.params;

        const planResult = await pool.query(
            `
            SELECT id, event_type, guest_count, budget
            FROM event_plans
            WHERE id = $1
              AND customer_id = $2
            `,
            [id, req.user.id]
        );

        if (planResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Event plan not found"
            });
        }

        const plan = planResult.rows[0];
        const guests = Number(plan.guest_count);
        const budget = Number(plan.budget || 0);

        const mealsResult = await pool.query(
            `
            SELECT
                id,
                name,
                description,
                price,
                available_quantity,
                category_id,
                cook_id,
                tags
            FROM meals
            WHERE is_available = TRUE
              AND available_quantity > 0
            ORDER BY price ASC
            `
        );

        const recommendations = mealsResult.rows
            .map(meal => {
                const price = Number(meal.price);

                const suggestedQuantity = Math.min(
                    Math.max(1, Math.ceil(guests / 5)),
                    meal.available_quantity
                );

                const estimatedTotal = price * suggestedQuantity;

                let score = 0;

                if (budget > 0 && estimatedTotal <= budget) {
                    score += 40;
                }

                if (meal.available_quantity >= guests) {
                    score += 20;
                }

                if (price <= 20000) {
                    score += 10;
                }

                if (plan.event_type && Array.isArray(meal.tags)) {
                    const eventType = String(plan.event_type).toLowerCase();

                    if (
                        meal.tags.some(tag =>
                            String(tag).toLowerCase().includes(eventType)
                        )
                    ) {
                        score += 30;
                    }
                }

                return {
                    meal_id: meal.id,
                    meal_name: meal.name,
                    price: meal.price,
                    available_quantity: meal.available_quantity,
                    suggested_quantity: suggestedQuantity,
                    estimated_total: estimatedTotal,
                    score
                };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        res.json({
            success: true,
            eventPlan: {
                id: plan.id,
                event_type: plan.event_type,
                guest_count: guests,
                budget: plan.budget
            },
            recommendations
        });

    } catch (error) {
        console.error("Event recommendations error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    createEventPlan,
    getMyEventPlans,
    getEventPlanById,
    addMealToEventPlan,
    removeMealFromEventPlan,
    updateEventPlanStatus,
    getEventPlanRecommendations
};
