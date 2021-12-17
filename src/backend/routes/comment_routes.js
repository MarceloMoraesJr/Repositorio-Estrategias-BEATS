const express = require("express");
const router = express.Router();
const comment_controller = require("../controllers/comment_controllers");

const middlewares = require('../middlewares');

router.get('/strategies/:name/comments', comment_controller.getComments);
router.get('/strategies/:name/comments/:id', comment_controller.getComment);

router.post('/strategies/:name/comments', middlewares.assertBodyFields(['text']),
            middlewares.authorizeUser([0, 1, 2]), comment_controller.postComment);
router.post('/strategies/:name/comments/:id', middlewares.assertBodyFields(['text']),
            middlewares.authorizeUser([0, 1, 2]), comment_controller.postReplyComment);

router.delete('/strategies/:name/comments/:id', middlewares.authorizeUser([0, 1, 2]),
              comment_controller.deleteComment);

router.put('/strategies/:name/comments/:id', middlewares.authorizeUser([0, 1, 2]),
           middlewares.assertBodyFields(['text']), comment_controller.editComment);

module.exports = router;