const strategy_services = require("../services/strategy_services");

module.exports = class strategy_controllers{
    static async searchStrategies(req, res, next) {
        const attributes = {
            c: false,
            i: false,
            a: false,
            authn: false,
            authz: false,
            acc: false,
            nr: false
        }

        if(req.query.attr != undefined){
            var attributes_array = [];
            if(!Array.isArray(req.query.attr)){
                attributes_array.push(req.query.attr);
            }
            else{
                attributes_array = req.query.attr;
            }
            
            attributes_array.forEach(attr => {
                if(attributes[attr] != undefined){
                    attributes[attr] = true;
                }
            });
        }

        let name = "";
        if(req.query.name != undefined){
            name = req.query.name;
        }
        
        res.send({estrategias: await strategy_services.getStrategiesFiltered(name, type, attributes)}).status(200);
    }
};