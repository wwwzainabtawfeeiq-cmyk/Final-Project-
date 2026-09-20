const express = require("express");

const {
    createMeal,
    getMyMeals,
    updateMeal,
    deleteMeal
} = require("../controllers/mealController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    authenticateToken,
    authorizeRoles("cook"),
    createMeal
);

router.get(
    "/my-meals",
    authenticateToken,
    authorizeRoles("cook"),
    getMyMeals
);

router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("cook"),
    updateMeal
);

router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("cook"),
    deleteMeal
);

module.exports = router;