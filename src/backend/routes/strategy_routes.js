const express = require("express");
const router = express.Router();
const strategy_controller = require("../controllers/strategy_controllers");

router.get('/strategies', strategy_controller.searchStrategies);
router.get('/strategies/:name', strategy_controller.getStrategy);
router.get('/strategies/:name/images', strategy_controller.listStrategyImagesName);
router.get('/strategies/:name/images/:imagename', strategy_controller.getStrategyImageByName);

module.exports = router;