const db_client = require('../dbconfig').db_client;
const FuzzySearch = require('fuzzy-search');
const fs = require('fs').promises;

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
            const text = "SELECT ea.nome AS name, ea.tipo AS type,\
            ea.c, ea.i, ea.a, ea.authn, ea.authz, ea.acc, ea.nr, s.sinonimo AS aliases\
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



    static async getStrategyAliases(name){
        try{
            const text = "SELECT s.sinonimo AS alias\
            FROM estrategia_arquitetural ea\
            JOIN sinonimo_estrategia s ON ea.nome = s.estrategia\
            WHERE ea.nome = $1;"
            const values = [name];

            const db_aliases = await db_client.query(text, values);

            return db_aliases.rows.map((row) => row.alias);
        }
        catch(err){
            console.log(err);
        }
    }



    static async getStrategyByName(name){
        try{
            const text = "SELECT ea.nome AS name, ea.tipo AS type,\
            ea.c, ea.i, ea.a, ea.authn, ea.authz, ea.acc, ea.nr,\
            ea.username_criador AS username_creator,\
            ea.data_publicacao AS publish_date,\
            ea.caminho_documentacao AS documentation_path,\
            ea.caminho_imagens AS images_path\
            FROM estrategia_arquitetural ea\
            WHERE ea.nome = $1;"
            const values = [name];

            const db_strategies = await db_client.query(text, values);

            if(db_strategies.rowCount === 0){
                return null;
            }

            return db_strategies.rows[0];
        }
        catch(err){
            console.log(err);
        }
    }



    static async getStrategyDocumentation(documentation_path){
        try{
            const data = await fs.readFile(process.env.PATH_DOCUMENTATION + documentation_path);
            const documentation = JSON.parse(data);

            return documentation;
        }   
        catch(err){
            console.log(err);
        }
    }



    static async strategyExists(name){
        try{
            const text = "SELECT ea.nome\
            FROM estrategia_arquitetural ea\
            WHERE ea.nome = $1;"
            const values = [name];

            const db_strategies = await db_client.query(text, values);
            return db_strategies.rowCount > 0;
        }
        catch(err){
            console.log(err);
        }
    }



    static async getStrategyImagesNames(images_path){
        try{
            return await fs.readdir(process.env.PATH_DOCUMENTATION + images_path);
        }
        catch(err){
            console.log(err);
        }
    }
};