const express = require("express");

const {
    getSmartRecommendations,
    explainRecommendation
} = require("../controllers/recommendationController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/",
    authenticateToken,
    authorizeRoles("customer"),
    getSmartRecommendations
);

router.get(
    "/explain/:mealId",
    authenticateToken,
    authorizeRoles("customer"),
    explainRecommendation
);

module.exports = router;
