const express = require("express");

const {
    getAdminInsights
} = require("../controllers/adminInsightsController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    getAdminInsights
);

module.exports = router;