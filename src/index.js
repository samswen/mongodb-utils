'use strict';

const MongoClient = require('mongodb').MongoClient;

module.exports = {
    getMongoClient,
    openDatabase,
    closeDatabase
};

let url = null;
let client = null;
let database = null;

function getMongoClient() {
    return client;
}

async function openDatabase(mongodb_url, min_size = 4, pool_size = 16) {
    if (database && client && url && url === mongodb_url) {
        return database;
    }
    url = mongodb_url;
    client = await MongoClient.connect(url, { 
        useUnifiedTopology: true,
        minSize: min_size,
        poolSize: pool_size,
    });
    database = client.db();
    return database;
}

async function closeDatabase() {
    url = null;
    database = null;
    if (!client) {
        return;
    }
    try {
        await client.close();
        client = null;
    } catch (err) {
        console.error(err);
    }
}
