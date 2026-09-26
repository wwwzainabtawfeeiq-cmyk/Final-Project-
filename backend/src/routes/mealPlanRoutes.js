const express = require("express");

const {
    createMealPlan,
    addMealToPlan,
    getMyMealPlans,
    getMealPlanById,
    removeMealFromPlan
} = require("../controllers/mealPlanController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    authenticateToken,
    authorizeRoles("customer"),
    createMealPlan
);

router.get(
    "/",
    authenticateToken,
    authorizeRoles("customer"),
    getMyMealPlans
);

router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("customer"),
    getMealPlanById
);

router.post(
    "/:planId/meals",
    authenticateToken,
    authorizeRoles("customer"),
    addMealToPlan
);

router.delete(
    "/items/:itemId",
    authenticateToken,
    authorizeRoles("customer"),
    removeMealFromPlan
);

module.exports = router;