const express = require("express");
const { smartSearch } = require("../controllers/smartSearchController");

const router = express.Router();

router.get("/smart", smartSearch);

module.exports = router;
