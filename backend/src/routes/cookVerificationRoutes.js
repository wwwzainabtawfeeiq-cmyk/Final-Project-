const express = require("express");

const {
    verifyCook,
    unverifyCook,
    getCookTrustScore
} = require("../controllers/cookVerificationController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.put(
    "/:id/verify",
    authenticateToken,
    authorizeRoles("admin"),
    verifyCook
);

router.put(
    "/:id/unverify",
    authenticateToken,
    authorizeRoles("admin"),
    unverifyCook
);

router.get(
    "/:id/trust-score",
    authenticateToken,
    authorizeRoles("admin"),
    getCookTrustScore
);

module.exports = router;