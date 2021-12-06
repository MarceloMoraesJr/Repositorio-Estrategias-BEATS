const db_client = require('../dbconfig').db_client;
const FuzzySearch = require('fuzzy-search');

function fuzzySearchStrategiesName(strategies, name){
    let strategies_names = [];
    
    strategies_names = strategies.flatMap((strategy, index) => {
        const arr = strategy.aliases.map((alias) => {return {name: alias, index}});
        arr.push({name: strategy.name, index});
        return arr;
    });

    const searcher = new FuzzySearch(strategies_names, ['name'], {
        sort: true
    });

    strategies_names = searcher.search(name);
    

    const set = new Set();
    strategies_names.forEach((strategy) => {
        set.add(strategies[strategy['index']]);
    });
    
    return Array.from(set.keys());
}



module.exports = class strategy_services{
    static async getAllStrategies(){
        try{
            const text = "SELECT ea.nome as name, ea.tipo as type, ea.c, ea.i, ea.a, ea.authn, ea.authz, ea.acc, ea.nr, s.sinonimo AS aliases\
                                FROM estrategia_arquitetural ea\
                                LEFT JOIN sinonimo_estrategia s ON ea.nome = s.estrategia";

            const db_strategies = await db_client.query(text);
            
            let strategies = {};

            db_strategies.rows.forEach(strategy => {
                if(strategies[strategy.name] === undefined){
                    strategies[strategy.name] = strategy;
                    strategies[strategy.name].aliases = [strategy.aliases]; 
                } 
                else{
                    strategies[strategy.name].aliases.push(strategy.aliases);
                }
            });

            return Object.values(strategies);
        }
        catch(err){
            console.log(err);
        }
    }



    static async getStrategiesFiltered(name, type, attributes){
        let strategies = await this.getAllStrategies();
        
        strategies = strategies.filter(strategy => {
            return (strategy.c || !attributes.c) &&
                   (strategy.i || !attributes.i) &&
                   (strategy.a || !attributes.a) &&
                   (strategy.authn || !attributes.authn) &&
                   (strategy.authz || !attributes.authz) &&
                   (strategy.acc || !attributes.acc) &&
                   (strategy.nr || !attributes.nr) &&
                   (!type || type == strategy.type);
        });

        if(name && strategies.length > 0){
            strategies = fuzzySearchStrategiesName(strategies, name);
        }
        
        return strategies;
    }

};