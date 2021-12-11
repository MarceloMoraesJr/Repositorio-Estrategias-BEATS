const jwt = require('jsonwebtoken');

function assertBodyFields(body_fields){
    return function(req, res, next){
        const fields_undefined = [];
        
        body_fields.forEach(field => {
            if(!req.body[field]){
                fields_undefined.push(field);        
            }
        });

        if(fields_undefined.length > 0){
            return res.status(400).send({
                error_message: "request should contain the following body fields",
                fields: fields_undefined
            });
        }
        
        next();
    }
}


function authorizeUser(allowed_user_types){
    return function (req, res, next){
        if(!req.headers.authorization){
            return res.status(401).send({error_message: "include authorization field in header"});
        }

        const token = req.headers.authorization.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user_info) =>{
            if(err || !allowed_user_types.includes(user_info.user_type)){
                return res.status(403).send({error_message: "unauthorized"});
            }
            
            req.user_info = user_info;
            next();
        });
    }   
}

module.exports = {
    assertBodyFields,
    authorizeUser
};