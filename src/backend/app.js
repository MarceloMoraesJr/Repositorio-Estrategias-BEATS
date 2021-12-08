require('dotenv/config');

const express = require('express');
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

app.use(express.json());

const strategy_router = require('./routes/strategy_routes');
app.use(strategy_router);

const comment_router = require('./routes/comment_routes');
app.use(comment_router);