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



function preprocessAddRequestForm(req, res, next){
    const infosec_attributes = ['c', 'i', 'a', 'authn', 'authz', 'acc', 'nr'];

    for(let attr of infosec_attributes){
        const bool_string = req.body[attr].toUpperCase();
        if(bool_string === "TRUE" || bool_string === "FALSE"){
            req.body[attr] = bool_string === "TRUE";
        }
        else{
            return res.status(400).send({error_message: 'infosec attributes must be written as an boolean'});
        }
    }

    req.body.aliases = JSON.parse(req.body.aliases);
    if(!Array.isArray(req.body.aliases)){
        return res.status(400).send({error_message: 'aliases must be written as an array'});
    }

    next();
}

module.exports = {
    assertBodyFields,
    authorizeUser,
    preprocessAddRequestForm,
};