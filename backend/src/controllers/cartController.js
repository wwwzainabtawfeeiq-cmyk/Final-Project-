const pool = require('../config/db');

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private (Customer)
const getCart = async (req, res) => {
    try {
        const customerId = req.user.id;

        // Get or create cart
        let cartResult = await pool.query(
            'SELECT * FROM carts WHERE customer_id = $1',
            [customerId]
        );

        if (cartResult.rows.length === 0) {
            cartResult = await pool.query(
                'INSERT INTO carts (customer_id) VALUES ($1) RETURNING *',
                [customerId]
            );
        }

        const cart = cartResult.rows[0];

        // Get cart items
        const itemsResult = await pool.query(
            `SELECT 
                ci.id,
                ci.quantity,
                ci.added_at,
                m.id AS meal_id,
                m.name AS meal_name,
                m.description,
                m.price,
                m.image_url,
                m.is_available,
                m.available_quantity,
                u.id AS cook_id,
                u.name AS cook_name
            FROM cart_items ci
            JOIN meals m ON ci.meal_id = m.id
            JOIN users u ON m.cook_id = u.id
            WHERE ci.cart_id = $1
            ORDER BY ci.added_at DESC`,
            [cart.id]
        );

        const total = itemsResult.rows.reduce(
            (sum, item) => sum + (parseFloat(item.price) * item.quantity),
            0
        );

        res.json({
            success: true,
            data: {
                cart_id: cart.id,
                items: itemsResult.rows,
                total: total.toFixed(2),
                item_count: itemsResult.rows.length
            }
        });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Add meal to cart
// @route   POST /api/cart/add
// @access  Private (Customer)
const addToCart = async (req, res) => {
    try {
        const customerId = req.user.id;
        const { meal_id, quantity = 1 } = req.body;

        if (!meal_id) {
            return res.status(400).json({ success: false, message: 'meal_id is required' });
        }

        if (quantity < 1) {
            return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
        }

        // Check meal exists and available
        const mealResult = await pool.query(
            'SELECT * FROM meals WHERE id = $1 AND is_available = TRUE',
            [meal_id]
        );

        if (mealResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Meal not found or unavailable' });
        }

        const meal = mealResult.rows[0];

        if (meal.available_quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${meal.available_quantity} available`
            });
        }

        // Get or create cart
        let cartResult = await pool.query(
            'SELECT * FROM carts WHERE customer_id = $1',
            [customerId]
        );

        if (cartResult.rows.length === 0) {
            cartResult = await pool.query(
                'INSERT INTO carts (customer_id) VALUES ($1) RETURNING *',
                [customerId]
            );
        }

        const cartId = cartResult.rows[0].id;

        // Check if meal already in cart
        const existing = await pool.query(
            'SELECT * FROM cart_items WHERE cart_id = $1 AND meal_id = $2',
            [cartId, meal_id]
        );

        if (existing.rows.length > 0) {
            await pool.query(
                'UPDATE cart_items SET quantity = quantity + $1 WHERE cart_id = $2 AND meal_id = $3',
                [quantity, cartId, meal_id]
            );
        } else {
            await pool.query(
                'INSERT INTO cart_items (cart_id, meal_id, quantity) VALUES ($1, $2, $3)',
                [cartId, meal_id, quantity]
            );
        }

        res.json({ success: true, message: 'Added to cart' });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/item/:id
// @access  Private (Customer)
const updateCartItem = async (req, res) => {
    try {
        const customerId = req.user.id;
        const itemId = req.params.id;
        const { quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
        }

        const result = await pool.query(
            `UPDATE cart_items ci
             SET quantity = $1
             FROM carts c
             WHERE ci.id = $2 
               AND ci.cart_id = c.id 
               AND c.customer_id = $3
             RETURNING ci.*`,
            [quantity, itemId, customerId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        res.json({ success: true, message: 'Cart updated' });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/item/:id
// @access  Private (Customer)
const removeFromCart = async (req, res) => {
    try {
        const customerId = req.user.id;
        const itemId = req.params.id;

        const result = await pool.query(
            `DELETE FROM cart_items ci
             USING carts c
             WHERE ci.id = $1 
               AND ci.cart_id = c.id 
               AND c.customer_id = $2
             RETURNING ci.*`,
            [itemId, customerId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        res.json({ success: true, message: 'Removed from cart' });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private (Customer)
const clearCart = async (req, res) => {
    try {
        const customerId = req.user.id;

        await pool.query(
            `DELETE FROM cart_items ci
             USING carts c
             WHERE ci.cart_id = c.id AND c.customer_id = $1`,
            [customerId]
        );

        res.json({ success: true, message: 'Cart cleared' });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};
