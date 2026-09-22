const express = require("express");

const {
    createAddress,
    getMyAddresses,
    deleteAddress
} = require("../controllers/addressController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    authenticateToken,
    authorizeRoles("customer"),
    createAddress
);

router.get(
    "/",
    authenticateToken,
    authorizeRoles("customer"),
    getMyAddresses
);

router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("customer"),
    deleteAddress
);

module.exports = router;
