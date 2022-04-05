const user_services = require('../services/user_services');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = class profile_controllers{
    static async registerUser(req, res, next){
        const username = req.body.username;
        const email = req.body.email; 
        const github = req.body.github;

        if(req.body.password.length != 12){
            return res.status(400).send({error_message: "password must contain 12 digits"});
        }
        const password = await bcrypt.hash(req.body.password, 10);

        const user_inserted = await user_services.insertUser(username, email, password, github);
        
        if(!user_inserted){
            return res.status(400).send({error_message: "username or email or github already in use"});   //WIP: separar
        }

        const token_info = {username, user_type: 0};
        const access_token = jwt.sign(token_info, process.env.JWT_SECRET);

        res.status(200).send({
            message: "success: registered",
            access_token,
            username,
            user_type: 'Regular User'
        });
    }



    static async authenticateUser(req, res, next){
        const username = req.body.username;
        const password = req.body.password;

        if(password.length != 12){
            return res.status(400).send({error_message: "password must contain 12 digits"});
        }

        const user = await user_services.getUser(username);
        if(!user || !await bcrypt.compare(password, user.password)){
            return res.status(400).send({error_message: "username or password is incorrect"});
        }

        const token_info = {username, user_type: user.user_type};
        const access_token = jwt.sign(token_info, process.env.JWT_SECRET);

        res.status(200).send({
            message: "success: logged in", 
            access_token, 
            username, 
            user_type: ['Regular User', 'Council Member', 'Administrator'][user.user_type]
        });
    }
}