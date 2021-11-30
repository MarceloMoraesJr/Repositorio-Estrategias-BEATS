const express = require("express");
const router = express.Router();
const strategy_controller = require("../controllers/strategy_controllers");

router.get('/strategies', strategy_controller.searchStrategies);

module.exports = router;