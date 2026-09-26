const pool = require("../config/db");

const createMealPlan = async (req, res) => {
    try {
        const { name, description, duration_days } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Meal plan name is required"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO meal_plans
            (user_id, name, description, duration_days)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [
                req.user.id,
                name,
                description || null,
                duration_days || 7
            ]
        );

        res.status(201).json({
            success: true,
            message: "Meal plan created successfully",
            meal_plan: result.rows[0]
        });

    } catch (error) {
        console.error("Create meal plan error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const addMealToPlan = async (req, res) => {
    try {
        const { planId } = req.params;
        const {
            meal_id,
            day_number,
            meal_type
        } = req.body;

        const plan = await pool.query(
            `
            SELECT id
            FROM meal_plans
            WHERE id = $1 AND user_id = $2
            `,
            [planId, req.user.id]
        );

        if (plan.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Meal plan not found"
            });
        }

        const meal = await pool.query(
            `
            SELECT id
            FROM meals
            WHERE id = $1 AND is_available = TRUE
            `,
            [meal_id]
        );

        if (meal.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Meal not found or unavailable"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO meal_plan_items
            (meal_plan_id, meal_id, day_number, meal_type)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [
                planId,
                meal_id,
                day_number,
                meal_type || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Meal added to plan successfully",
            item: result.rows[0]
        });

    } catch (error) {
        console.error("Add meal to plan error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const getMyMealPlans = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                mp.id,
                mp.name,
                mp.description,
                mp.duration_days,
                mp.created_at,
                COUNT(mpi.id) AS meals_count
            FROM meal_plans mp
            LEFT JOIN meal_plan_items mpi
                ON mpi.meal_plan_id = mp.id
            WHERE mp.user_id = $1
            GROUP BY mp.id
            ORDER BY mp.id DESC
            `,
            [req.user.id]
        );

        res.json({
            success: true,
            meal_plans: result.rows
        });

    } catch (error) {
        console.error("Get meal plans error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const getMealPlanById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT
                mp.id AS plan_id,
                mp.name AS plan_name,
                mp.description,
                mp.duration_days,
                mpi.id AS item_id,
                mpi.day_number,
                mpi.meal_type,
                m.id AS meal_id,
                m.name AS meal_name,
                m.description AS meal_description,
                m.price,
                m.image_url
            FROM meal_plans mp
            LEFT JOIN meal_plan_items mpi
                ON mpi.meal_plan_id = mp.id
            LEFT JOIN meals m
                ON m.id = mpi.meal_id
            WHERE mp.id = $1
              AND mp.user_id = $2
            ORDER BY mpi.day_number, mpi.id
            `,
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Meal plan not found"
            });
        }

        res.json({
            success: true,
            meal_plan: result.rows
        });

    } catch (error) {
        console.error("Get meal plan error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const removeMealFromPlan = async (req, res) => {
    try {
        const { itemId } = req.params;

        const result = await pool.query(
            `
            DELETE FROM meal_plan_items mpi
            USING meal_plans mp
            WHERE mpi.id = $1
              AND mpi.meal_plan_id = mp.id
              AND mp.user_id = $2
            RETURNING mpi.*
            `,
            [itemId, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Meal plan item not found"
            });
        }

        res.json({
            success: true,
            message: "Meal removed from plan successfully"
        });

    } catch (error) {
        console.error("Remove meal from plan error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    createMealPlan,
    addMealToPlan,
    getMyMealPlans,
    getMealPlanById,
    removeMealFromPlan
};