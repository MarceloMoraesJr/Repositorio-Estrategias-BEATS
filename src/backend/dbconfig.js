const { Client } = require("pg")

const db_client = new Client({
    user: 'postgres',
    host: '172.28.197.12',
    database: 'sampledb',
    password: 'pgpass',
    port: 5432,
});

function db_connect(){
    db_client.connect((err) => {
        if(err) throw err;
        console.log("Database connected!");
    });
}

module.exports = {
    db_client,
    db_connect
};