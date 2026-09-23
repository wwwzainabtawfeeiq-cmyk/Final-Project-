const express = require("express");

const {
    getSmartRecommendations
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

module.exports = router;
