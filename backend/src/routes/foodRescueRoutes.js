const express = require("express");

const {
    createOffer,
    getAvailableOffers,
    claimOffer,
    getMyOffers
} = require("../controllers/foodRescueController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

// Customer: view available rescue offers
router.get(
    "/",
    authenticateToken,
    authorizeRoles("customer"),
    getAvailableOffers
);

// Cook: create rescue offer
router.post(
    "/",
    authenticateToken,
    authorizeRoles("cook"),
    createOffer
);

// Cook: view own rescue offers
router.get(
    "/my-offers",
    authenticateToken,
    authorizeRoles("cook"),
    getMyOffers
);

// Customer: claim rescue offer
router.post(
    "/:offerId/claim",
    authenticateToken,
    authorizeRoles("customer"),
    claimOffer
);

module.exports = router;