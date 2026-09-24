const preferenceRoutes = require("./routes/preferenceRoutes");
const publicMealRoutes = require("./routes/publicMealRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const flavorMatchRoutes = require("./routes/flavorMatchRoutes");
const express = require("express");
const reviewSummaryRoutes = require("./routes/reviewSummaryRoutes");
const smartSearchRoutes = require("./routes/smartSearchRoutes");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cookRoutes = require("./routes/cookRoutes");
const mealRoutes = require("./routes/mealRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const addressRoutes = require("./routes/addressRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const {
    authenticateToken,
    authorizeRoles
} = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "BasraFlavor API is running"
    });
});

app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            message: "Database connected successfully",
            time: result.rows[0].now
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Database connection failed"
        });
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/cook", cookRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/preferences", preferenceRoutes);
app.use("/api/public-meals", publicMealRoutes);
app.use("/api/smart-search", smartSearchRoutes);
app.use("/api/review-summary", reviewSummaryRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/flavor-match", flavorMatchRoutes);

app.get(
    "/api/test-cook",
    authenticateToken,
    authorizeRoles("cook"),
    (req, res) => {
        res.json({
            message: "Cook route accessed successfully",
            user: req.user
        });
    }
);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Server error"
    });
});

module.exports = app;






