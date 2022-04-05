const express = require("express");
const router = express.Router();
const vote_controller = require("../controllers/vote_controllers");

const middlewares = require('../middlewares');

router.post('/vote/:protocol', middlewares.authorizeUser([1,2]), vote_controller.voteAssert, 
            vote_controller.adminVote, vote_controller.councilVoteAssert, vote_controller.councilVote);

module.exports = router;