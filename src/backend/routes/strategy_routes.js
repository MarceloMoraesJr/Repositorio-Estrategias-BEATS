const express = require("express");
const router = express.Router();
const strategy_controller = require("../controllers/strategy_controllers");

router.get('/strategies', strategy_controller.searchStrategies);
router.get('/strategies/:name', strategy_controller.getStrategy);

module.exports = router;