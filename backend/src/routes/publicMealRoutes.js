const express = require("express");
const {
  getPublicMeals,
  getPublicMealById,
} = require("../controllers/publicMealController");

const router = express.Router();

router.get("/", getPublicMeals);
router.get("/:id", getPublicMealById);

module.exports = router;
