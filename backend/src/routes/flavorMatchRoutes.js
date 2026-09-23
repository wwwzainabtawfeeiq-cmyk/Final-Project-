const express = require("express");
const router = express.Router();

const {
    getFlavorMatch
} = require("../controllers/flavorMatchController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

router.get(
    "/:mealId",
    authenticateToken,
    authorizeRoles("customer"),
    getFlavorMatch
);

module.exports = router;
