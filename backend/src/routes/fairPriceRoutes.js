const express = require("express");

const {
    calculateFairPrice
} = require("../controllers/fairPriceController");

const {
    setMealCost
} = require("../controllers/mealCostController");

const router = express.Router();

router.post("/meal/:mealId", setMealCost);

router.get("/meal/:mealId", calculateFairPrice);

module.exports = router;
