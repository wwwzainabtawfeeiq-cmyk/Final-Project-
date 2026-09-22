const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/orderController');

const {
    authenticateToken,
    authorizeRoles
} = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.post('/', authorizeRoles('customer'), placeOrder);
router.post('/custom', authorizeRoles('customer'), placeCustomOrder);
router.get('/my-orders', authorizeRoles('customer'), getMyOrders);
router.put('/:id/cancel', authorizeRoles('customer'), cancelOrder);

router.get('/cook-orders', authorizeRoles('cook'), getCookOrders);
router.put('/:id/status', authorizeRoles('cook'), updateOrderStatus);
router.put('/:id/quote', authorizeRoles('cook'), sendCustomOrderQuote);

router.get('/scheduled', getScheduledOrders);
router.get('/custom/:id', getCustomOrderDetails);
router.get('/:id', getOrderById);

module.exports = router;
