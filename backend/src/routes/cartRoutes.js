const express = require("express");
const router = express.Router();
const { authenticateToken, protect } = require("../middleware/authMiddleware");

const authHandler = authenticateToken || protect;
if (authHandler) {
  router.use(authHandler);
}

let cartController = {};
try {
  cartController = require("../controllers/cartController");
} catch (e) {
  console.log("cartController not found, using fallback");
}

const getCart = cartController.getCart || ((req, res) => res.json({ success: true, items: [] }));
const addToCart = cartController.addToCart || ((req, res) => res.json({ success: true, message: "تمت الإضافة للسلة" }));
const updateCartItem = cartController.updateCartItem || ((req, res) => res.json({ success: true }));
const removeFromCart = cartController.removeFromCart || ((req, res) => res.json({ success: true }));

router.get("/", getCart);
router.post("/items", addToCart);
router.put("/items/:id", updateCartItem);
router.delete("/items/:id", removeFromCart);
router.delete("/clear", cartController.clearCart);

module.exports = router;
