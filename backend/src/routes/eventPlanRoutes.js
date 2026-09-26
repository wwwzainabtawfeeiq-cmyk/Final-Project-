const express = require("express");

const {
    createEventPlan,
    getMyEventPlans,
    getEventPlanById,
    addMealToEventPlan,
    removeMealFromEventPlan,
    updateEventPlanStatus,
    getEventPlanRecommendations
} = require("../controllers/eventPlanController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    authenticateToken,
    authorizeRoles("customer"),
    createEventPlan
);

router.get(
    "/my-plans",
    authenticateToken,
    authorizeRoles("customer"),
    getMyEventPlans
);

router.get(
    "/:id/recommendations",
    authenticateToken,
    authorizeRoles("customer"),
    getEventPlanRecommendations
);

router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("customer"),
    getEventPlanById
);

router.post(
    "/:id/items",
    authenticateToken,
    authorizeRoles("customer"),
    addMealToEventPlan
);

router.delete(
    "/:id/items/:itemId",
    authenticateToken,
    authorizeRoles("customer"),
    removeMealFromEventPlan
);

router.put(
    "/:id/status",
    authenticateToken,
    authorizeRoles("customer"),
    updateEventPlanStatus
);

module.exports = router;
