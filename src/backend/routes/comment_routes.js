const express = require("express");
const router = express.Router();
const comment_controller = require("../controllers/comment_controllers");

router.get('/strategies/:name/comments', comment_controller.getComments);
router.get('/strategies/:name/comments/:id', comment_controller.getComment);

router.post('/strategies/:name/comments', comment_controller.postComment);
router.post('/strategies/:name/comments/:id', comment_controller.postReplyComment);

module.exports = router;