const pool = require('../config/db');
const { createNotification } = require('./notificationController');

const createReview = async (req, res) => {
    try {
        const customerId = req.user.id;
        const { order_id, meal_id, rating, comment } = req.body;

        if (!order_id || !meal_id || !rating) {
            return res.status(400).json({
                success: false,
                message: 'order_id, meal_id, and rating are required'
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        const orderCheck = await pool.query(
            `SELECT o.id, o.chef_id
             FROM orders o
             JOIN order_items oi ON oi.order_id = o.id
             WHERE o.id = $1 
               AND o.customer_id = $2 
               AND oi.meal_id = $3
               AND o.status = 'delivered'`,
            [order_id, customerId, meal_id]
        );

        if (orderCheck.rows.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'You can only review meals from your delivered orders'
            });
        }

        const cookId = orderCheck.rows[0].chef_id;

        const existing = await pool.query(
            'SELECT id FROM reviews WHERE order_id = $1 AND meal_id = $2',
            [order_id, meal_id]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'You already reviewed this meal for this order'
            });
        }

        const result = await pool.query(
            `INSERT INTO reviews (order_id, customer_id, meal_id, cook_id, rating, comment)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [order_id, customerId, meal_id, cookId, rating, comment]
        );

        await updateCookRating(cookId);

        await createNotification(
            cookId,
            'New Review',
            `You received a ${rating}-star review on your meal`,
            'review',
            result.rows[0].id
        );

        res.status(201).json({
            success: true,
            message: 'Review added successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getMealReviews = async (req, res) => {
    try {
        const mealId = req.params.mealId;
        const { limit = 20, offset = 0 } = req.query;

        const result = await pool.query(
            `SELECT 
                r.id,
                r.rating,
                r.comment,
                r.created_at,
                u.name AS customer_name
            FROM reviews r
            JOIN users u ON r.customer_id = u.id
            WHERE r.meal_id = $1
            ORDER BY r.created_at DESC
            LIMIT $2 OFFSET $3`,
            [mealId, limit, offset]
        );

        const stats = await pool.query(
            `SELECT 
                COUNT(*) AS total_reviews,
                COALESCE(AVG(rating), 0) AS average_rating,
                COUNT(CASE WHEN rating = 5 THEN 1 END) AS five_stars,
                COUNT(CASE WHEN rating = 4 THEN 1 END) AS four_stars,
                COUNT(CASE WHEN rating = 3 THEN 1 END) AS three_stars,
                COUNT(CASE WHEN rating = 2 THEN 1 END) AS two_stars,
                COUNT(CASE WHEN rating = 1 THEN 1 END) AS one_star
            FROM reviews
            WHERE meal_id = $1`,
            [mealId]
        );

        res.json({
            success: true,
            data: {
                reviews: result.rows,
                stats: {
                    total_reviews: parseInt(stats.rows[0].total_reviews),
                    average_rating: parseFloat(stats.rows[0].average_rating).toFixed(2),
                    breakdown: {
                        5: parseInt(stats.rows[0].five_stars),
                        4: parseInt(stats.rows[0].four_stars),
                        3: parseInt(stats.rows[0].three_stars),
                        2: parseInt(stats.rows[0].two_stars),
                        1: parseInt(stats.rows[0].one_star)
                    }
                }
            }
        });
    } catch (error) {
        console.error('Get meal reviews error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getCookReviews = async (req, res) => {
    try {
        const cookId = req.params.cookId;
        const { limit = 20, offset = 0 } = req.query;

        const result = await pool.query(
            `SELECT 
                r.id,
                r.rating,
                r.comment,
                r.created_at,
                u.name AS customer_name,
                m.name AS meal_name
            FROM reviews r
            JOIN users u ON r.customer_id = u.id
            LEFT JOIN meals m ON r.meal_id = m.id
            WHERE r.cook_id = $1
            ORDER BY r.created_at DESC
            LIMIT $2 OFFSET $3`,
            [cookId, limit, offset]
        );

        const stats = await pool.query(
            `SELECT 
                COUNT(*) AS total_reviews,
                COALESCE(AVG(rating), 0) AS average_rating
            FROM reviews
            WHERE cook_id = $1`,
            [cookId]
        );

        res.json({
            success: true,
            data: {
                reviews: result.rows,
                stats: {
                    total_reviews: parseInt(stats.rows[0].total_reviews),
                    average_rating: parseFloat(stats.rows[0].average_rating).toFixed(2)
                }
            }
        });
    } catch (error) {
        console.error('Get cook reviews error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getMyReviews = async (req, res) => {
    try {
        const customerId = req.user.id;

        const result = await pool.query(
            `SELECT 
                r.id,
                r.rating,
                r.comment,
                r.created_at,
                m.name AS meal_name,
                m.image_url,
                u.name AS cook_name
            FROM reviews r
            JOIN meals m ON r.meal_id = m.id
            JOIN users u ON r.cook_id = u.id
            WHERE r.customer_id = $1
            ORDER BY r.created_at DESC`,
            [customerId]
        );

        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Get my reviews error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updateReview = async (req, res) => {
    try {
        const customerId = req.user.id;
        const reviewId = req.params.id;
        const { rating, comment } = req.body;

        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        const result = await pool.query(
            `UPDATE reviews
             SET rating = COALESCE($1, rating),
                 comment = COALESCE($2, comment),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $3 AND customer_id = $4
             RETURNING *`,
            [rating, comment, reviewId, customerId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        await updateCookRating(result.rows[0].cook_id);

        res.json({
            success: true,
            message: 'Review updated',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const deleteReview = async (req, res) => {
    try {
        const customerId = req.user.id;
        const reviewId = req.params.id;

        const result = await pool.query(
            'DELETE FROM reviews WHERE id = $1 AND customer_id = $2 RETURNING *',
            [reviewId, customerId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        await updateCookRating(result.rows[0].cook_id);

        res.json({ success: true, message: 'Review deleted' });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updateCookRating = async (cookId) => {
    try {
        await pool.query(
            `UPDATE cook_profiles
             SET rating = (
                 SELECT COALESCE(AVG(rating), 0)
                 FROM reviews
                 WHERE cook_id = $1
             )
             WHERE user_id = $1`,
            [cookId]
        );
    } catch (error) {
        console.error('Update cook rating error:', error);
    }
};

module.exports = {
    createReview,
    getMealReviews,
    getCookReviews,
    getMyReviews,
    updateReview,
    deleteReview
};
