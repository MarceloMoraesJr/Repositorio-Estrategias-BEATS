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
        
        if(req.query.attr){
            let attributes_array = [];
            if(!Array.isArray(req.query.attr)){
                attributes_array.push(req.query.attr);
            }
            else{
                attributes_array = req.query.attr;
            }
            
            for(let attr of attributes_array){
                const attr_lc = attr.toLowerCase();
                if(attributes[attr_lc] === undefined){
                    return res.status(400).send({error_message:`infosec attribute '${attr}' does not exist`});
                }
                else{
                    attributes[attr_lc] = true;
                }
            }
        }

        let name = null;
        if(req.query.name){
            if(Array.isArray(req.query.name)){
                name = req.query.name[0];
            }
            else{
                name = req.query.name;
            }
        }

        let type = null;
        if(req.query.type){
            if(Array.isArray(req.query.type)){
                type = req.query.type[0];
            }
            else{
                type = req.query.type;
            }

            switch(type.toUpperCase()){
                case "PATTERN":
                    type = 0;
                    break;
                case "TACTIC":
                    type = 1;
                    break;
                default:
                    return res.status(400).send({error_message:`strategy type '${type}' does not exist`});
            }
        }
        
        return res.status(200).send({strategies: await strategy_services.getStrategiesFiltered(name, type, attributes)});
    }

    

    static async getStrategy(req, res, next){
        const name = req.params.name;
        res.status(200).send({name});
    }
};