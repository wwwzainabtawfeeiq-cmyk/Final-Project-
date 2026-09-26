const pool = require('../config/db');
const { createNotification } = require('./notificationController');

const placeOrder = async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const customerId = req.user.id;
        const { address_id, scheduled_at, notes } = req.body;

        const cartResult = await client.query(
            `SELECT 
                ci.meal_id,
                ci.quantity,
                m.price,
                m.cook_id,
                m.is_available,
                m.available_quantity
            FROM cart_items ci
            JOIN carts c ON ci.cart_id = c.id
            JOIN meals m ON ci.meal_id = m.id
            WHERE c.customer_id = $1`,
            [customerId]
        );

        if (cartResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        const cartItems = cartResult.rows;

        for (const item of cartItems) {
            if (!item.is_available) {
                await client.query('ROLLBACK');
                return res.status(400).json({ success: false, message: 'Some meals are unavailable' });
            }
            if (item.available_quantity < item.quantity) {
                await client.query('ROLLBACK');
                return res.status(400).json({ success: false, message: 'Insufficient quantity' });
            }
        }

        const cookIds = [...new Set(cartItems.map(i => i.cook_id))];
        if (cookIds.length > 1) {
            await client.query('ROLLBACK');
            return res.status(400).json({ success: false, message: 'All meals must be from same cook' });
        }

        const chefId = cookIds[0];
        const total = cartItems.reduce((sum, i) => sum + (parseFloat(i.price) * i.quantity), 0);
        const orderType = scheduled_at ? 'scheduled' : 'daily';
        const initialStatus = scheduled_at ? 'scheduled' : 'pending';

        const orderResult = await client.query(
            `INSERT INTO orders 
                (customer_id, chef_id, address_id, order_type, total_amount, status, scheduled_at, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [customerId, chefId, address_id, orderType, total, initialStatus, scheduled_at, notes]
        );

        const order = orderResult.rows[0];

        for (const item of cartItems) {
            await client.query(
                `INSERT INTO order_items (order_id, meal_id, quantity, price)
                 VALUES ($1, $2, $3, $4)`,
                [order.id, item.meal_id, item.quantity, item.price]
            );

            await client.query(
                `UPDATE meals SET available_quantity = available_quantity - $1
                 WHERE id = $2`,
                [item.quantity, item.meal_id]
            );
        }

        await client.query(
            `INSERT INTO order_status_history (order_id, status, changed_by, notes)
             VALUES ($1, $2, $3, $4)`,
            [order.id, initialStatus, customerId, `Order placed as ${orderType}`]
        );

        await client.query(
            `DELETE FROM cart_items ci
             USING carts c
             WHERE ci.cart_id = c.id AND c.customer_id = $1`,
            [customerId]
        );

        await client.query('COMMIT');

        await createNotification(
            chefId,
            scheduled_at ? 'New Scheduled Order' : 'New Order',
            scheduled_at
                ? `You have a new scheduled order #${order.id} for ${scheduled_at}`
                : `You have a new order #${order.id} worth ${total} IQD`,
            'order',
            order.id
        );

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: order
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Place order error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    } finally {
        client.release();
    }
};

const { analyzeCustomOrder, recommendMealsForCustomOrder } = require('../services/customOrderAIService');

const placeCustomOrder = async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const customerId = req.user.id;
        const {
            chef_id,
            address_id,
            description,
            budget,
            reference_image_url,
            special_instructions,
            scheduled_at
        } = req.body;

        const aiAnalysis = analyzeCustomOrder({
            description,
            budget,
            special_instructions
        });

        const mealsResult = await pool.query(
            `SELECT id, name, description, price, tags, available_quantity, is_available, cook_id
             FROM meals
             WHERE cook_id = $1
             ORDER BY id`,
            [chef_id]
        );

        const recommendedMeals = recommendMealsForCustomOrder({
            meals: mealsResult.rows,
            detectedTags: aiAnalysis.detected_tags,
            budget
        });

        if (!chef_id || !description) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: 'chef_id and description are required'
            });
        }

        const chefCheck = await client.query(
            'SELECT id FROM users WHERE id = $1 AND role = $2',
            [chef_id, 'cook']
        );

        if (chefCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ success: false, message: 'Chef not found' });
        }

        const orderResult = await client.query(
            `INSERT INTO orders 
                (customer_id, chef_id, address_id, order_type, total_amount, status, scheduled_at, notes)
             VALUES ($1, $2, $3, 'custom', 0, 'pending', $4, $5)
             RETURNING *`,
            [customerId, chef_id, address_id, scheduled_at, special_instructions]
        );

        const order = orderResult.rows[0];

        await client.query(
            `INSERT INTO custom_order_requests 
                (order_id, description, budget, reference_image_url, special_instructions)
             VALUES ($1, $2, $3, $4, $5)`,
            [order.id, description, budget, reference_image_url, special_instructions]
        );

        await client.query(
            `INSERT INTO order_status_history (order_id, status, changed_by, notes)
             VALUES ($1, 'pending', $2, 'Custom order request placed')`,
            [order.id, customerId]
        );

        await client.query('COMMIT');

        await createNotification(
            chef_id,
            'New Custom Order Request',
            `You have a new custom order request #${order.id}`,
            'order',
            order.id
        );

        res.status(201).json({
            success: true,
            message: 'Custom order request placed successfully',
            data: {
                order,
                ai_analysis: { ...aiAnalysis, recommended_meals: recommendedMeals }
            }
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Place custom order error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    } finally {
        client.release();
    }
};

const sendCustomOrderQuote = async (req, res) => {
    try {
        const cookId = req.user.id;
        const orderId = req.params.id;
        const { proposed_price } = req.body;

        if (!proposed_price || proposed_price <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid proposed price' });
        }

        const orderCheck = await pool.query(
            `SELECT o.*, cor.id AS custom_request_id
             FROM orders o
             JOIN custom_order_requests cor ON cor.order_id = o.id
             WHERE o.id = $1 AND o.chef_id = $2 AND o.order_type = 'custom'`,
            [orderId, cookId]
        );

        if (orderCheck.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Custom order not found' });
        }

        const order = orderCheck.rows[0];

        const result = await pool.query(
            `UPDATE orders
             SET total_amount = $1, status = 'accepted'
             WHERE id = $2
             RETURNING *`,
            [proposed_price, orderId]
        );

        await pool.query(
            `INSERT INTO order_status_history (order_id, status, changed_by, notes)
             VALUES ($1, 'accepted', $2, $3)`,
            [orderId, cookId, `Quote sent: ${proposed_price} IQD`]
        );

        await createNotification(
            order.customer_id,
            'Custom Order Quote',
            `Your custom order #${order.id} quote is ${proposed_price} IQD`,
            'order',
            order.id
        );

        res.json({
            success: true,
            message: 'Quote sent successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Send custom order quote error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getScheduledOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        let query = `
            SELECT 
                o.*,
                u.name AS other_party_name
            FROM orders o
            JOIN users u ON u.id = CASE 
                WHEN $1 = 'customer' THEN o.chef_id
                ELSE o.customer_id
            END
            WHERE o.order_type IN ('scheduled', 'custom')
              AND o.status IN ('scheduled', 'pending', 'accepted', 'preparing')
        `;

        const params = [userRole];

        if (userRole === 'customer') {
            query += ` AND o.customer_id = $2`;
            params.push(userId);
        } else if (userRole === 'cook') {
            query += ` AND o.chef_id = $2`;
            params.push(userId);
        } else {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        query += ` ORDER BY o.scheduled_at ASC NULLS LAST, o.created_at DESC`;

        const result = await pool.query(query, params);

        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Get scheduled orders error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getCustomOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;

        const result = await pool.query(
            `SELECT 
                o.*,
                cor.description,
                cor.budget,
                cor.reference_image_url,
                cor.special_instructions,
                cor.created_at AS request_created_at
            FROM orders o
            JOIN custom_order_requests cor ON cor.order_id = o.id
            WHERE o.id = $1`,
            [orderId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Custom order not found' });
        }

        const order = result.rows[0];

        if (userRole === 'customer' && order.customer_id !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        if (userRole === 'cook' && order.chef_id !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        res.json({ success: true, data: order });
    } catch (error) {
        console.error('Get custom order details error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const customerId = req.user.id;

        const result = await pool.query(
            `SELECT 
                o.*,
                u.name AS cook_name
            FROM orders o
            JOIN users u ON o.chef_id = u.id
            WHERE o.customer_id = $1
            ORDER BY o.created_at DESC`,
            [customerId]
        );

        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Get my orders error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getOrderById = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const orderId = req.params.id;

        const orderResult = await pool.query(
            `SELECT 
                o.*,
                u.name AS cook_name,
                u.id AS cook_user_id
            FROM orders o
            JOIN users u ON o.chef_id = u.id
            WHERE o.id = $1`,
            [orderId]
        );

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const order = orderResult.rows[0];

        if (userRole === 'customer' && order.customer_id !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        if (userRole === 'cook' && order.chef_id !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const itemsResult = await pool.query(
            `SELECT 
                oi.*,
                m.name AS meal_name,
                m.image_url
            FROM order_items oi
            JOIN meals m ON oi.meal_id = m.id
            WHERE oi.order_id = $1`,
            [orderId]
        );

        const historyResult = await pool.query(
            `SELECT * FROM order_status_history
             WHERE order_id = $1
             ORDER BY created_at ASC`,
            [orderId]
        );

        res.json({
            success: true,
            data: {
                ...order,
                items: itemsResult.rows,
                status_history: historyResult.rows
            }
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const customerId = req.user.id;
        const orderId = req.params.id;

        const result = await pool.query(
            `UPDATE orders
             SET status = 'cancelled'
             WHERE id = $1 
               AND customer_id = $2
               AND status IN ('pending', 'accepted', 'scheduled')
             RETURNING *`,
            [orderId, customerId]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Order cannot be cancelled'
            });
        }

        const order = result.rows[0];

        await pool.query(
            `INSERT INTO order_status_history (order_id, status, changed_by, notes)
             VALUES ($1, 'cancelled', $2, 'Cancelled by customer')`,
            [orderId, customerId]
        );

        await createNotification(
            order.chef_id,
            'Order Cancelled',
            `Order #${order.id} was cancelled by the customer`,
            'order',
            order.id
        );

        res.json({ success: true, message: 'Order cancelled' });
    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getCookOrders = async (req, res) => {
    try {
        const cookId = req.user.id;

        const result = await pool.query(
            `SELECT 
                o.*,
                u.name AS customer_name,
                u.email AS customer_email
            FROM orders o
            JOIN users u ON o.customer_id = u.id
            WHERE o.chef_id = $1
            ORDER BY o.created_at DESC`,
            [cookId]
        );

        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Get cook orders error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const cookId = req.user.id;
        const orderId = req.params.id;
        const { status } = req.body;

        const validStatuses = ['accepted', 'rejected', 'preparing', 'ready', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const result = await pool.query(
            `UPDATE orders
             SET status = $1
             WHERE id = $2 AND chef_id = $3
             RETURNING *`,
            [status, orderId, cookId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const order = result.rows[0];

        await pool.query(
            `INSERT INTO order_status_history (order_id, status, changed_by, notes)
             VALUES ($1, $2, $3, $4)`,
            [orderId, status, cookId, `Status: ${status}`]
        );

        const statusMessages = {
            'accepted': 'Your order has been accepted',
            'rejected': 'Your order has been rejected',
            'preparing': 'Your order is being prepared',
            'ready': 'Your order is ready',
            'delivered': 'Your order has been delivered',
            'cancelled': 'Your order has been cancelled'
        };

        if (statusMessages[status]) {
            await createNotification(
                order.customer_id,
                'Order Status Update',
                `${statusMessages[status]} - Order #${order.id}`,
                'order',
                order.id
            );
        }

        res.json({ success: true, message: 'Status updated' });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    placeOrder,
    placeCustomOrder,
    sendCustomOrderQuote,
    getScheduledOrders,
    getCustomOrderDetails,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getCookOrders,
    updateOrderStatus
};






