const express = require("express");
const {
    createCookProfile,
    getMyCookProfile,
    updateCookProfile
} = require("../controllers/cookController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/profile",
    authenticateToken,
    authorizeRoles("cook"),
    createCookProfile
);

router.get(
    "/profile",
    authenticateToken,
    authorizeRoles("cook"),
    getMyCookProfile
);

router.put(
    "/profile",
    authenticateToken,
    authorizeRoles("cook"),
    updateCookProfile
);

module.exports = router;