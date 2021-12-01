const { Client } = require("pg")

const db_client = new Client({
    user: 'database_test',
    host: '172.23.118.129',
    database: 'mvp_database',
    password: 'database_password',
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