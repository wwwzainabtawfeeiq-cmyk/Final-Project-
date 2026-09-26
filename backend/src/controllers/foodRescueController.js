const pool = require("../config/db");

const createOffer = async (req, res) => {
    try {
        const {
            meal_id,
            original_price,
            rescue_price,
            available_quantity,
            pickup_deadline
        } = req.body;

        if (
            !meal_id ||
            original_price == null ||
            rescue_price == null ||
            !available_quantity ||
            !pickup_deadline
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const meal = await pool.query(
            `
            SELECT id
            FROM meals
            WHERE id = $1
              AND cook_id = $2
            `,
            [meal_id, req.user.id]
        );

        if (meal.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Meal not found or does not belong to this cook"
            });
        }

        if (Number(rescue_price) > Number(original_price)) {
            return res.status(400).json({
                success: false,
                message: "Rescue price cannot be greater than original price"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO food_rescue_offers
            (
                meal_id,
                cook_id,
                original_price,
                rescue_price,
                available_quantity,
                remaining_quantity,
                pickup_deadline
            )
            VALUES ($1, $2, $3, $4, $5, $5, $6)
            RETURNING *
            `,
            [
                meal_id,
                req.user.id,
                original_price,
                rescue_price,
                available_quantity,
                pickup_deadline
            ]
        );

        res.status(201).json({
            success: true,
            message: "Food rescue offer created successfully",
            offer: result.rows[0]
        });

    } catch (error) {
        console.error("Create food rescue offer error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const getAvailableOffers = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                fro.id,
                fro.meal_id,
                fro.cook_id,
                m.name AS meal_name,
                m.description AS meal_description,
                fro.original_price,
                fro.rescue_price,
                fro.remaining_quantity,
                fro.pickup_deadline,
                fro.status
            FROM food_rescue_offers fro
            JOIN meals m ON m.id = fro.meal_id
            WHERE fro.status = 'active'
              AND fro.remaining_quantity > 0
              AND fro.pickup_deadline > CURRENT_TIMESTAMP
            ORDER BY fro.pickup_deadline ASC
            `
        );

        res.json({
            success: true,
            offers: result.rows
        });

    } catch (error) {
        console.error("Get food rescue offers error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const claimOffer = async (req, res) => {
    const client = await pool.connect();

    try {
        const { offerId } = req.params;
        const quantity = Number(req.body.quantity);

        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than zero"
            });
        }

        await client.query("BEGIN");

        const offerResult = await client.query(
            `
            SELECT *
            FROM food_rescue_offers
            WHERE id = $1
            FOR UPDATE
            `,
            [offerId]
        );

        if (offerResult.rows.length === 0) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                success: false,
                message: "Food rescue offer not found"
            });
        }

        const offer = offerResult.rows[0];

        if (
            offer.status !== "active" ||
            offer.remaining_quantity < quantity ||
            new Date(offer.pickup_deadline) <= new Date()
        ) {
            await client.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                message: "Offer is unavailable"
            });
        }

        const totalPrice =
            Number(offer.rescue_price) * quantity;

        const claimResult = await client.query(
            `
            INSERT INTO food_rescue_claims
            (
                offer_id,
                customer_id,
                quantity,
                total_price
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [
                offerId,
                req.user.id,
                quantity,
                totalPrice
            ]
        );

        const newRemaining =
            offer.remaining_quantity - quantity;

        const newStatus =
            newRemaining === 0 ? "sold_out" : "active";

        await client.query(
            `
            UPDATE food_rescue_offers
            SET remaining_quantity = $1,
                status = $2
            WHERE id = $3
            `,
            [
                newRemaining,
                newStatus,
                offerId
            ]
        );

        await client.query("COMMIT");

        res.status(201).json({
            success: true,
            message: "Food rescue offer claimed successfully",
            claim: claimResult.rows[0]
        });

    } catch (error) {
        await client.query("ROLLBACK");

        console.error("Claim food rescue offer error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    } finally {
        client.release();
    }
};


const getMyOffers = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                fro.*,
                m.name AS meal_name
            FROM food_rescue_offers fro
            JOIN meals m ON m.id = fro.meal_id
            WHERE fro.cook_id = $1
            ORDER BY fro.id DESC
            `,
            [req.user.id]
        );

        res.json({
            success: true,
            offers: result.rows
        });

    } catch (error) {
        console.error("Get my food rescue offers error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    createOffer,
    getAvailableOffers,
    claimOffer,
    getMyOffers
};