const express = require('express');
const router = express.Router();
const {
    placeOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getCookOrders,
    updateOrderStatus
} = require('../controllers/orderController');

const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Customer routes
router.post('/', authorize('customer'), placeOrder);
router.get('/my-orders', authorize('customer'), getMyOrders);
router.put('/:id/cancel', authorize('customer'), cancelOrder);

// Cook routes
router.get('/cook-orders', authorize('cook'), getCookOrders);
router.put('/:id/status', authorize('cook'), updateOrderStatus);

// Shared (Customer or Cook)
router.get('/:id', getOrderById);

module.exports = router;
