const express = require("express");

const {
    createGroupOrder,
    joinGroupOrder,
    addGroupOrderItem,
    getGroupOrder,
    getMyGroupOrders,
    confirmGroupOrder
} = require("../controllers/groupOrderController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    authenticateToken,
    authorizeRoles("customer"),
    createGroupOrder
);

router.get(
    "/my-orders",
    authenticateToken,
    authorizeRoles("customer"),
    getMyGroupOrders
);

router.get(
    "/:groupId",
    authenticateToken,
    authorizeRoles("customer"),
    getGroupOrder
);

router.post(
    "/:groupId/join",
    authenticateToken,
    authorizeRoles("customer"),
    joinGroupOrder
);

router.post(
    "/:groupId/items",
    authenticateToken,
    authorizeRoles("customer"),
    addGroupOrderItem
);

router.put(
    "/:groupId/confirm",
    authenticateToken,
    authorizeRoles("customer"),
    confirmGroupOrder
);

module.exports = router;
