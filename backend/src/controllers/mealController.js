const pool = require("../config/db");

async function createMeal(req, res) {
    try {
        const {
            category_id,
            name,
            description,
            price,
            available_quantity,
            image_url
        } = req.body;

        const cookId = req.user.id;

        if (!name || price === undefined) {
            return res.status(400).json({
                message: "Meal name and price are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO meals
            (cook_id, category_id, name, description, price, available_quantity, image_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [
                cookId,
                category_id || null,
                name,
                description || null,
                price,
                available_quantity || 0,
                image_url || null
            ]
        );

        res.status(201).json({
            message: "Meal created successfully",
            meal: result.rows[0]
        });

    } catch (error) {
        console.error("Create meal error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
}

async function getMyMeals(req, res) {
    try {
        const cookId = req.user.id;

        const result = await pool.query(
            `SELECT
                m.*,
                c.name AS category_name
             FROM meals m
             LEFT JOIN categories c
                ON m.category_id = c.id
             WHERE m.cook_id = $1
             ORDER BY m.created_at DESC`,
            [cookId]
        );

        res.json({
            meals: result.rows
        });

    } catch (error) {
        console.error("Get meals error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
}

async function updateMeal(req, res) {
    try {
        const mealId = req.params.id;
        const cookId = req.user.id;

        const {
            category_id,
            name,
            description,
            price,
            available_quantity,
            is_available,
            image_url
        } = req.body;

        const result = await pool.query(
            `UPDATE meals
             SET category_id = $1,
                 name = $2,
                 description = $3,
                 price = $4,
                 available_quantity = $5,
                 is_available = $6,
                 image_url = $7
             WHERE id = $8
             AND cook_id = $9
             RETURNING *`,
            [
                category_id || null,
                name,
                description || null,
                price,
                available_quantity,
                is_available,
                image_url || null,
                mealId,
                cookId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Meal not found"
            });
        }

        res.json({
            message: "Meal updated successfully",
            meal: result.rows[0]
        });

    } catch (error) {
        console.error("Update meal error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
}

async function deleteMeal(req, res) {
    try {
        const mealId = req.params.id;
        const cookId = req.user.id;

        const result = await pool.query(
            `DELETE FROM meals
             WHERE id = $1
             AND cook_id = $2
             RETURNING id`,
            [mealId, cookId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Meal not found"
            });
        }

        res.json({
            message: "Meal deleted successfully",
            meal_id: result.rows[0].id
        });

    } catch (error) {
        console.error("Delete meal error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
}

module.exports = {
    createMeal,
    getMyMeals,
    updateMeal,
    deleteMeal
};