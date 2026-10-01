const express = require("express");
const router = express.Router();

const { calculateFairPrice } = require("../controllers/fairPriceController");
const { setMealCost } = require("../controllers/mealCostController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

// ضبط تكلفة الوجبة: متاح للطباخ والأدمن فقط
router.post(
  "/meal/:mealId",
  authenticateToken,
  authorizeRoles("cook", "admin"),
  setMealCost
);

// حساب السعر العادل: يتطلب توثيق المستخدم
router.get(
  "/meal/:mealId",
  authenticateToken,
  calculateFairPrice
);

module.exports = router;
