const express = require("express");

const {
    getCookInsights
} = require("../controllers/cookInsightsController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/",
    authenticateToken,
    authorizeRoles("cook"),
    getCookInsights
);

module.exports = router;
