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

async function openDatabase(mongodb_url) {
    if (url && url === mongodb_url && client) {
        return client;
    }
    url = mongodb_url;
    client = await MongoClient.connect(url, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
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
