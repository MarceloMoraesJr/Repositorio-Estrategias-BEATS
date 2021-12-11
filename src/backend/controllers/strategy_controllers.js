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
        
        const strategies = await strategy_services.getStrategiesFiltered(name, type, attributes);
        strategies.forEach((strategy) => {
            strategy.type = ['Pattern', 'Tactic'][strategy.type];
        });

        return res.status(200).send({strategies});
    }

    

    static async getStrategy(req, res, next){
        const name = req.params.name;
        let strategy = await strategy_services.getStrategyByName(name);

        if(!strategy){
            return res.status(404).send({error_message: `strategy '${name}' does not exist`});
        }

        const aliases = await strategy_services.getStrategyAliases(name);
        strategy.aliases = aliases;

        const documentation = await strategy_services.getStrategyDocumentation(strategy.documentation_path);
        
        strategy = {...strategy, ...documentation};
        delete strategy.documentation_path;
        delete strategy.images_path;
        strategy.type = ['Pattern', 'Tactic'][strategy.type];

        return res.status(200).send(strategy);
    }
};