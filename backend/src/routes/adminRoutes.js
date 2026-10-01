const express = require("express");

const {
    getUsers,
    getUserById,
    getAllOrders,
    updateUserRole,
    deleteUser
} = require("../controllers/adminController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/orders",
    authenticateToken,
    authorizeRoles("admin"),
    getAllOrders
);

router.get(
    "/users",
    authenticateToken,
    authorizeRoles("admin"),
    getUsers
);

router.get(
    "/users/:id",
    authenticateToken,
    authorizeRoles("admin"),
    getUserById
);

router.put(
    "/users/:id/role",
    authenticateToken,
    authorizeRoles("admin"),
    updateUserRole
);

router.delete(
    "/users/:id",
    authenticateToken,
    authorizeRoles("admin"),
    deleteUser
);

module.exports = router;

