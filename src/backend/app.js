require('dotenv/config');

const express = require('express');
const cors = require('cors');
const dbconfig = require('./dbconfig');

dbconfig.db_connect();

const db_client = dbconfig.db_client;

process.on('exit', (code) => {
    console.log(`SERVER: exiting with code: ${code}`);
    db_client.end();
});

process.on('SIGINT', (code) => {
    console.log(`SERVER: stopping`);
    db_client.end();
    process.exit(0);
});

const PORT = process.env.PORT || 3000;
const app = express();

app.listen(PORT, () => {
    console.log(`SERVER: listening on ${PORT}`);
});

/*app.use((req, res, next) =>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT");
    app.use(cors());
    next();
});*/

app.use(cors());
app.use(express.json());
app.options('*', cors());

const strategy_router = require('./routes/strategy_routes');
app.use(strategy_router);

const comment_router = require('./routes/comment_routes');
app.use(comment_router);

const user_router = require('./routes/user_routes');
app.use(user_router);

const request_router = require('./routes/request_routes');
app.use(request_router);

const vote_router = require('./routes/vote_routes');
app.use(vote_router);