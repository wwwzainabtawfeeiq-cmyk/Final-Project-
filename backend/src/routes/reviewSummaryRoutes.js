const express = require("express");
const {
    getMealReviewSummary
} = require("../controllers/reviewSummaryController");

const router = express.Router();

router.get("/meal/:mealId", getMealReviewSummary);

module.exports = router;
