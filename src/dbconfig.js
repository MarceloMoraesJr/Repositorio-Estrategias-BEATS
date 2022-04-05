const { Client } = require("pg")

const db_client = new Client();

function db_connect(){
    db_client.connect((err) => {
        if(err){
            console.log(err);
            console.log('FATAL ERROR: Unable to connect to database');
            process.exit(1);
        }
        console.log("Database connected!");
    });
}

module.exports = {
    db_client,
    db_connect
};