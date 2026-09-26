const express = require("express");

const {
    getPublicCooks,
    getPublicCookById
} = require("../controllers/publicCookController");

const router = express.Router();

router.get("/", getPublicCooks);
router.get("/:id", getPublicCookById);

module.exports = router;
