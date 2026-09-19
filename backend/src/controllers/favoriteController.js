const pool = require('../config/db');

const getMyFavorites = async (req, res) => {
    try {
        const customerId = req.user.id;

        const result = await pool.query(
            `SELECT 
                f.id AS favorite_id,
                f.created_at AS favorited_at,
                m.id AS meal_id,
                m.name AS meal_name,
                m.description,
                m.price,
                m.image_url,
                m.is_available,
                u.id AS cook_id,
                u.name AS cook_name
            FROM favorites f
            JOIN meals m ON f.meal_id = m.id
            JOIN users u ON m.cook_id = u.id
            WHERE f.customer_id = $1
            ORDER BY f.created_at DESC`,
            [customerId]
        );

        res.json({
            success: true,
            data: result.rows,
            count: result.rows.length
        });
    } catch (error) {
        console.error('Get favorites error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const addToFavorites = async (req, res) => {
    try {
        const customerId = req.user.id;
        const { meal_id } = req.body;

        if (!meal_id) {
            return res.status(400).json({ success: false, message: 'meal_id is required' });
        }

        const mealResult = await pool.query(
            'SELECT id FROM meals WHERE id = $1',
            [meal_id]
        );

        if (mealResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Meal not found' });
        }

        const existing = await pool.query(
            'SELECT id FROM favorites WHERE customer_id = $1 AND meal_id = $2',
            [customerId, meal_id]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Already in favorites' });
        }

        const result = await pool.query(
            `INSERT INTO favorites (customer_id, meal_id)
             VALUES ($1, $2)
             RETURNING *`,
            [customerId, meal_id]
        );

        res.status(201).json({
            success: true,
            message: 'Added to favorites',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Add to favorites error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const removeFromFavorites = async (req, res) => {
    try {
        const customerId = req.user.id;
        const mealId = req.params.mealId;

        const result = await pool.query(
            `DELETE FROM favorites
             WHERE customer_id = $1 AND meal_id = $2
             RETURNING *`,
            [customerId, mealId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Not in favorites' });
        }

        res.json({ success: true, message: 'Removed from favorites' });
    } catch (error) {
        console.error('Remove from favorites error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const checkFavorite = async (req, res) => {
    try {
        const customerId = req.user.id;
        const mealId = req.params.mealId;

        const result = await pool.query(
            'SELECT id FROM favorites WHERE customer_id = $1 AND meal_id = $2',
            [customerId, mealId]
        );

        res.json({
            success: true,
            data: { is_favorited: result.rows.length > 0 }
        });
    } catch (error) {
        console.error('Check favorite error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getMyFavorites,
    addToFavorites,
    removeFromFavorites,
    checkFavorite
};
