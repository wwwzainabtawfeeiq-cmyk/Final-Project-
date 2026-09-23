const express = require("express");

const {
    getMyPreferences,
    updateMyPreferences
} = require("../controllers/preferenceController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, authorizeRoles("customer"), getMyPreferences);

router.put("/", authenticateToken, authorizeRoles("customer"), updateMyPreferences);

module.exports = router;
