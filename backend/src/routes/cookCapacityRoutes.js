const express = require("express");
const router = express.Router();

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const {
    getCookCapacity
} = require("../controllers/cookCapacityController");

router.get(
    "/capacity",
    authenticateToken,
    authorizeRoles("cook"),
    getCookCapacity
);

module.exports = router;
