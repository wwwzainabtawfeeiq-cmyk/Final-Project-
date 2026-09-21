const express = require('express');
const router = express.Router();
const {
    createReview,
    getMealReviews,
    getCookReviews,
    getMyReviews,
    updateReview,
    deleteReview
} = require('../controllers/reviewController');

const {
    authenticateToken,
    authorizeRoles
} = require('../middleware/authMiddleware');

router.get('/meal/:mealId', getMealReviews);
router.get('/cook/:cookId', getCookReviews);

router.use(authenticateToken);

router.post('/', authorizeRoles('customer'), createReview);
router.get('/my-reviews', authorizeRoles('customer'), getMyReviews);
router.put('/:id', authorizeRoles('customer'), updateReview);
router.delete('/:id', authorizeRoles('customer'), deleteReview);

module.exports = router;
