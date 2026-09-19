const express = require('express');
const router = express.Router();
const {
    getMyFavorites,
    addToFavorites,
    removeFromFavorites,
    checkFavorite
} = require('../controllers/favoriteController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('customer'));

router.get('/', getMyFavorites);
router.post('/', addToFavorites);
router.delete('/:mealId', removeFromFavorites);
router.get('/check/:mealId', checkFavorite);

module.exports = router;
