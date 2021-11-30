const express = require('express');
const dbconfig = require('./dbconfig');

try{
    dbconfig.db_connect();
}
catch(err){
    console.log("ERROR: server couldn't connect to database");
}

const db_client = dbconfig.db_client;

const PORT = 3000;
const app = express();

app.listen(PORT, ()=>{
    console.log(`listening... on ${PORT}`);
});

app.use(express.json());

const strategy_router = require('./routes/strategy_routes');

app.use(strategy_router);