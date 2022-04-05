const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/user_controllers");

const middlewares = require('../middlewares');

router.post('/register', middlewares.assertBodyFields(['username', 'email', 'password', 'github']),
user_controller.registerUser);

router.post('/login', middlewares.assertBodyFields(['username', 'password']), 
user_controller.authenticateUser);

module.exports = router;