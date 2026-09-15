const express = require('express');
const router = express.Router();
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require('../controllers/cartController');

const { protect, authorize } = require('../middleware/authMiddleware');

// All cart routes require authentication + customer role
router.use(protect);
router.use(authorize('customer'));

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/item/:id', updateCartItem);
router.delete('/item/:id', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;
