const strategy_services = require("../services/strategy_services");

module.exports = class strategy_controllers{
    static async apiSearchStrategies(req, res, next) {
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
            var desired = [];
            if(!Array.isArray(req.query.attr)){
                desired.push(req.query.attr);
            }
            else{
                desired = req.query.attr;
            }
            
            desired.forEach(attr => {
                if(attributes[attr] != undefined){
                    attributes[attr] = true;
                }
            });
        }

        let name = "";
        if(req.query.name === undefined){
            
        }
        
        res.send({estrategias: await strategy_services.getStrategiesFiltered(attributes)}).status(200);
    }
};