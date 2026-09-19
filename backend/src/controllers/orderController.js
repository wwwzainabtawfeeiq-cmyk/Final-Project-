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

        const orderResult = await client.query(
            `INSERT INTO orders 
                (customer_id, chef_id, address_id, total_amount, status, scheduled_at, notes)
             VALUES ($1, $2, $3, $4, 'pending', $5, $6)
             RETURNING *`,
            [customerId, chefId, address_id, total, scheduled_at, notes]
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
             VALUES ($1, 'pending', $2, 'Order placed')`,
            [order.id, customerId]
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
            'طلب جديد',
            `لديك طلب جديد #${order.id} بقيمة ${total} دينار`,
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
               AND status IN ('pending', 'accepted')
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
            'تم إلغاء الطلب',
            `تم إلغاء الطلب #${order.id} من قبل الزبون`,
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
            'accepted': 'تم قبول طلبك',
            'rejected': 'تم رفض طلبك',
            'preparing': 'طلبك قيد التحضير',
            'ready': 'طلبك جاهز',
            'delivered': 'تم توصيل طلبك',
            'cancelled': 'تم إلغاء طلبك'
        };

        if (statusMessages[status]) {
            await createNotification(
                order.customer_id,
                'تحديث حالة الطلب',
                `${statusMessages[status]} - الطلب #${order.id}`,
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
    getMyOrders,
    getOrderById,
    cancelOrder,
    getCookOrders,
    updateOrderStatus
};
