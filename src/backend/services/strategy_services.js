const db_client = require('../dbconfig').db_client;
const fuzzy = require('fuzzy-search');

module.exports = class strategy_services{
    static async getAllStrategies(){
        try{
            const text = "SELECT ea.nome, ea.tipo, ea.c, ea.i, ea.a, ea.authn, ea.authz, ea.acc, ea.nr, s.sinonimo AS sinonimos\
                                FROM estrategia_arquitetural ea\
                                LEFT JOIN sinonimo_estrategia s ON ea.nome = s.estrategia";

            const db_strategies = await db_client.query(text);
            
            let strategies = {};

            db_strategies.rows.forEach(strategy => {
                if(strategies[strategy.nome] === undefined){
                    strategies[strategy.nome] = strategy;
                    strategies[strategy.nome].sinonimos = [strategy.sinonimos]; 
                } 
                else{
                    strategies[strategy.nome].sinonimos.push(strategy.sinonimos);
                }
            });

            return Object.values(strategies);
        }
        catch(err){
            console.log(err);
        }
    }

    static async getStrategiesFiltered(name, attributes){
        let strategies = await this.getAllStrategies();
        
        strategies = strategies.filter(strategy => {
            return (strategy.c || !attributes.c) &&
                   (strategy.i || !attributes.i) &&
                   (strategy.a || !attributes.a) &&
                   (strategy.authn || !attributes.authn) &&
                   (strategy.authz || !attributes.authz) &&
                   (strategy.acc || !attributes.acc) &&
                   (strategy.nr || !attributes.nr);
        });

        if(name === ""){
            return strategies;
        }

        const searcher = new FuzzySearch(strategies, ['nome', 'sinonimos.nome'], {sort: true});

        console.log(searcher.search(name));

        return strategies;
    }
};